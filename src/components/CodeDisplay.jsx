import { useEffect, useRef, useState } from 'react'

/**
 * Read-only code block with an optional title, line numbers and a copy button. `code` is a string; `language` is shown
 * as a caption (no syntax highlighting is applied).
 */
const CodeDisplay = ({
	code,
	language,
	title,
	lineNumbers = false,
	copyable = true,
	wrap = false,
	maxHeight,
	className = '',
}) => {
	const [copied, setCopied] = useState(false)
	const timer = useRef(null)
	useEffect(() => () => clearTimeout(timer.current), [])

	const text = String(code ?? '')
	const lines = text.replace(/\n$/, '').split('\n')

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text)
		} catch {
			return
		}
		setCopied(true)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setCopied(false), 1500)
	}

	return (
		<figure className={`m-0 border border-app-border bg-app-card ${className}`}>
			{(title || language || copyable) && (
				<figcaption className="flex items-center justify-between gap-2 border-b border-app-border px-3 py-1.5">
					<span className="min-w-0 truncate text-xs font-semibold uppercase tracking-widest text-app-muted">
						{title ?? language}
					</span>
					{copyable && (
						<button
							type="button"
							onClick={copy}
							className="text-xs font-semibold uppercase tracking-widest text-app-muted outline-none transition hover:text-app-text focus-visible:ring-2 focus-visible:ring-app-strong"
						>
							{copied ? 'Copied' : 'Copy'}
						</button>
					)}
				</figcaption>
			)}
			<pre
				tabIndex={0}
				data-language={language}
				style={maxHeight ? { maxHeight } : undefined}
				className={`m-0 overflow-auto p-3 font-mono text-xs leading-relaxed text-app-text outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong ${
					wrap ? 'whitespace-pre-wrap break-words' : ''
				}`}
			>
				<code>
					{lines.map((line, index) => (
						<span key={index} className="flex">
							{lineNumbers && (
								<span
									aria-hidden="true"
									className="mr-3 inline-block w-8 shrink-0 select-none text-right text-app-muted"
								>
									{index + 1}
								</span>
							)}
							<span className="min-w-0 flex-1">{line || ' '}</span>
						</span>
					))}
				</code>
			</pre>
		</figure>
	)
}

export default CodeDisplay
