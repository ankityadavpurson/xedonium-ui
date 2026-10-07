import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import useDialogFocus from '../hooks/useDialogFocus'
import useEscapeKey from '../hooks/useEscapeKey'

export interface Command {
	key: string
	label: string
	description?: string
	group?: string
	shortcut?: string
	onSelect?: () => void
}

export interface CommandPaletteProps {
	open: boolean
	/** Called on Escape, backdrop click and after a command runs. */
	onClose: () => void
	commands: Command[]
	placeholder?: string
	/** Shown when nothing matches. */
	empty?: ReactNode
	/** Called with the search text on every change (and with `''` when the palette opens), e.g. to fetch results. */
	onQueryChange?: (query: string) => void
	/** Filter `commands` by the search text here. Defaults to `true`, or `false` when `onQueryChange` is set. */
	filter?: boolean
	/** Shows a "Searching…" row and `aria-busy` while results are being fetched. */
	loading?: boolean
	/** Wrap the matched text of each label and description in `<mark>`. */
	highlight?: boolean
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Splits text around case-insensitive matches of the query and marks them
const Highlighted = ({ text, query }: { text: string; query: string }) => {
	const needle = query.trim()
	if (!needle) return <>{text}</>
	const parts = text.split(new RegExp(`(${escapeRegExp(needle)})`, 'i'))
	return (
		<>
			{parts.map((part, i) =>
				i % 2 === 1 ? (
					<mark key={i} className="bg-amber-300/50 text-inherit">
						{part}
					</mark>
				) : (
					part
				)
			)}
		</>
	)
}

/**
 * Searchable command list in a modal (open it from a shortcut, e.g. with useKeyboardShortcuts('mod+k')).
 * commands: [{ key, label, description?, group?, shortcut?, onSelect }]. Arrow keys move, Enter runs, Escape closes.
 * `onClose` is called after a command runs as well, so the parent just sets `open` to false.
 * For async search pass `onQueryChange` (to fetch), `loading`, and the fetched `commands` (each with an optional `group`);
 * the list is then not filtered again here unless `filter` is set. `highlight` marks the matched text.
 */
const CommandPalette = ({
	open,
	onClose,
	commands,
	placeholder = 'Type a command…',
	empty = 'No matching commands',
	onQueryChange,
	filter = !onQueryChange,
	loading = false,
	highlight = false,
}: CommandPaletteProps) => {
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(0)
	const dialogRef = useRef<HTMLDivElement>(null)
	const listRef = useRef<HTMLUListElement>(null)
	const listId = useId()

	useEscapeKey(open, onClose)
	useDialogFocus(open, dialogRef)

	useEffect(() => {
		if (open) {
			setQuery('')
			setActive(0)
			onQueryChange?.('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when the palette opens
	}, [open])

	const results = useMemo(() => {
		const needle = query.trim().toLowerCase()
		const matching =
			needle && filter
				? commands.filter(c => `${c.label} ${c.description ?? ''} ${c.group ?? ''}`.toLowerCase().includes(needle))
				: commands
		// Keep each group together (in order of first appearance) so its heading shows once
		const groups = [...new Set(matching.map(c => c.group))]
		return groups.flatMap(group => matching.filter(c => c.group === group))
	}, [commands, query, filter])

	useEffect(() => {
		listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' })
	}, [active, results])

	if (!open) return null

	const run = (command?: Command) => {
		if (!command) return
		onClose()
		command.onSelect?.()
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			setActive(i => (results.length ? (i + 1) % results.length : 0))
		} else if (event.key === 'ArrowUp') {
			event.preventDefault()
			setActive(i => (results.length ? (i - 1 + results.length) % results.length : 0))
		} else if (event.key === 'Enter') {
			event.preventDefault()
			run(results[active])
		}
	}

	return createPortal(
		<div className="fixed inset-0 z-[var(--xd-z-modal,80)] flex items-start justify-center px-4 pt-[15vh]">
			<div aria-hidden="true" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-label="Command palette"
				tabIndex={-1}
				className="relative z-10 flex max-h-[60vh] w-full max-w-xl flex-col border border-app-border bg-app-card shadow-2xl"
			>
				<input
					data-autofocus
					role="combobox"
					aria-expanded="true"
					aria-controls={listId}
					aria-activedescendant={results[active] ? `${listId}-${results[active].key}` : undefined}
					aria-autocomplete="list"
					value={query}
					onChange={e => {
						setQuery(e.target.value)
						setActive(0)
						onQueryChange?.(e.target.value)
					}}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					aria-label="Search commands"
					className="w-full border-b border-app-border bg-transparent px-4 py-3 text-sm text-app-text outline-none placeholder:text-app-muted"
				/>
				<ul
					id={listId}
					ref={listRef}
					role="listbox"
					aria-label="Commands"
					aria-busy={loading || undefined}
					className="m-0 flex-1 list-none overflow-y-auto p-0"
				>
					{loading && (
						<li role="presentation" aria-live="polite" className="px-4 py-2 text-xs text-app-muted">
							Searching…
						</li>
					)}
					{!loading && results.length === 0 && (
						<li className="px-4 py-6 text-center text-sm text-app-muted">{empty}</li>
					)}
					{results.map((command, index) => {
						const showGroup = command.group && command.group !== results[index - 1]?.group
						return (
							<li key={command.key} role="presentation">
								{showGroup && (
									<div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-app-muted">
										{command.group}
									</div>
								)}
								<div
									id={`${listId}-${command.key}`}
									role="option"
									aria-selected={index === active}
									onMouseMove={() => setActive(index)}
									onClick={() => run(command)}
									className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${
										index === active ? 'bg-app-strong text-app-bg' : 'text-app-text'
									}`}
								>
									<span className="min-w-0">
										<span className="block truncate">
											{highlight ? <Highlighted text={command.label} query={query} /> : command.label}
										</span>
										{command.description && (
											<span className={`block truncate text-xs ${index === active ? 'opacity-80' : 'text-app-muted'}`}>
												{highlight ? <Highlighted text={command.description} query={query} /> : command.description}
											</span>
										)}
									</span>
									{command.shortcut && (
										<kbd
											className={`shrink-0 border px-1.5 py-0.5 text-[10px] ${index === active ? 'border-app-bg/40' : 'border-app-border text-app-muted'}`}
										>
											{command.shortcut}
										</kbd>
									)}
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>,
		document.body
	)
}

export default CommandPalette
