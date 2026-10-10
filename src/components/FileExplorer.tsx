import { useMemo, useState, type ReactNode } from 'react'
import { describeNode, readableSize, sortNodes } from '../utils/files'
import Button from './Button'
import Input from './Input'
import Table, { type TableColumn } from './Table'
import ToggleButton from './ToggleButton'
import ToggleButtonGroup from './ToggleButtonGroup'
import Tree, { type TreeNode } from './Tree'
import FileTextIcon from './icons/FileText'
import FolderIcon from './icons/Folder'
import FolderOpenIcon from './icons/FolderOpen'
import FolderTreeIcon from './icons/FolderTree'
import HomeIcon from './icons/Home'
import LayoutGridIcon from './icons/LayoutGrid'
import ListIcon from './icons/List'
import RefreshIcon from './icons/Refresh'
import ArrowUpIcon from './icons/ArrowUp'

export interface FileExplorerNode {
	/** Unique among all files and folders in this explorer. */
	id: string
	name: string
	type: 'file' | 'folder'
	/** Size in bytes (a folder's is its total). */
	size?: number
	/** When it was last changed (a date, or an ISO string / timestamp); shown in the list view. */
	modified?: string | number | Date
	/** The entries of a folder. */
	children?: FileExplorerNode[]
	/** How many entries a folder has when its `children` are not loaded yet (load them when `onPathChange` fires). */
	itemCount?: number
}

export type FileExplorerView = 'grid' | 'list' | 'tree'

export interface FileExplorerProps {
	/** The entries at the root. Folders hold their own `children`. */
	nodes: FileExplorerNode[]
	/** Called when a file is clicked (open it: a preview dialog, a download...). */
	onSelect?: (file: FileExplorerNode) => void
	/** Id of the highlighted file. */
	selected?: string
	/** Which layout: `grid` of cards, a `list` table, or the `tree` of every folder (default `grid`). */
	view?: FileExplorerView
	defaultView?: FileExplorerView
	onViewChange?: (view: FileExplorerView) => void
	/** The layouts the user can switch between (default all three; with one, the switch is hidden). */
	views?: FileExplorerView[]
	/** The open folder as the ids of its folders from the root (`[]` is the root), for the grid and list views. */
	path?: string[]
	defaultPath?: string[]
	/** Called when the user opens a folder or uses the breadcrumbs. Load a folder's `children` here when they are lazy. */
	onPathChange?: (path: string[], folder?: FileExplorerNode) => void
	/** Adds a reload button that calls this. */
	onRefresh?: () => void
	/** The entries are loading: they cannot be opened and a message shows. */
	loading?: boolean
	/** Expanded folder ids of the tree view (uncontrolled start, and controlled). */
	defaultExpanded?: string[]
	expanded?: string[]
	onExpandedChange?: (keys: string[]) => void
	/** Placed after the layout switch in the toolbar. */
	toolbarEnd?: ReactNode
	/** Shown in an empty folder. */
	emptyText?: string
	/** Accessible name of the explorer. */
	label?: string
	className?: string
}

const NodeIcon = ({ node }: { node: FileExplorerNode }) =>
	node.type === 'file' ? (
		<FileTextIcon className="h-5 w-5 shrink-0 text-sky-500" />
	) : (node.itemCount ?? node.children?.length ?? 0) === 0 ? (
		<FolderOpenIcon className="h-5 w-5 shrink-0 text-orange-500" />
	) : (
		<FolderIcon className="h-5 w-5 shrink-0 text-orange-500" />
	)

const dateText = (value: FileExplorerNode['modified']) => {
	if (value === undefined) return ''
	const date = value instanceof Date ? value : new Date(value)
	return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString(undefined, { dateStyle: 'medium' })
}

// Toolbar controls share the height of the search box (an input is 38px: two 8px paddings, a 20px line and borders)
const CONTROL = 'inline-flex h-[38px] items-center justify-center'
const ICON_CONTROL = `${CONTROL} w-[38px] !p-0`

const VIEW_LABEL: Record<FileExplorerView, string> = { grid: 'Grid view', list: 'List view', tree: 'Tree view' }

/**
 * Browse files and folders: the open folder's entries as cards or a table, with breadcrumbs, a name filter, folders
 * first, sizes and item counts, and a reload button. Clicking a folder opens it (`path` / `onPathChange`, so the page can
 * load a folder's content on demand), clicking a file calls `onSelect`. The `tree` view shows every folder at once
 * with the keyboard behaviour of Tree. Use `onSelect` to show a file, for example in a full-screen Modal with CodeDisplay.
 */
const FileExplorer = ({
	nodes,
	onSelect,
	selected,
	view: viewProp,
	defaultView = 'grid',
	onViewChange,
	views = ['grid', 'list', 'tree'],
	path: pathProp,
	defaultPath = [],
	onPathChange,
	onRefresh,
	loading = false,
	defaultExpanded,
	expanded,
	onExpandedChange,
	toolbarEnd,
	emptyText = 'This folder is empty.',
	label = 'Files',
	className = '',
}: FileExplorerProps) => {
	const [innerView, setInnerView] = useState(defaultView)
	const [innerPath, setInnerPath] = useState(defaultPath)
	const [filter, setFilter] = useState('')
	const view = viewProp ?? innerView
	const path = pathProp ?? innerPath

	// the folders along the path (a path that no longer exists falls back to what can be reached)
	const trail = useMemo(() => {
		const folders: FileExplorerNode[] = []
		let entries = nodes
		for (const id of path) {
			const folder = entries.find(node => node.id === id && node.type === 'folder')
			if (!folder) break
			folders.push(folder)
			entries = folder.children ?? []
		}
		return folders
	}, [nodes, path])
	const entries = sortNodes(trail.length ? (trail[trail.length - 1].children ?? []) : nodes)
	const query = filter.trim().toLowerCase()
	const visible = query ? entries.filter(node => node.name.toLowerCase().includes(query)) : entries
	const folderCount = entries.filter(node => node.type === 'folder').length
	const fileCount = entries.length - folderCount

	const changeView = (next: FileExplorerView) => {
		if (viewProp === undefined) setInnerView(next)
		onViewChange?.(next)
	}
	const goTo = (ids: string[], folder?: FileExplorerNode) => {
		if (pathProp === undefined) setInnerPath(ids)
		setFilter('')
		onPathChange?.(ids, folder)
	}
	const open = (node: FileExplorerNode) => {
		if (loading) return
		if (node.type === 'folder') goTo([...trail.map(folder => folder.id), node.id], node)
		else onSelect?.(node)
	}
	const goUp = () =>
		goTo(
			trail.slice(0, -1).map(folder => folder.id),
			trail[trail.length - 2]
		)

	const rootFiles = new Map<string, FileExplorerNode>()
	const toTree = (items: FileExplorerNode[]): TreeNode[] =>
		sortNodes(items).map(node => {
			rootFiles.set(node.id, node)
			return {
				key: node.id,
				label: node.name,
				children: node.type === 'folder' ? toTree(node.children ?? []) : undefined,
			}
		})

	const hasModified = entries.some(node => node.modified !== undefined)
	const columns: TableColumn<FileExplorerNode>[] = [
		{
			key: 'name',
			header: 'Name',
			render: node => (
				<button
					type="button"
					disabled={loading}
					onClick={() => open(node)}
					className={`inline-flex max-w-full items-center gap-2 text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-app-strong ${
						selected === node.id ? 'font-semibold' : ''
					}`}
				>
					<NodeIcon node={node} />
					<span className="truncate">{node.name}</span>
				</button>
			),
		},
		...(hasModified
			? [{ key: 'modified', header: 'Modified', render: (node: FileExplorerNode) => dateText(node.modified) || '-' }]
			: []),
		{
			key: 'items',
			header: 'Items',
			align: 'right',
			render: node => (node.type === 'folder' ? String(node.itemCount ?? node.children?.length ?? 0) : '-'),
		},
		{
			key: 'size',
			header: 'Size',
			align: 'right',
			render: node => (node.size === undefined ? '-' : readableSize(node.size)),
		},
	]

	const treeMode = view === 'tree'
	const crumbs = [{ id: '', name: 'Root' }, ...trail]

	return (
		<section
			aria-label={label}
			aria-busy={loading || undefined}
			className={`flex min-w-0 flex-col border border-app-border bg-app-card text-app-text ${className}`}
		>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border p-3">
				<div className="min-w-0 text-xs text-app-muted">
					{treeMode
						? `${nodes.length} entries at the top`
						: `${folderCount} ${folderCount === 1 ? 'folder' : 'folders'}, ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{!treeMode && (
						<div className="w-full sm:w-52">
							<Input
								type="search"
								aria-label="Filter files"
								placeholder="Filter by name…"
								value={filter}
								onChange={setFilter}
							/>
						</div>
					)}
					{onRefresh && (
						<Button
							variant="secondary"
							aria-label="Reload"
							tooltip="Reload"
							disabled={loading}
							onClick={onRefresh}
							className={ICON_CONTROL}
						>
							<RefreshIcon className="h-4 w-4" />
						</Button>
					)}
					{views.length > 1 && (
						<ToggleButtonGroup
							exclusive
							aria-label="Layout"
							value={view}
							onChange={value => value && changeView(value as FileExplorerView)}
						>
							{views.map(item => (
								<ToggleButton
									key={item}
									value={item}
									aria-label={VIEW_LABEL[item]}
									tooltip={VIEW_LABEL[item]}
									className={ICON_CONTROL}
								>
									{item === 'grid' ? (
										<LayoutGridIcon className="h-4 w-4" />
									) : item === 'list' ? (
										<ListIcon className="h-4 w-4" />
									) : (
										<FolderTreeIcon className="h-4 w-4" />
									)}
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					)}
					{toolbarEnd}
				</div>
			</div>

			{!treeMode && (
				<nav
					aria-label="Folder path"
					className="flex flex-wrap items-center gap-1 border-b border-app-border px-3 py-2 text-xs"
				>
					{trail.length > 0 && (
						<Button
							variant="flat"
							aria-label="Up one level"
							tooltip="Up one level"
							disabled={loading}
							onClick={goUp}
							className="mr-1 !p-1.5"
						>
							<ArrowUpIcon />
						</Button>
					)}
					{crumbs.map((crumb, index) => {
						const last = index === crumbs.length - 1
						return (
							<span key={crumb.id || 'root'} className="inline-flex items-center gap-1">
								{index > 0 && (
									<span aria-hidden="true" className="text-app-border">
										/
									</span>
								)}
								{last ? (
									<span aria-current="page" className="inline-flex items-center gap-1 font-semibold text-app-text">
										{index === 0 && <HomeIcon className="h-4 w-4" />}
										{crumb.name}
									</span>
								) : (
									<button
										type="button"
										disabled={loading}
										onClick={() =>
											goTo(
												trail.slice(0, index).map(folder => folder.id),
												trail[index - 1]
											)
										}
										className="inline-flex items-center gap-1 text-app-muted underline-offset-2 outline-none hover:text-app-text hover:underline focus-visible:ring-2 focus-visible:ring-app-strong"
									>
										{index === 0 && <HomeIcon className="h-4 w-4" />}
										{crumb.name}
									</button>
								)}
							</span>
						)
					})}
				</nav>
			)}

			<div className="p-3">
				{loading ? (
					<p role="status" className="m-0 px-3 py-8 text-center text-sm text-app-muted">
						Loading…
					</p>
				) : treeMode ? (
					<Tree
						nodes={toTree(nodes)}
						selected={selected}
						onSelect={key => {
							const node = rootFiles.get(key)
							if (node?.type === 'file') onSelect?.(node)
						}}
						defaultExpanded={defaultExpanded}
						expanded={expanded}
						onExpandedChange={onExpandedChange}
						label={label}
						renderLabel={node => (
							<span className="flex min-w-0 items-center gap-2">
								{rootFiles.get(node.key) && <NodeIcon node={rootFiles.get(node.key) as FileExplorerNode} />}
								<span className="truncate">{node.label as ReactNode}</span>
							</span>
						)}
					/>
				) : entries.length === 0 ? (
					<p className="m-0 px-3 py-8 text-center text-sm text-app-muted">{emptyText}</p>
				) : visible.length === 0 ? (
					<p className="m-0 px-3 py-8 text-center text-sm text-app-muted">No file or folder matches.</p>
				) : view === 'grid' ? (
					<ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
						{visible.map(node => (
							<li key={node.id}>
								<button
									type="button"
									onClick={() => open(node)}
									title={node.name}
									className={`flex w-full items-center gap-3 border bg-app-bg px-3 py-2.5 text-left outline-none transition hover:border-app-strong focus-visible:ring-2 focus-visible:ring-app-strong ${
										selected === node.id ? 'border-app-strong' : 'border-app-border'
									}`}
								>
									<NodeIcon node={node} />
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-medium">{node.name}</span>
										<span className="block truncate text-xs text-app-muted">{describeNode(node)}</span>
									</span>
								</button>
							</li>
						))}
					</ul>
				) : (
					<Table columns={columns} rows={visible} rowKey="id" caption="Files and folders" />
				)}
			</div>
		</section>
	)
}

export default FileExplorer
