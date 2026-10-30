import { useRef } from 'react'
import { highlight } from './highlight'

// Identical metrics for the highlighted <pre> and the transparent <textarea> laid over it
// geometricPrecision: no per-glyph rounding, so both layers stay character for character the same at any display scaling or zoom
const TEXT =
	'm-0 p-4 font-code text-sm leading-[1.35] [tab-size:2] whitespace-pre [text-rendering:geometricPrecision]'

const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
const CLOSERS = new Set(Object.values(PAIRS))
const VOID_TAGS = new Set(['area', 'br', 'col', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const WORD = /\w/

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

// The whole lines a selection touches: [first character, end of the last line]. A selection that stops at the very
// start of a line does not count that line.
const lineBlock = (value, start, end) => {
	const last = end > start && value[end - 1] === '\n' ? end - 1 : end
	const from = value.lastIndexOf('\n', start - 1) + 1
	const newline = value.indexOf('\n', last)
	return [from, newline === -1 ? value.length : newline]
}

const indentOf = (value, at) => /^[\t ]*/.exec(value.slice(value.lastIndexOf('\n', at - 1) + 1, at))[0]

// Ctrl+/: comment the lines out, or take the comment off when every one of them has it
const toggleComment = (field, value, start, end) => {
	const [from, to] = lineBlock(value, start, end)
	const lines = value.slice(from, to).split('\n')
	const filled = lines.filter(line => line.trim())
	const commented = filled.length > 0 && filled.every(line => /^\s*\/\/ ?/.test(line))
	const indent = Math.min(...filled.map(line => /^\s*/.exec(line)[0].length))
	const next = lines.map(line => {
		if (!line.trim()) return line
		return commented ? line.replace(/^(\s*)\/\/ ?/, '$1') : `${line.slice(0, indent)}// ${line.slice(indent)}`
	})
	const text = next.join('\n')
	const first = next[0].length - lines[0].length
	replaceRange(field, from, to, text, Math.max(from, start + first), end + text.length - (to - from))
}

// Alt+Up / Down moves the lines, Shift+Alt+Up / Down copies them
const moveLines = (field, value, start, end, up, copy) => {
	const [from, to] = lineBlock(value, start, end)
	const block = value.slice(from, to)
	if (copy) {
		// the selection follows the copy when it goes down and stays on the original when it goes up
		const shift = up ? 0 : block.length + 1
		replaceRange(field, from, to, `${block}\n${block}`, start + shift, end + shift)
	} else if (up && from > 0) {
		const before = value.lastIndexOf('\n', from - 2) + 1
		const line = value.slice(before, from - 1)
		replaceRange(field, before, to, `${block}\n${line}`, start - line.length - 1, end - line.length - 1)
	} else if (!up && to < value.length) {
		const after = value.indexOf('\n', to + 1)
		const line = value.slice(to + 1, after === -1 ? value.length : after)
		replaceRange(field, from, to + 1 + line.length, `${line}\n${block}`, start + line.length + 1, end + line.length + 1)
	}
}

/**
 * Syntax-highlighted code editor: a transparent textarea over a highlighted <pre>, so there is no editor library.
 * Tab indents (Shift+Tab outdents) and Enter keeps the indentation. Press Escape, then Tab, to move focus on.
 * Brackets, quotes and JSX tags close themselves, and these shortcuts work (Cmd instead of Ctrl on a Mac):
 * Ctrl+/ comments lines, Alt+Up / Down moves them, Shift+Alt+Up / Down copies them, Ctrl+Shift+K deletes them,
 * Ctrl+Enter / Ctrl+Shift+Enter open a line below / above.
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

		const mod = event.ctrlKey || event.metaKey
		if (mod && !event.altKey) {
			const key = event.key.toLowerCase()
			if (key === '/') {
				event.preventDefault()
				toggleComment(field, value, start, end)
			} else if (key === 'k' && event.shiftKey) {
				event.preventDefault()
				const [from, to] = lineBlock(value, start, end)
				// take the line break with it, the one before when it is the last line
				const [a, b] = to < value.length ? [from, to + 1] : [Math.max(0, from - 1), to]
				replaceRange(field, a, b, '', a, a)
			} else if (key === 'enter') {
				event.preventDefault()
				const [from, to] = lineBlock(value, start, end)
				const indent = indentOf(value, from + 1)
				const at = event.shiftKey ? from : to
				const text = event.shiftKey ? `${indent}\n` : `\n${indent}`
				const caret = event.shiftKey ? from + indent.length : to + 1 + indent.length
				replaceRange(field, at, at, text, caret, caret)
			}
			return
		}
		if (event.altKey && !mod && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
			event.preventDefault()
			moveLines(field, value, start, end, event.key === 'ArrowUp', event.shiftKey)
			return
		}
		if (!plain) return

		const before = value[start - 1] ?? ''
		const after = value[end] ?? ''

		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			const indent = indentOf(value, start)
			const line = value.slice(value.lastIndexOf('\n', start - 1) + 1, start)
			const between =
				start === end &&
				((PAIRS[before] === after && '([{'.includes(before)) || (before === '>' && value.startsWith('</', start)))
			if (between) {
				// {|} or <div>|</div>: the closer drops to its own line and the caret waits on an indented one
				insert(field, `\n${indent}\t\n${indent}`)
				field.setSelectionRange(start + 2 + indent.length, start + 2 + indent.length)
			} else {
				insert(field, `\n${indent}${/[{([]\s*$/.test(line) ? '\t' : ''}`)
			}
			return
		}
		if (event.key === 'Backspace' && start === end && PAIRS[before] && PAIRS[before] === after) {
			event.preventDefault()
			replaceRange(field, start - 1, start + 1, '', start - 1, start - 1)
			return
		}
		if (CLOSERS.has(event.key) && start === end && after === event.key) {
			// typing the closer that is already there just steps over it
			event.preventDefault()
			field.setSelectionRange(start + 1, start + 1)
			return
		}
		if (PAIRS[event.key]) {
			const close = PAIRS[event.key]
			if (start !== end) {
				event.preventDefault()
				replaceRange(field, start, end, event.key + value.slice(start, end) + close, start + 1, end + 1)
				return
			}
			// quotes stay single inside words (don't); brackets pair before whitespace, a closer or the end
			const pair = close === event.key ? !WORD.test(before) && !WORD.test(after) : !after || /[\s)\]}>,;]/.test(after)
			if (pair) {
				event.preventDefault()
				insert(field, event.key + close)
				field.setSelectionRange(start + 1, start + 1)
			}
			return
		}
		if (event.key === '>' && start === end) {
			// finish an open JSX tag: <Card className="x"> gets its </Card>
			const line = value.slice(value.lastIndexOf('\n', start - 1) + 1, start)
			const tag = /<([A-Za-z][\w.]*)(?:\s[^<>]*)?$/.exec(line)
			if (tag && !VOID_TAGS.has(tag[1]) && !/[/=]\s*$/.test(line) && !value.startsWith(`</${tag[1]}>`, start)) {
				event.preventDefault()
				insert(field, `></${tag[1]}>`)
				field.setSelectionRange(start + 1, start + 1)
			}
		}
	}

	return (
		<div className={`group relative ${className}`}>
			<div className="overflow-x-auto bg-app-card">
				<div className="flex min-w-max">
					<pre
						aria-hidden="true"
						className="sticky left-0 z-10 m-0 select-none border-r border-app-border bg-app-card px-3 py-4 text-right font-code text-sm leading-[1.35] text-app-muted"
					>
						{Array.from({ length: value.split('\n').length }, (_, i) => i + 1).join('\n')}
					</pre>
					<div className="relative flex-1">
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
							id="code-editor-textarea"
							className={`${TEXT} absolute inset-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent text-transparent caret-[rgb(var(--color-app-text))] outline-none selection:bg-app-soft/30`}
						/>
					</div>
				</div>
			</div>
			{/* the frame sits above the line numbers, which are stacked over the text while it scrolls sideways */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-20 border border-app-border group-has-[textarea:focus-visible]:border-app-strong"
			/>
		</div>
	)
}

export default CodeEditor
