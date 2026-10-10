import { parseMarkdown, type Block, type Inline } from '../markdown'
import sanitizeHtml from './sanitize'

// Conversion between the editor's HTML and Markdown, for `format="markdown"`. Markdown can say less than the editor
// (no underline, colors or alignment, and code blocks lose their language), so those are dropped on the way out.

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------------------------------------------------------------------------------------------------------------
// Markdown -> HTML

const inlineHtml = (nodes: Inline[]): string =>
	nodes
		.map(node => {
			switch (node.type) {
				case 'text':
					return escapeHtml(node.text)
				case 'code':
					return `<code>${escapeHtml(node.text)}</code>`
				case 'strong':
					return `<strong>${inlineHtml(node.children)}</strong>`
				case 'em':
					return `<em>${inlineHtml(node.children)}</em>`
				case 'del':
					return `<s>${inlineHtml(node.children)}</s>`
				case 'link': {
					const inner = inlineHtml(node.children)
					if (!node.href) return inner
					const title = node.title ? ` title="${escapeHtml(node.title)}"` : ''
					return `<a href="${escapeHtml(node.href)}"${title}>${inner}</a>`
				}
				case 'image': {
					if (!node.src) return escapeHtml(node.alt)
					const title = node.title ? ` title="${escapeHtml(node.title)}"` : ''
					return `<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.alt)}"${title}>`
				}
				case 'br':
					return '<br>'
			}
		})
		.join('')

const ALIGN = { left: 'left', center: 'center', right: 'right' } as const

const blocksHtml = (blocks: Block[], tight = false): string =>
	blocks
		.map(block => {
			switch (block.type) {
				case 'heading':
					return `<h${block.level}>${inlineHtml(block.children)}</h${block.level}>`
				case 'paragraph':
					return tight ? inlineHtml(block.children) : `<p>${inlineHtml(block.children)}</p>`
				case 'blockquote':
					return `<blockquote>${blocksHtml(block.children)}</blockquote>`
				case 'list': {
					const tag = block.ordered ? 'ol' : 'ul'
					const start = block.ordered && block.start !== 1 ? ` start="${block.start}"` : ''
					const items = block.items.map(item => `<li>${blocksHtml(item.children, !block.loose)}</li>`).join('')
					return `<${tag}${start}>${items}</${tag}>`
				}
				case 'code':
					return `<pre>${escapeHtml(block.text)}</pre>`
				case 'hr':
					return '<hr>'
				case 'table': {
					const cell = (tag: string, children: Inline[], index: number) => {
						const align = block.align[index]
						return `<${tag}${align ? ` style="text-align: ${ALIGN[align]}"` : ''}>${inlineHtml(children)}</${tag}>`
					}
					const head = `<thead><tr>${block.header.map((cellNodes, i) => cell('th', cellNodes, i)).join('')}</tr></thead>`
					const rows = block.rows.map(row => `<tr>${row.map((cellNodes, i) => cell('td', cellNodes, i)).join('')}</tr>`)
					return `<table>${head}${rows.length ? `<tbody>${rows.join('')}</tbody>` : ''}</table>`
				}
			}
		})
		.join('')

/** The HTML for some Markdown, in the editor's own subset and sanitized. */
export const markdownToHtml = (markdown: string): string => sanitizeHtml(blocksHtml(parseMarkdown(markdown)))

// ---------------------------------------------------------------------------------------------------------------
// HTML -> Markdown

/** Characters that would start Markdown syntax in the middle of text. */
const escapeText = (text: string) => text.replace(/[\\`*_[\]<>~|]/g, '\\$&')

/** Marks (`**`, `*`...) must hug the text, so spaces at either end are moved outside them. */
const mark = (open: string, text: string, close = open) => {
	const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(text) as RegExpExecArray
	return match[2] ? `${match[1]}${open}${match[2]}${close}${match[3]}` : text
}

const codeSpan = (text: string) => {
	const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map(run => run.length))
	const fence = '`'.repeat(longest + 1)
	return text.startsWith('`') || text.endsWith('`') ? `${fence} ${text} ${fence}` : `${fence}${text}${fence}`
}

const destination = (url: string) => (url.includes(' ') || url.includes(')') ? `<${url}>` : url)
const titled = (title: string | null) => (title ? ` "${title.replace(/"/g, '\\"')}"` : '')

const inlineMarkdown = (node: Node): string => {
	if (node.nodeType === 3) return escapeText((node.textContent ?? '').replace(/\s+/g, ' '))
	if (node.nodeType !== 1) return ''
	const element = node as Element
	const inner = () => [...element.childNodes].map(inlineMarkdown).join('')
	switch (element.tagName.toLowerCase()) {
		case 'br':
			return '  \n'
		case 'strong':
			return mark('**', inner())
		case 'em':
			return mark('*', inner())
		case 's':
			return mark('~~', inner())
		case 'code':
			return codeSpan(element.textContent ?? '')
		case 'a':
			return `[${inner()}](${destination(element.getAttribute('href') ?? '')}${titled(element.getAttribute('title'))})`
		case 'img':
			return `![${escapeText(element.getAttribute('alt') ?? '')}](${destination(element.getAttribute('src') ?? '')}${titled(
				element.getAttribute('title')
			)})`
		default:
			return inner()
	}
}

/** Stops a line of text from being read as a heading, list or quote marker. */
const guardLineStart = (text: string) => text.replace(/^(\s*)(#{1,6}(?=\s)|[-+*](?=\s)|>|\d+(?=[.)]\s))/gm, '$1\\$2')

const LIST = new Set(['UL', 'OL'])

const indent = (text: string, spaces: number) =>
	text
		.split('\n')
		.map((line, index) => (index === 0 || !line ? line : ' '.repeat(spaces) + line))
		.join('\n')

const cellText = (cell: Element) =>
	[...cell.childNodes]
		.map(inlineMarkdown)
		.join('')
		.replace(/\s*\n\s*/g, ' ')
		.trim()

const listMarkdown = (list: Element): string => {
	const ordered = list.tagName === 'OL'
	let number = Number(list.getAttribute('start')) || 1
	return [...list.children]
		.filter(item => item.tagName === 'LI')
		.map(item => {
			const marker = ordered ? `${number++}. ` : '- '
			const own = [...item.childNodes].filter(node => !(node.nodeType === 1 && LIST.has((node as Element).tagName)))
			const nested = [...item.children].filter(child => LIST.has(child.tagName))
			const text = guardLineStart(own.map(inlineMarkdown).join('').trim())
			const body = [text, ...nested.map(listMarkdown)].filter(Boolean).join('\n')
			return marker + indent(body, marker.length)
		})
		.join('\n')
}

const tableMarkdown = (table: Element): string => {
	const rows = [...table.querySelectorAll('tr')]
	if (!rows.length) return ''
	const cells = (row: Element) => [...row.children].filter(cell => cell.tagName === 'TH' || cell.tagName === 'TD')
	const [head, ...rest] = rows
	const headCells = cells(head)
	const align = headCells.map(cell => {
		const value = (cell as HTMLElement).style?.textAlign
		return value === 'center' ? ':---:' : value === 'right' ? '---:' : value === 'left' ? ':---' : '---'
	})
	const line = (values: string[]) => `| ${values.join(' | ')} |`
	return [
		line(headCells.map(cellText)),
		line(align),
		...rest.map(row => {
			const own = cells(row)
			return line(headCells.map((_, index) => (own[index] ? cellText(own[index]) : '')))
		}),
	].join('\n')
}

const blockMarkdown = (element: Element): string => {
	const tag = element.tagName.toLowerCase()
	if (/^h[1-6]$/.test(tag)) {
		return `${'#'.repeat(Number(tag[1]))} ${[...element.childNodes].map(inlineMarkdown).join('').trim()}`
	}
	switch (tag) {
		case 'p':
			return guardLineStart([...element.childNodes].map(inlineMarkdown).join('').trim())
		case 'blockquote':
			return childrenMarkdown(element)
				.split('\n')
				.map(line => (line ? `> ${line}` : '>'))
				.join('\n')
		case 'ul':
		case 'ol':
			return listMarkdown(element)
		case 'pre': {
			const text = (element.textContent ?? '').replace(/\n$/, '')
			const longest = Math.max(2, ...(text.match(/`{3,}/g) ?? []).map(run => run.length))
			const fence = '`'.repeat(longest + 1)
			return `${fence}\n${text}\n${fence}`
		}
		case 'hr':
			return '---'
		default:
			return tableMarkdown(element)
	}
}

const BLOCKS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'PRE', 'HR', 'TABLE'])

const childrenMarkdown = (parent: Node): string => {
	const parts: string[] = []
	let run = ''
	const flush = () => {
		if (run.trim()) parts.push(guardLineStart(run.trim()))
		run = ''
	}
	parent.childNodes.forEach(node => {
		if (node.nodeType === 1 && BLOCKS.has((node as Element).tagName)) {
			flush()
			const text = blockMarkdown(node as Element)
			if (text) parts.push(text)
		} else run += inlineMarkdown(node)
	})
	flush()
	return parts.join('\n\n')
}

/** The Markdown for some editor HTML. */
export const htmlToMarkdown = (html: string): string => {
	const parsed = new DOMParser().parseFromString(`<body>${sanitizeHtml(html)}`, 'text/html')
	return childrenMarkdown(parsed.body)
}
