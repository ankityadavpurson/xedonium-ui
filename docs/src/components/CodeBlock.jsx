import { useEffect, useRef, useState } from 'react'
import { highlight } from './highlight'

// Clipboard API needs a secure, focused document; fall back to a hidden textarea + execCommand otherwise
const copyText = async text => {
	try {
		await navigator.clipboard.writeText(text)
		return true
	} catch {
		const area = document.createElement('textarea')
		area.value = text
		area.setAttribute('readonly', '')
		area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
		document.body.appendChild(area)
		area.select()
		try {
			return document.execCommand('copy')
		} catch {
			return false
		} finally {
			area.remove()
		}
	}
}

/** Copy button with a short "Copied" confirmation (announced to screen readers). */
export const CopyButton = ({ text, className = '' }) => {
	const [state, setState] = useState('idle') // idle | copied | failed
	const timer = useRef(null)
	useEffect(() => () => clearTimeout(timer.current), [])

	const copy = async () => {
		setState((await copyText(text)) ? 'copied' : 'failed')
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setState('idle'), 1600)
	}

	return (
		<button
			type="button"
			onClick={copy}
			className={`border border-app-border bg-app-card px-2 py-2 text-[10px] font-semibold uppercase tracking-widest text-app-muted transition hover:border-app-strong sm:py-1 hover:text-app-text ${className}`}
		>
			{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
			<span role="status" className="sr-only">
				{state === 'copied' ? 'Code copied to clipboard' : ''}
			</span>
		</button>
	)
}

/** Syntax-highlighted code with a copy button. `lang` is js (default, also JSX) or bash; `lineNumbers` numbers the lines. */
const CodeBlock = ({ code, lang = 'js', lineNumbers = false, className = '' }) => {
	const text = code.trim()
	return (
		<div className={`relative border border-app-border bg-app-card ${className}`}>
			<CopyButton text={code} className="absolute right-2 top-2" />
			<div className="flex overflow-x-auto font-code text-sm leading-[1.35]">
				{lineNumbers && (
					<pre
						aria-hidden="true"
						className="sticky left-0 m-0 select-none border-r border-app-border bg-app-card px-3 py-4 text-right font-code text-app-muted"
					>
						{Array.from({ length: text.split('\n').length }, (_, i) => i + 1).join('\n')}
					</pre>
				)}
				<pre className="m-0 min-w-max flex-1 p-4 pr-20 font-code font-semibold text-app-text [tab-size:2]">
					<code>{highlight(text, lang)}</code>
				</pre>
			</div>
		</div>
	)
}

export default CodeBlock
