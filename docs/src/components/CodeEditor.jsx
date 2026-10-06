import { useRef } from 'react'
import { highlight } from './highlight'

// Identical metrics for the highlighted <pre> and the transparent <textarea> laid over it
const TEXT = 'm-0 p-4 font-mono text-xs leading-relaxed [tab-size:2] whitespace-pre'

// Edits go through execCommand when possible so the browser's own undo / redo keeps working
const insert = (field, text) => {
	if (document.execCommand?.('insertText', false, text)) return
	field.setRangeText(text, field.selectionStart, field.selectionEnd, 'end')
	field.dispatchEvent(new Event('input', { bubbles: true }))
}

const replaceRange = (field, start, end, text, selectStart, selectEnd) => {
	field.setSelectionRange(start, end)
	insert(field, text)
	field.setSelectionRange(selectStart, selectEnd)
}

/**
 * Syntax-highlighted code editor: a transparent textarea over a highlighted <pre>, so there is no editor library.
 * Tab indents (Shift+Tab outdents) and Enter keeps the indentation. Press Escape, then Tab, to move focus on.
 */
const CodeEditor = ({ value, onChange, label = 'Code editor', lang = 'js', className = '' }) => {
	const released = useRef(false) // Escape was pressed: the next Tab leaves the editor

	const handleKeyDown = event => {
		const field = event.currentTarget
		const { selectionStart: start, selectionEnd: end } = field
		const plain = !event.ctrlKey && !event.metaKey && !event.altKey

		if (event.key === 'Escape') {
			released.current = true
			return
		}
		if (event.key === 'Tab' && plain) {
			if (released.current) {
				released.current = false
				return
			}
			event.preventDefault()
			const multiline = value.slice(start, end).includes('\n')
			if (!event.shiftKey && !multiline) {
				insert(field, '\t')
				return
			}
			// Indent / outdent every line the selection touches
			const lineStart = value.lastIndexOf('\n', start - 1) + 1
			const lines = value.slice(lineStart, end).split('\n')
			const changed = lines.map(line => (event.shiftKey ? line.replace(/^(\t| {1,2})/, '') : `\t${line}`))
			const next = changed.join('\n')
			const removedFirst = lines[0].length - changed[0].length
			const total = lines.join('\n').length - next.length
			replaceRange(field, lineStart, end, next, Math.max(lineStart, start - removedFirst), end - total)
			return
		}
		released.current = false
		if (event.key === 'Enter' && plain && !event.shiftKey) {
			event.preventDefault()
			const lineStart = value.lastIndexOf('\n', start - 1) + 1
			const line = value.slice(lineStart, start)
			const indent = /^[\t ]*/.exec(line)[0]
			const opens = /[{([]\s*$/.test(line)
			insert(field, `\n${indent}${opens ? '\t' : ''}`)
		}
	}

	return (
		<div className={`relative overflow-x-auto bg-app-card ${className}`}>
			<div className="relative min-w-max">
				<pre aria-hidden="true" className={`${TEXT} pointer-events-none text-app-text`}>
					<code>{highlight(`${value}\n`, lang)}</code>
				</pre>
				<textarea
					aria-label={label}
					value={value}
					onChange={event => onChange(event.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={() => (released.current = false)}
					spellCheck={false}
					autoCapitalize="off"
					autoComplete="off"
					autoCorrect="off"
					wrap="off"
					className={`${TEXT} absolute inset-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent text-transparent caret-[rgb(var(--color-app-text))] outline-none selection:bg-app-soft/30 focus-visible:shadow-[inset_0_0_0_2px_rgb(var(--color-app-strong))]`}
				/>
			</div>
		</div>
	)
}

export default CodeEditor
