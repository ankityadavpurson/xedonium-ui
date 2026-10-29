import { useEffect, useRef, useState } from 'react'
import { LiveError, LivePreview, LiveProvider } from 'react-live'
import { ChevronRightIcon, CircleHelpIcon, Popover, ToggleButton, ToggleButtonGroup } from 'xedonium'
import { loadSource } from '../exampleLoader'
import HELP from '../playground/help'
import { scope, toLiveCode } from '../playground/live'
import { loadTailwindRuntime } from '../playground/tailwindRuntime'
import { CopyButton } from './CodeBlock'
import CodeEditor from './CodeEditor'
import Markdown from './Markdown'

const toolButton =
	'text-[10px] font-semibold uppercase tracking-widest text-app-muted transition hover:text-app-text disabled:cursor-not-allowed disabled:opacity-40'

/**
 * The live part of a section: the running result on top, its source below. The source is editable and re-runs on every
 * change (react-live); Reset restores the original and Copy takes the current text. When a component has several
 * examples a toggle picks which one is shown (each keeps its own edits).
 */
const LiveBody = ({ title, sources, help, className = '' }) => {
	const [which, setWhich] = useState(0)
	const [edits, setEdits] = useState({})
	const showTabs = sources.length > 1 || Boolean(help)
	const source = sources[which]
	const code = edits[which] ?? source

	return (
		<LiveProvider code={toLiveCode(code)} scope={scope} noInline>
			<div className={`flex flex-col gap-4 ${className}`}>
				<div className="flex flex-col gap-4">
					{showTabs && (
						<div className="flex items-center justify-between gap-3">
							{sources.length > 1 ? (
								<ToggleButtonGroup
									exclusive
									aria-label={`${title} examples`}
									value={String(which)}
									onChange={value => setWhich(Number(value ?? which))}
								>
									{sources.map((_, i) => (
										<ToggleButton key={i} value={String(i)}>
											Example {i + 1}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							) : (
								<span />
							)}
							{help && (
								<Popover
									label={help.label}
									trigger={<CircleHelpIcon className="h-4 w-4" />}
									align="end"
									className="w-80"
								>
									<div className="flex flex-col gap-2 text-sm text-app-text">
										<strong>{help.label}</strong>
										<Markdown>{help.md}</Markdown>
									</div>
								</Popover>
							)}
						</div>
					)}
					<div className="flex flex-col gap-3">
						<div data-demo className="min-w-0 overflow-x-auto">
							<LivePreview />
						</div>
					</div>
				</div>
				<div className="border border-app-border bg-app-card">
					<div className="flex items-center justify-between gap-3 px-3">
						<div className="ml-auto flex items-center gap-3">
							<button
								type="button"
								disabled={code === source}
								onClick={() => setEdits(e => ({ ...e, [which]: undefined }))}
								className={`${toolButton} py-3`}
							>
								Reset
							</button>
							<CopyButton text={code} />
						</div>
					</div>
					<CodeEditor
						value={code}
						onChange={value => setEdits(e => ({ ...e, [which]: value }))}
						label={`${title} code`}
						className="border-t border-app-border"
					/>
					<LiveError
						role="alert"
						data-live-error
						className="m-0 overflow-x-auto whitespace-pre-wrap border-t border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300"
					/>
				</div>
			</div>
		</LiveProvider>
	)
}

/**
 * One component of the Playground: a titled row that opens to its live examples. Closed sections cost nothing: the
 * examples are only loaded and compiled when the section is opened. `focused` (the URL names this component) opens it
 * and scrolls it into view. `keys` are the example files of the component's docs page.
 * `plain` drops the row: the examples are always open, on the page itself (a component's own Playground page).
 */
const LiveSection = ({ title, id, keys, focused = false, plain = false }) => {
	const [open, setOpen] = useState(focused || plain)
	const [sources, setSources] = useState(null)
	const ref = useRef(null)

	useEffect(() => {
		if (!focused || plain) return
		setOpen(true)
		ref.current?.scrollIntoView({ block: 'start' })
	}, [focused, plain])

	useEffect(() => {
		if (open) loadTailwindRuntime().catch(() => {})
	}, [open])

	useEffect(() => {
		if (!open || sources) return undefined
		let cancelled = false
		Promise.all(keys.map(key => loadSource(key))).then(texts => {
			if (!cancelled) setSources(texts)
		})
		return () => {
			cancelled = true
		}
		// `keys` is a new array on every render; its contents are what matter
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, sources, keys.join('|')])

	if (plain) {
		return sources && <LiveBody title={title} sources={sources} help={HELP[id]} />
	}

	return (
		<section
			ref={ref}
			id={id}
			aria-label={title}
			className={`flex scroll-mt-4 flex-col border bg-app-card ${focused ? 'border-app-strong shadow-[0_0_0_1px_rgb(var(--color-app-strong))]' : 'border-app-border'}`}
		>
			<h2 className="m-0">
				<button
					type="button"
					aria-expanded={open}
					onClick={() => setOpen(o => !o)}
					className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-app-muted outline-none transition hover:bg-app-bg hover:text-app-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong"
				>
					{title}
					<ChevronRightIcon className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
				</button>
			</h2>
			{open && sources && (
				<LiveBody title={title} sources={sources} help={HELP[id]} className="border-t border-app-border p-4" />
			)}
		</section>
	)
}

export default LiveSection
