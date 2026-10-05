import { useEffect, useRef, useState } from 'react'

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
			className={`border border-app-border bg-app-card px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-app-muted transition hover:border-app-strong hover:text-app-text ${className}`}
		>
			{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}
			<span role="status" className="sr-only">
				{state === 'copied' ? 'Code copied to clipboard' : ''}
			</span>
		</button>
	)
}

/** Preformatted code with a copy button. */
const CodeBlock = ({ code, className = '' }) => (
	<div className={`relative border border-app-border bg-app-card ${className}`}>
		<CopyButton text={code} className="absolute right-2 top-2" />
		<pre className="m-0 overflow-x-auto p-4 pr-20 text-xs leading-relaxed text-app-text">
			<code>{code.trim()}</code>
		</pre>
	</div>
)

export default CodeBlock
