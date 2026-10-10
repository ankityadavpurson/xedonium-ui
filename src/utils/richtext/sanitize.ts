import { safeUrl } from '../markdown'

// An allowlist HTML sanitizer for the rich text editor. The input is parsed into an inert document and the result is
// rebuilt node by node from what is allowed, so scripts, event handlers, `javascript:` URLs and odd styles can never be
// carried through, whether the markup was pasted, passed as `value`, or produced by the editor itself.

/** Elements kept as they are. */
const KEEP = new Set([
	'p',
	'br',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'strong',
	'em',
	'u',
	's',
	'code',
	'pre',
	'blockquote',
	'ul',
	'ol',
	'li',
	'a',
	'img',
	'hr',
	'table',
	'thead',
	'tbody',
	'colgroup',
	'col',
	'tr',
	'th',
	'td',
	'span',
])

/** Elements renamed to one we keep. */
const RENAME: Record<string, string> = { b: 'strong', i: 'em', strike: 's', del: 's', ins: 'u', mark: 'span' }

/** Elements dropped together with everything inside them. */
const DROP = new Set([
	'script',
	'style',
	'iframe',
	'frame',
	'frameset',
	'object',
	'embed',
	'applet',
	'template',
	'noscript',
	'textarea',
	'select',
	'option',
	'button',
	'input',
	'form',
	'head',
	'title',
	'meta',
	'link',
	'base',
	'svg',
	'math',
	'canvas',
	'audio',
	'video',
	'source',
	'track',
])

const BLOCK_CHILD = new Set([
	'p',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'blockquote',
	'ul',
	'ol',
	'pre',
	'hr',
	'table',
	'div',
])

/** Elements whose `style` is reduced to colors and alignment. */
const STYLED = new Set(['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'blockquote'])

const COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/-]+\)|[a-z]{3,30})$/i
const ALIGN = /^(left|center|right|justify)$/i

/** The styles worth keeping, from a `style` attribute: `color`, `background-color` and `text-align`, validated. */
export const cleanStyle = (style: string) => {
	const kept: string[] = []
	for (const part of style.split(';')) {
		const colon = part.indexOf(':')
		if (colon < 0) continue
		const name = part.slice(0, colon).trim().toLowerCase()
		const value = part
			.slice(colon + 1)
			.trim()
			.replace(/\s*!important$/i, '')
		if ((name === 'color' || name === 'background-color') && COLOR.test(value) && !/^(expression|url)$/i.test(value))
			kept.push(`${name}: ${value}`)
		else if (name === 'text-align' && ALIGN.test(value)) kept.push(`text-align: ${value.toLowerCase()}`)
	}
	return kept.join('; ')
}

/** A width given as digits, with or without `%` (`480`, `50%`), or nothing. */
const size = (value: string | null) => (value && /^\d{1,4}%?$/.test(value) ? value : null)

const copyAttributes = (from: Element, to: Element, tag: string) => {
	const set = (name: string, value: string | null) => {
		if (value) to.setAttribute(name, value)
	}
	if (tag === 'a') {
		const href = safeUrl(from.getAttribute('href') ?? '')
		set('href', href)
		set('title', from.getAttribute('title'))
		if (href && /^https?:/i.test(href) && from.getAttribute('target') === '_blank') {
			to.setAttribute('target', '_blank')
			to.setAttribute('rel', 'noopener noreferrer')
		}
	} else if (tag === 'img') {
		set('src', safeUrl(from.getAttribute('src') ?? '', true))
		set('alt', from.getAttribute('alt'))
		set('title', from.getAttribute('title'))
		set('width', size(from.getAttribute('width')))
	} else if (tag === 'table' || tag === 'col') {
		set('width', size(from.getAttribute('width')))
	} else if (tag === 'td' || tag === 'th') {
		for (const name of ['colspan', 'rowspan']) {
			const value = from.getAttribute(name)
			if (value && /^\d{1,2}$/.test(value)) to.setAttribute(name, value)
		}
	} else if (tag === 'ol') {
		const start = from.getAttribute('start')
		if (start && /^\d{1,6}$/.test(start)) to.setAttribute('start', start)
	}
	if (STYLED.has(tag)) set('style', cleanStyle(from.getAttribute('style') ?? ''))
}

const copyChildren = (from: Node, into: Node, doc: Document) => {
	from.childNodes.forEach(child => build(child, into, doc))
}

const build = (node: Node, into: Node, doc: Document) => {
	if (node.nodeType === 3) {
		into.appendChild(doc.createTextNode(node.textContent ?? ''))
		return
	}
	if (node.nodeType !== 1) return
	const element = node as Element
	let tag = element.tagName.toLowerCase()
	if (DROP.has(tag)) return
	tag = RENAME[tag] ?? tag
	if (tag === 'div') {
		// a div that wraps blocks just disappears; one that holds text is a paragraph
		const wraps = [...element.children].some(child => BLOCK_CHILD.has(child.tagName.toLowerCase()))
		if (wraps) return copyChildren(element, into, doc)
		tag = 'p'
	}
	if (!KEEP.has(tag)) return copyChildren(element, into, doc)
	const copy = doc.createElement(tag)
	copyAttributes(element, copy, tag)
	// a link without a safe address, or a styleless span, adds nothing: keep only what is inside
	if ((tag === 'a' && !copy.getAttribute('href')) || (tag === 'span' && !copy.getAttribute('style'))) {
		return copyChildren(element, into, doc)
	}
	if (tag === 'img' && !copy.getAttribute('src')) return
	if (tag !== 'br' && tag !== 'img' && tag !== 'hr' && tag !== 'col') copyChildren(element, copy, doc)
	into.appendChild(copy)
}

// invisible characters the editor uses to hold a caret open; they never belong in a value
const ZERO_WIDTH = /[\u200B\uFEFF]/g

/** The allowed subset of `html`, as an HTML string. Safe to put in the page and to store. */
const sanitizeHtml = (html: string): string => {
	if (!html) return ''
	const source = new DOMParser().parseFromString(`<body>${html}`, 'text/html')
	const target = document.implementation.createHTMLDocument('')
	copyChildren(source.body, target.body, target)
	return target.body.innerHTML.replace(ZERO_WIDTH, '')
}

export default sanitizeHtml
