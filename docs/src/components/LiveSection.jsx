import { useState } from 'react'
import { LiveError, LivePreview, LiveProvider } from 'react-live'
import { Label } from 'xedonium'
import { scope, toLiveCode } from '../playground/live'
import { CopyButton } from './CodeBlock'
import CodeEditor from './CodeEditor'

const toolButton =
	'text-[10px] font-semibold uppercase tracking-widest text-app-muted transition hover:text-app-text disabled:cursor-not-allowed disabled:opacity-40'

/**
 * One playground section: the running result on top, its source below. The source is editable and re-runs on
 * every change (react-live); Reset restores the original and Copy takes the current text.
 */
const LiveSection = ({ title, source }) => {
	const [code, setCode] = useState(source)
	const [open, setOpen] = useState(false)

	return (
		<section className="flex flex-col border border-app-border bg-app-card">
			<LiveProvider code={toLiveCode(code)} scope={scope} noInline>
				<div className="flex flex-col gap-3 p-5">
					<Label as="h2">{title}</Label>
					<div data-demo className="min-w-0 overflow-x-auto">
						<LivePreview />
					</div>
				</div>
				<div className="flex items-center justify-between gap-3 border-t border-app-border px-3">
					<button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)} className={`${toolButton} py-3`}>
						{open ? 'Hide code' : 'Show code'}
					</button>
					<div className="flex items-center gap-3">
						<button
							type="button"
							disabled={code === source}
							onClick={() => setCode(source)}
							className={`${toolButton} py-3`}
						>
							Reset
						</button>
						<CopyButton text={code} />
					</div>
				</div>
				{open && (
					<CodeEditor value={code} onChange={setCode} label={`${title} code`} className="border-t border-app-border" />
				)}
				{/* shown even while the code is hidden, so a broken edit is never silent */}
				<LiveError
					role="alert"
					data-live-error
					className="m-0 overflow-x-auto whitespace-pre-wrap border-t border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300"
				/>
			</LiveProvider>
		</section>
	)
}

export default LiveSection
