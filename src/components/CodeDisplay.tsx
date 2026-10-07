import { useEffect, useRef, useState, type CSSProperties } from 'react'
import highlight, { TOKEN_KINDS, type TokenKind } from '../utils/highlight'

export type CodeColors = Partial<Record<TokenKind | 'text' | 'background', string>>

export interface CodeDisplayProps {
	code: string
	/** Caption and syntax colors: js / jsx / ts / tsx / json, bash / sh. */
	language?: string
	/** Header text; overrides `language` as the caption. */
	title?: string
	lineNumbers?: boolean
	/** Show a copy button (default true). */
	copyable?: boolean
	/** Wrap long lines instead of scrolling. */
	wrap?: boolean
	maxHeight?: number | string
	/** `false` turns the syntax colors off. */
	highlight?: boolean
	/** Override the palette with any CSS colors. */
	colors?: CodeColors
	className?: string
}

/**
 * Read-only code block with an optional title, line numbers and a copy button. `code` is a string; `language` is
 * shown as a caption and picks the syntax colors: js / jsx / ts / tsx / json and bash / sh are colored, other values
 * stay plain (`highlight={false}` turns the colors off). The default palette follows the light / dark theme
 * (`--xd-tok-*` in styles.css); pass `colors` to override: { comment, string, keyword, tag, attr, number, fn, text,
 * background } with any CSS color.
 */
const CodeDisplay = ({
	code,
	language,
	title,
	lineNumbers = false,
	copyable = true,
	wrap = false,
	maxHeight,
	highlight: colorize = true,
	colors,
	className = '',
}: CodeDisplayProps) => {
	const [copied, setCopied] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>()
	useEffect(() => () => clearTimeout(timer.current), [])

	const text = String(code ?? '')
	const lines = highlight(text.replace(/\n$/, ''), colorize ? language : undefined)

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

	// Overrides become CSS variables on the block, so the same spans pick them up
	const style: Record<string, string | number> = { ...(maxHeight ? { maxHeight } : {}) }
	if (colors) {
		TOKEN_KINDS.forEach(kind => {
			if (colors[kind]) style[`--xd-tok-${kind}`] = colors[kind]
		})
		if (colors.text) style.color = colors.text
	}

	return (
		<figure
			className={`m-0 border border-app-border bg-app-card ${className}`}
			style={colors?.background ? { background: colors.background } : undefined}
		>
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
				style={style as CSSProperties}
				className={`m-0 overflow-auto p-3 font-mono text-xs leading-relaxed text-app-text outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong ${
					wrap ? 'whitespace-pre-wrap break-words' : ''
				}`}
			>
				<code>
					{lines.map((segments, index) => (
						<span key={index} className="flex">
							{lineNumbers && (
								<span
									aria-hidden="true"
									className="mr-3 inline-block w-8 shrink-0 select-none text-right text-app-muted"
								>
									{index + 1}
								</span>
							)}
							<span className="min-w-0 flex-1">
								{segments.length === 0
									? ' '
									: segments.map((segment, i) =>
											segment.kind ? (
												<span
													key={i}
													style={{ color: `var(--xd-tok-${segment.kind})` }}
													className={segment.kind === 'comment' ? 'italic' : undefined}
												>
													{segment.text}
												</span>
											) : (
												segment.text
											)
										)}
							</span>
						</span>
					))}
				</code>
			</pre>
		</figure>
	)
}

export default CodeDisplay
