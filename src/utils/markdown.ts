// A small, dependency-free Markdown parser for the Markdown component: GitHub-style Markdown without raw HTML.
// It returns plain data (no React) so it is easy to test. Nothing here ever produces HTML: unsafe URLs are emptied and
// `<tags>` stay literal text, which is what keeps rendering the result safe.

export type Align = 'left' | 'center' | 'right' | null

export type Inline =
	| { type: 'text'; text: string }
	| { type: 'code'; text: string }
	| { type: 'strong' | 'em' | 'del'; children: Inline[] }
	/** `href` is empty when the URL was not allowed: render the children as plain text then. */
	| { type: 'link'; href: string; title?: string; children: Inline[] }
	/** `src` is empty when the URL was not allowed: render the alt text then. */
	| { type: 'image'; src: string; alt: string; title?: string }
	| { type: 'br' }

export interface ListItem {
	/** `true` / `false` for a task item (`- [x]` / `- [ ]`), `null` for a plain one. */
	checked: boolean | null
	children: Block[]
}

export type Block =
	| { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: Inline[] }
	| { type: 'paragraph'; children: Inline[] }
	| { type: 'blockquote'; children: Block[] }
	/** `loose` lists separate their items with blank lines, so each item keeps its paragraphs. */
	| { type: 'list'; ordered: boolean; start: number; loose: boolean; items: ListItem[] }
	| { type: 'code'; lang: string; text: string }
	| { type: 'table'; align: Align[]; header: Inline[][]; rows: Inline[][][] }
	| { type: 'hr' }

// ---------------------------------------------------------------------------------------------------------------
// URLs

const SCHEME = /^([a-z][a-z0-9+.-]*):/i
const LINK_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])

/**
 * The URL when it is safe to use, otherwise an empty string. Relative paths, `#anchors`, http(s), mailto and tel pass;
 * everything else (`javascript:`, `vbscript:`, `data:`...) does not, except `data:image/...` for images.
 */
export const safeUrl = (url: string, image = false) => {
	// browsers ignore whitespace and control characters inside a scheme (`java\nscript:`), so check without them
	const compact = [...url]
		.filter(char => char.charCodeAt(0) > 32 && char.charCodeAt(0) !== 127 && !/\s/.test(char))
		.join('')
	const scheme = SCHEME.exec(compact)?.[1].toLowerCase()
	if (!scheme) return url.trim()
	if (LINK_SCHEMES.has(scheme)) return url.trim()
	if (image && scheme === 'data' && /^data:image\//i.test(compact)) return url.trim()
	return ''
}

// ---------------------------------------------------------------------------------------------------------------
// Inline

const ESCAPABLE = '\\`*_{}[]()#+-.!|~<>"'
const isSpace = (char: string | undefined) => char === undefined || /\s/.test(char)
const isWord = (char: string | undefined) => char !== undefined && /[\p{L}\p{N}]/u.test(char)

/** Index just after the code span starting at `from` (a run of backticks), or -1 when it is never closed. */
const codeSpanEnd = (src: string, from: number) => {
	let run = 0
	while (src[from + run] === '`') run++
	for (let i = from + run; i < src.length; i++) {
		if (src[i] !== '`') continue
		let close = 0
		while (src[i + close] === '`') close++
		if (close === run) return i + close
		i += close - 1
	}
	return -1
}

/** Index of the delimiter that closes an emphasis run opened before `from`, skipping code spans and escapes. */
const findClose = (src: string, from: number, delimiter: string) => {
	for (let i = from; i < src.length; i++) {
		const char = src[i]
		if (char === '\\') {
			i++
			continue
		}
		if (char === '`') {
			const end = codeSpanEnd(src, i)
			if (end > 0) i = end - 1
			continue
		}
		if (!src.startsWith(delimiter, i) || i === from || isSpace(src[i - 1])) continue
		const single = delimiter.length === 1
		// a lone * or _ must not be half of a longer run
		if (single && (src[i + 1] === delimiter || src[i - 1] === delimiter)) continue
		if (delimiter.startsWith('_') && isWord(src[i + delimiter.length])) continue
		return i
	}
	return -1
}

/** The `[...]` label starting at `from` (where `src[from] === '['`): its text and the index after the `]`. */
const bracketEnd = (src: string, from: number) => {
	let depth = 0
	for (let i = from; i < src.length; i++) {
		const char = src[i]
		if (char === '\\') i++
		else if (char === '`') {
			const end = codeSpanEnd(src, i)
			if (end > 0) i = end - 1
		} else if (char === '[') depth++
		else if (char === ']' && --depth === 0) return i
	}
	return -1
}

interface Destination {
	url: string
	title?: string
	end: number
}

/** `(url "title")` starting at `from`, or null when it is not a well-formed destination. */
const parseDestination = (src: string, from: number): Destination | null => {
	if (src[from] !== '(') return null
	let i = from + 1
	while (/\s/.test(src[i] ?? '')) i++
	let url = ''
	if (src[i] === '<') {
		const close = src.indexOf('>', i)
		if (close < 0) return null
		url = src.slice(i + 1, close)
		i = close + 1
	} else {
		let depth = 0
		const start = i
		for (; i < src.length; i++) {
			const char = src[i]
			if (char === '\\') i++
			else if (/\s/.test(char)) break
			else if (char === '(') depth++
			else if (char === ')') {
				if (depth === 0) break
				depth--
			}
		}
		url = src.slice(start, i)
	}
	while (/\s/.test(src[i] ?? '')) i++
	let title: string | undefined
	const quote = src[i]
	if (quote === '"' || quote === "'" || quote === '(') {
		const closer = quote === '(' ? ')' : quote
		const close = src.indexOf(closer, i + 1)
		if (close < 0) return null
		title = src.slice(i + 1, close)
		i = close + 1
		while (/\s/.test(src[i] ?? '')) i++
	}
	if (src[i] !== ')') return null
	return { url: url.replace(/\\([\\()<>[\]])/g, '$1'), title, end: i + 1 }
}

const plain = (nodes: Inline[]): string =>
	nodes
		.map(node => {
			if (node.type === 'text' || node.type === 'code') return node.text
			if (node.type === 'image') return node.alt
			if (node.type === 'br') return ' '
			return plain(node.children)
		})
		.join('')

/** Plain text of inline nodes (used for image alt text and heading ids). */
export const inlineText = plain

const EMPHASIS: [string, (children: Inline[]) => Inline][] = [
	['***', children => ({ type: 'strong', children: [{ type: 'em', children }] })],
	['**', children => ({ type: 'strong', children })],
	['__', children => ({ type: 'strong', children })],
	['~~', children => ({ type: 'del', children })],
	['*', children => ({ type: 'em', children })],
	['_', children => ({ type: 'em', children })],
]

export const parseInline = (src: string): Inline[] => {
	const out: Inline[] = []
	let buffer = ''
	const flush = () => {
		if (buffer) out.push({ type: 'text', text: buffer })
		buffer = ''
	}

	let i = 0
	while (i < src.length) {
		const char = src[i]

		if (char === '\\') {
			const next = src[i + 1]
			if (next === '\n') {
				flush()
				out.push({ type: 'br' })
				i += 2
				continue
			}
			if (next !== undefined && ESCAPABLE.includes(next)) {
				buffer += next
				i += 2
				continue
			}
		}

		if (char === '\n' || (char === ' ' && /^ {2,}\n/.test(src.slice(i)))) {
			const hard = char === ' '
			const lineEnd = src.indexOf('\n', i)
			if (hard) {
				flush()
				out.push({ type: 'br' })
			} else buffer += ' '
			i = lineEnd + 1
			while (src[i] === ' ') i++
			continue
		}

		if (char === '`') {
			const end = codeSpanEnd(src, i)
			if (end < 0) {
				while (src[i] === '`') buffer += src[i++]
				continue
			}
			let run = 0
			while (src[i + run] === '`') run++
			let text = src.slice(i + run, end - run).replace(/\n/g, ' ')
			if (text.length > 1 && text.startsWith(' ') && text.endsWith(' ') && text.trim()) text = text.slice(1, -1)
			flush()
			out.push({ type: 'code', text })
			i = end
			continue
		}

		if (char === '!' && src[i + 1] === '[') {
			const close = bracketEnd(src, i + 1)
			const destination = close > 0 ? parseDestination(src, close + 1) : null
			if (destination) {
				flush()
				const alt = plain(parseInline(src.slice(i + 2, close)))
				out.push({ type: 'image', src: safeUrl(destination.url, true), alt, title: destination.title })
				i = destination.end
				continue
			}
		}

		if (char === '[') {
			const close = bracketEnd(src, i)
			const destination = close > 0 ? parseDestination(src, close + 1) : null
			if (destination) {
				flush()
				out.push({
					type: 'link',
					href: safeUrl(destination.url),
					title: destination.title,
					children: parseInline(src.slice(i + 1, close)),
				})
				i = destination.end
				continue
			}
		}

		if (char === '<') {
			const auto = /^<((?:https?:\/\/|mailto:)[^\s<>]+)>/i.exec(src.slice(i))
			if (auto) {
				flush()
				out.push({ type: 'link', href: safeUrl(auto[1]), children: [{ type: 'text', text: auto[1] }] })
				i += auto[0].length
				continue
			}
		}

		if (char === '*' || char === '_' || char === '~') {
			let matched = false
			for (const [delimiter, build] of EMPHASIS) {
				if (!src.startsWith(delimiter, i)) continue
				if (isSpace(src[i + delimiter.length])) continue
				// intraword underscores are literal (snake_case)
				if (delimiter.startsWith('_') && isWord(src[i - 1])) continue
				const close = findClose(src, i + delimiter.length, delimiter)
				if (close < 0) continue
				flush()
				out.push(build(parseInline(src.slice(i + delimiter.length, close))))
				i = close + delimiter.length
				matched = true
				break
			}
			if (matched) continue
		}

		buffer += char
		i++
	}
	flush()
	return out
}

// ---------------------------------------------------------------------------------------------------------------
// Blocks

const BLANK = /^\s*$/
const FENCE = /^( {0,3})(`{3,}|~{3,})(.*)$/
const HEADING = /^ {0,3}(#{1,6})(?:\s+(.*?))?(?:\s+#+)?\s*$/
const HR = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/
const QUOTE = /^ {0,3}>\s?/
const LIST_MARKER = /^( *)([-*+]|\d{1,9}[.)])(\s+|$)(.*)$/
const TABLE_DELIMITER_CELL = /^:?-+:?$/

const indentOf = (line: string) => line.length - line.trimStart().length

const splitRow = (line: string) => {
	const trimmed = line
		.trim()
		.replace(/^\|/, '')
		.replace(/(?<!\\)\|$/, '')
	return trimmed.split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'))
}

const tableAt = (lines: string[], i: number) => {
	if (!lines[i]?.includes('|') || lines[i + 1] === undefined) return null
	const header = splitRow(lines[i])
	const delimiter = splitRow(lines[i + 1])
	if (header.length !== delimiter.length || !delimiter.every(cell => TABLE_DELIMITER_CELL.test(cell))) return null
	return { header, delimiter }
}

const startsBlock = (line: string) => {
	if (FENCE.test(line) || HEADING.test(line) || HR.test(line) || QUOTE.test(line)) return true
	const marker = LIST_MARKER.exec(line)
	// a list may interrupt a paragraph, but an empty item or a number other than 1 may not
	return !!marker && marker[4] !== '' && (!/\d/.test(marker[2]) || parseInt(marker[2], 10) === 1)
}

const parseList = (lines: string[], from: number): { block: Block; next: number } => {
	const first = LIST_MARKER.exec(lines[from]) as RegExpExecArray
	const base = first[1].length
	const ordered = /\d/.test(first[2])
	const items: ListItem[] = []
	let loose = false
	let i = from

	while (i < lines.length) {
		const marker = LIST_MARKER.exec(lines[i])
		if (!marker || marker[1].length >= base + 2 || /\d/.test(marker[2]) !== ordered) break
		const content = marker[1].length + marker[2].length + (marker[3].length > 0 ? Math.min(marker[3].length, 4) : 1)
		const itemLines = [marker[4]]
		let j = i + 1
		while (j < lines.length) {
			const line = lines[j]
			if (BLANK.test(line)) {
				let k = j
				while (k < lines.length && BLANK.test(lines[k])) k++
				if (k < lines.length && indentOf(lines[k]) >= content) {
					for (; j < k; j++) itemLines.push('')
					continue
				}
				break
			}
			const indent = indentOf(line)
			if (indent >= content) itemLines.push(line.slice(content))
			else if (indent > base && !LIST_MARKER.test(line)) itemLines.push(line.trim())
			else if (!BLANK.test(lines[j - 1]) && indent === 0 && !startsBlock(line) && !LIST_MARKER.test(line)) {
				itemLines.push(line)
			} else break
			j++
		}
		const children = parseBlocks(itemLines)
		let checked: boolean | null = null
		const head = children[0]
		if (head?.type === 'paragraph' && head.children[0]?.type === 'text') {
			const task = /^\[([ xX])\](?:\s+|$)/.exec(head.children[0].text)
			if (task) {
				checked = task[1] !== ' '
				const rest = head.children[0].text.slice(task[0].length)
				head.children = rest ? [{ type: 'text', text: rest }, ...head.children.slice(1)] : head.children.slice(1)
			}
		}
		items.push({ checked, children })
		// blank lines between two items make the list loose
		let k = j
		while (k < lines.length && BLANK.test(lines[k])) k++
		const sibling = k < lines.length ? LIST_MARKER.exec(lines[k]) : null
		if (sibling && sibling[1].length < base + 2 && /\d/.test(sibling[2]) === ordered) {
			if (k > j) loose = true
			i = k
		} else {
			i = j
			break
		}
	}

	const start = ordered ? parseInt(first[2], 10) : 1
	return { block: { type: 'list', ordered, start, loose, items }, next: i }
}

export const parseBlocks = (lines: string[]): Block[] => {
	const blocks: Block[] = []
	let i = 0
	while (i < lines.length) {
		const line = lines[i]
		if (BLANK.test(line)) {
			i++
			continue
		}

		const fence = FENCE.exec(line)
		if (fence && !(fence[2][0] === '`' && fence[3].includes('`'))) {
			const [, indent, marks, info] = fence
			const body: string[] = []
			i++
			const closing = new RegExp(`^ {0,3}${marks[0] === '`' ? '`' : '~'}{${marks.length},}\\s*$`)
			while (i < lines.length && !closing.test(lines[i])) {
				body.push(lines[i].replace(new RegExp(`^ {0,${indent.length}}`), ''))
				i++
			}
			i++ // the closing fence (or the end of the text)
			blocks.push({ type: 'code', lang: info.trim().split(/\s+/)[0] ?? '', text: body.join('\n') })
			continue
		}

		const heading = HEADING.exec(line)
		if (heading) {
			blocks.push({
				type: 'heading',
				level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
				children: parseInline(heading[2] ?? ''),
			})
			i++
			continue
		}

		if (HR.test(line)) {
			blocks.push({ type: 'hr' })
			i++
			continue
		}

		if (QUOTE.test(line)) {
			const inner: string[] = []
			while (i < lines.length && !BLANK.test(lines[i]) && (QUOTE.test(lines[i]) || !startsBlock(lines[i]))) {
				inner.push(lines[i].replace(QUOTE, ''))
				i++
			}
			blocks.push({ type: 'blockquote', children: parseBlocks(inner) })
			continue
		}

		if (LIST_MARKER.test(line)) {
			const { block, next } = parseList(lines, i)
			blocks.push(block)
			i = next
			continue
		}

		const table = tableAt(lines, i)
		if (table) {
			const align = table.delimiter.map((cell): Align => {
				const left = cell.startsWith(':')
				const right = cell.endsWith(':')
				return left && right ? 'center' : right ? 'right' : left ? 'left' : null
			})
			const rows: Inline[][][] = []
			i += 2
			while (i < lines.length && !BLANK.test(lines[i]) && lines[i].includes('|')) {
				const cells = splitRow(lines[i])
				rows.push(align.map((_, c) => parseInline(cells[c] ?? '')))
				i++
			}
			blocks.push({ type: 'table', align, header: table.header.map(parseInline), rows })
			continue
		}

		const text: string[] = [line.trimStart()]
		i++
		while (i < lines.length && !BLANK.test(lines[i]) && !startsBlock(lines[i])) {
			text.push(lines[i].trimStart())
			i++
		}
		blocks.push({ type: 'paragraph', children: parseInline(text.join('\n').trimEnd()) })
	}
	return blocks
}

/** Parses Markdown source into blocks (headings, paragraphs, lists, code, tables...). */
export const parseMarkdown = (source: string): Block[] =>
	parseBlocks(source.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n'))
