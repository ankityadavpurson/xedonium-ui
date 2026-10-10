// Compile-time checks, run by `yarn typecheck` (not by vitest): the published prop types accept what they should and
// reject what they should. Every `@ts-expect-error` below fails the typecheck if the line starts to compile.
import {
	Accordion,
	Button,
	ButtonGroup,
	DataGrid,
	FileExplorer,
	Loader,
	LogViewer,
	Markdown,
	Modal,
	NestedTable,
	NetworkConnection,
	PasswordStrengthInfo,
	Select,
	Toast,
	useDebouncedValue,
	useNetworkStatus,
	useScrollProgress,
	BackToTop,
	ScrollProgress,
	useUnsavedChanges,
	useTimedToast,
} from '../src'
import type { AccordionProps, LoaderProps, SelectOption } from '../src'

const options: SelectOption[] = [{ value: 'a', label: 'A' }]

export const valid = (
	<>
		<Accordion items={[{ key: 'a', title: 'A' }]} gap="md" multiple />
		<Loader variant="spinner" size="sm" icon="🚀" iconMotion="bounce" />
		<Select value="a" onChange={value => value.toUpperCase()} options={options} variant="flat" />
		<Markdown linkProp="to" openLinksInNewTab headingIds={false}>
			{'# Title'}
		</Markdown>
		<ButtonGroup orientation="vertical" aria-label="Zoom" attached={false} />
		<NestedTable<{ id: string; name: string }>
			columns={[{ key: 'name', header: 'Name', render: row => row.name }]}
			rows={[{ id: 'a', name: 'A', children: [{ id: 'b', name: 'B' }] }]}
			renderDetails={row => row.name}
			expandPosition="end"
		/>
		<PasswordStrengthInfo password="x" rules={[{ label: 'Long', test: p => p.length > 8, required: false }]} />
		<LogViewer
			logs={[{ id: 1, level: 'warn', message: 'm', timestamp: new Date(), data: { a: 1 } }]}
			appearance="dark"
		/>
		<FileExplorer
			nodes={[{ id: 'a', name: 'a', type: 'folder', children: [] }]}
			view="list"
			onPathChange={path => path.join('/')}
		/>
		<NetworkConnection variant="banner" probeUrl="/ping" onStatusChange={status => status.toUpperCase()} />
		<Modal open onClose={() => {}} fullScreenToggle defaultFullScreen />
		<Button variant="danger" tooltip="Hi" tooltipPlacement="top-end" onClick={() => {}} />
		<Toast position="top-center" toasts={[{ msg: 'Saved', type: 'success' }]} />
		<DataGrid<{ id: number; name: string }>
			rows={[{ id: 1, name: 'Ada' }]}
			columns={[{ key: 'name', header: 'Name', render: row => row.name.toUpperCase() }]}
		/>
	</>
)

export const props: [AccordionProps['gap'], LoaderProps['variant']] = ['lg', 'card']

export const invalid = (
	<>
		{/* @ts-expect-error gap is one of none | sm | md | lg */}
		<Accordion items={[]} gap="huge" />
		{/* @ts-expect-error variant is a fixed list */}
		<Loader variant="rainbow" />
		{/* @ts-expect-error openLinksInNewTab is a boolean */}
		<Markdown openLinksInNewTab="yes" />
		{/* @ts-expect-error a log level is one of four */}
		<LogViewer logs={[{ id: 1, level: 'fatal', message: 'm' }]} />
		{/* @ts-expect-error a status is one of four */}
		<NetworkConnection status="offline" />
		{/* @ts-expect-error a node is a file or a folder */}
		<FileExplorer nodes={[{ id: 'a', name: 'a', type: 'directory' }]} />
		{/* @ts-expect-error orientation is horizontal or vertical */}
		<ButtonGroup orientation="diagonal" />
		{/* @ts-expect-error items is required */}
		<Accordion />
		{/* @ts-expect-error unknown position */}
		<Toast position="somewhere" />
		{/* @ts-expect-error Select options need a value */}
		<Select options={[{ label: 'No value' }]} />
	</>
)

export const useIt = () => {
	const { showToast, hideToast } = useTimedToast(2000, { max: 3 })
	const id = showToast('Done', 'warning', { actions: [{ label: 'Undo', onClick: () => {} }] })
	hideToast(id)
	// @ts-expect-error not a toast type
	showToast('Done', 'purple')
}

export const hooks = () => {
	const text: string = useDebouncedValue('a', 200, { leading: true, maxWait: 1000 })
	const { status, check } = useNetworkStatus({ probeUrl: '/ping', interval: 5000 })
	// @ts-expect-error the status is a fixed list
	const bad: 'connected' = status
	return [text, check, bad]
}

export const UnsavedChangesCheck = () => {
	const { blocked, proceed, stay } = useUnsavedChanges({ when: true, links: false })
	const ok: boolean = blocked
	void ok
	proceed()
	stay()
	// @ts-expect-error `when` is required
	useUnsavedChanges({})
	return null
}

export const ScrollChecks = () => {
	const { progress, scrollTop, scrollable } = useScrollProgress()
	const total: number = progress + scrollTop
	void total
	void scrollable
	return (
		<>
			<BackToTop threshold={200} position="bottom-left" showProgress />
			<ScrollProgress variant="button" edge="top" thickness={3} />
			{/* @ts-expect-error unknown variant */}
			<ScrollProgress variant="ring" />
			{/* @ts-expect-error threshold is a number */}
			<BackToTop threshold="200" />
		</>
	)
}
