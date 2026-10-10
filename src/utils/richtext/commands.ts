import { safeUrl } from '../markdown'

// Editing commands for the rich text editor, written directly against the DOM `Range` (no `document.execCommand`).
// Every command takes the editable `root`, works on the current selection inside it, changes the DOM, and puts the
// selection back on what it changed. The document model is simple on purpose: the root holds blocks (paragraphs,
// headings, lists, quotes, code blocks, rules, tables) and a block holds inline content (text, strong, em, u, s, code,
// a, span, img, br).

export type BlockTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre'
export type InlineTag = 'strong' | 'em' | 'u' | 's' | 'code'
export type ListKind = 'ul' | 'ol'
export type Alignment = 'left' | 'center' | 'right' | 'justify'

/** Elements that hold inline content directly. */
const LEAF = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'PRE', 'TD', 'TH'])
/** Elements that count as a block when deciding whether another block sits inside. */
const BLOCKISH = new Set([...LEAF, 'BLOCKQUOTE', 'UL', 'OL', 'TABLE', 'THEAD', 'TBODY', 'TR', 'HR', 'DIV'])
/** Parents whose own text children are only layout whitespace. */
const STRUCTURAL = new Set(['UL', 'OL', 'TABLE', 'THEAD', 'TBODY', 'TR'])
const ZWSP = '​'

const isElement = (node: Node | null | undefined): node is Element => node?.nodeType === 1
const isText = (node: Node | null | undefined): node is Text => node?.nodeType === 3
const indexOf = (node: Node) => Array.prototype.indexOf.call(node.parentNode?.childNodes ?? [], node) as number
const make = (tag: string) => document.createElement(tag)

// ---------------------------------------------------------------------------------------------------------------
// Positions

/** Order of two DOM points: -1 when the first is earlier, 1 when later, 0 when the same. */
export const comparePoints = (aNode: Node, aOffset: number, bNode: Node, bOffset: number): number => {
	if (aNode === bNode) return Math.sign(aOffset - bOffset)
	const position = aNode.compareDocumentPosition(bNode)
	if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
		let child = bNode
		while (child.parentNode !== aNode) child = child.parentNode as Node
		return aOffset <= indexOf(child) ? -1 : 1
	}
	if (position & Node.DOCUMENT_POSITION_CONTAINS) {
		let child = aNode
		while (child.parentNode !== bNode) child = child.parentNode as Node
		return indexOf(child) < bOffset ? -1 : 1
	}
	return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

/** The current selection as a range, when it lies inside `root`. */
export const currentRange = (root: HTMLElement): Range | null => {
	const selection = window.getSelection?.()
	if (!selection || selection.rangeCount === 0) return null
	const range = selection.getRangeAt(0)
	return root.contains(range.startContainer) && root.contains(range.endContainer) ? range : null
}

/** Selects from `(startNode, startOffset)` to `(endNode, endOffset)`. */
export const select = (startNode: Node, startOffset: number, endNode: Node = startNode, endOffset = startOffset) => {
	const selection = window.getSelection?.()
	if (!selection) return
	const range = document.createRange()
	range.setStart(startNode, startOffset)
	range.setEnd(endNode, endOffset)
	selection.removeAllRanges()
	selection.addRange(range)
}

/** Puts the caret at the start (or end) of `element`. */
export const caretIn = (element: Node, atEnd = false) => {
	const point = atEnd ? element.childNodes.length : 0
	select(element, point)
}

// ---------------------------------------------------------------------------------------------------------------
// Structure

/** Browsers make a `<div>` for each new line in some cases: turn those into paragraphs (or drop a div that only wraps blocks). */
const normalizeDivs = (root: HTMLElement) => {
	for (const div of [...root.querySelectorAll('div')]) {
		const selection = window.getSelection?.()
		const range = selection && selection.rangeCount ? selection.getRangeAt(0) : null
		const wraps = [...div.children].some(child => BLOCKISH.has(child.tagName))
		const point = range && range.startContainer === div ? range.startOffset : -1
		const holder = wraps ? null : make('p')
		if (holder) {
			div.parentNode?.insertBefore(holder, div)
			while (div.firstChild) holder.appendChild(div.firstChild)
			div.parentNode?.removeChild(div)
			if (point >= 0) select(holder, point)
		} else unwrap(div)
	}
}

/** Wraps loose inline content in paragraphs and makes sure the editor is never empty. */
export const ensureBlocks = (root: HTMLElement) => {
	normalizeDivs(root)
	let run: Node[] = []
	const flush = () => {
		if (!run.length) return
		const only = run.length === 1 && isText(run[0]) && !run[0].textContent?.trim()
		if (only) run[0].parentNode?.removeChild(run[0])
		else {
			const paragraph = make('p')
			run[0].parentNode?.insertBefore(paragraph, run[0])
			run.forEach(node => paragraph.appendChild(node))
		}
		run = []
	}
	for (const node of [...root.childNodes]) {
		if (isElement(node) && BLOCKISH.has(node.tagName)) flush()
		else run.push(node)
	}
	flush()
	if (!root.firstChild) {
		const paragraph = make('p')
		paragraph.appendChild(make('br'))
		root.appendChild(paragraph)
	}
}

const isList = (node: Node | null): node is Element =>
	isElement(node) && (node.tagName === 'UL' || node.tagName === 'OL')

/** A block that holds inline content. A list item is one even when it has a nested list below its own text. */
const isLeafBlock = (element: Element) =>
	LEAF.has(element.tagName) &&
	(element.tagName === 'LI' || ![...element.children].some(child => BLOCKISH.has(child.tagName)))

/** Where a block's own content ends: before a nested list, otherwise at its end. */
const ownEnd = (block: Element) => {
	const nested = [...block.childNodes].findIndex(isList)
	return nested < 0 ? block.childNodes.length : nested
}

/** The closest leaf block (paragraph, heading, list item...) around `node`, inside `root`. */
export const leafBlockOf = (node: Node | null, root: HTMLElement): HTMLElement | null => {
	let current: Node | null = node
	while (current && current !== root) {
		if (isElement(current) && isLeafBlock(current)) return current as HTMLElement
		current = current.parentNode
	}
	return null
}

const allLeafBlocks = (root: HTMLElement) => [...root.querySelectorAll('*')].filter(isLeafBlock) as HTMLElement[]

/** The leaf blocks the range touches (the block with the caret, when it is collapsed). */
const blocksIn = (root: HTMLElement, range: Range) =>
	allLeafBlocks(root).filter(
		block =>
			comparePoints(range.startContainer, range.startOffset, block, ownEnd(block)) <= 0 &&
			comparePoints(block, 0, range.endContainer, range.endOffset) <= 0
	)

/** The ancestor of `node` that is a direct child of `root`. */
const topBlockOf = (node: Node, root: HTMLElement) => {
	let current = node
	while (current.parentNode && current.parentNode !== root) current = current.parentNode
	return current
}

const closestTag = (node: Node | null, tag: string, root: HTMLElement): HTMLElement | null => {
	const upper = tag.toUpperCase()
	let current: Node | null = node
	while (current && current !== root) {
		if (isElement(current) && current.tagName === upper) return current as HTMLElement
		current = current.parentNode
	}
	return null
}

/** Moves the children of `element` in front of it and removes it. */
const unwrap = (element: Element) => {
	const parent = element.parentNode
	if (!parent) return
	while (element.firstChild) parent.insertBefore(element.firstChild, element)
	parent.removeChild(element)
}

/** Splits `ancestor` so that `node` sits in an `ancestor` of its own (copies of it keep what came before and after). */
const isolate = (node: Node, ancestor: Element) => {
	for (const after of [true, false]) {
		let current: Node = node
		for (;;) {
			const parent = current.parentNode as Element
			const siblings: Node[] = []
			for (let next = after ? current.nextSibling : current.previousSibling; next;) {
				siblings.push(next)
				next = after ? next.nextSibling : next.previousSibling
			}
			if (siblings.length) {
				const copy = parent.cloneNode(false)
				if (!after) siblings.reverse()
				siblings.forEach(sibling => copy.appendChild(sibling))
				parent.parentNode?.insertBefore(copy, after ? parent.nextSibling : parent)
			}
			if (parent === ancestor) break
			current = parent
		}
	}
}

/** Joins neighbouring elements of the same tag (and the same style, for spans), e.g. `<strong>a</strong><strong>b</strong>`. */
const mergeNeighbours = (root: HTMLElement, tag: string) => {
	for (const element of [...root.querySelectorAll(tag)]) {
		if (!element.isConnected) continue
		for (
			let next = element.nextSibling;
			isElement(next) && next.tagName === element.tagName;
			next = element.nextSibling
		) {
			if (
				next.getAttribute('style') !== element.getAttribute('style') ||
				next.getAttribute('href') !== element.getAttribute('href')
			)
				break
			while (next.firstChild) element.appendChild(next.firstChild)
			next.parentNode?.removeChild(next)
		}
	}
}

const removeEmpty = (root: HTMLElement, tags: string) => {
	for (const element of [...root.querySelectorAll(tags)]) {
		if (!element.textContent && !element.querySelector('img,br,hr')) element.parentNode?.removeChild(element)
	}
}

// ---------------------------------------------------------------------------------------------------------------
// Text in a range

/** Splits the text nodes at both ends of the range so that the range starts and ends between nodes. */
const splitBoundaries = (range: Range) => {
	let { startContainer, startOffset, endContainer, endOffset } = range
	if (isText(endContainer) && endOffset > 0 && endOffset < endContainer.length) endContainer.splitText(endOffset)
	if (isText(startContainer) && startOffset > 0 && startOffset < startContainer.length) {
		const tail = startContainer.splitText(startOffset)
		if (endContainer === startContainer) {
			endContainer = tail
			endOffset -= startOffset
		}
		startContainer = tail
		startOffset = 0
	}
	range.setStart(startContainer, startOffset)
	range.setEnd(endContainer, endOffset)
}

/** The non-empty text nodes the range covers (even partly), in order. */
const textNodesIn = (root: HTMLElement, range: Range) => {
	const found: Text[] = []
	const walk = (node: Node) => {
		node.childNodes.forEach(child => {
			if (isText(child)) {
				const layoutOnly = STRUCTURAL.has((child.parentNode as Element).tagName) || child.parentNode === root
				const blank = layoutOnly && !child.data.trim()
				if (
					child.length > 0 &&
					!blank &&
					comparePoints(range.startContainer, range.startOffset, child, child.length) < 0 &&
					comparePoints(child, 0, range.endContainer, range.endOffset) < 0
				)
					found.push(child)
			} else walk(child)
		})
	}
	walk(root)
	return found
}

const selectTexts = (texts: Text[]) => {
	if (texts.length) select(texts[0], 0, texts[texts.length - 1], texts[texts.length - 1].length)
}

// ---------------------------------------------------------------------------------------------------------------
// Inline formatting

const wrapText = (text: Text, tag: string) => {
	const element = make(tag)
	text.parentNode?.insertBefore(element, text)
	element.appendChild(text)
	return element
}

/** Inserts an invisible character in `tag` at the caret, so what is typed next has that format. */
const toggleAtCaret = (root: HTMLElement, range: Range, tag: string) => {
	const inside = closestTag(range.startContainer, tag, root)
	const marker = document.createTextNode(ZWSP)
	if (inside) {
		// leave the format: continue just after it
		inside.parentNode?.insertBefore(marker, inside.nextSibling)
	} else {
		const element = make(tag)
		element.appendChild(marker)
		range.insertNode(element)
	}
	select(marker, 1)
}

/** Turns bold, italic, underline, strike or code on for the selection, or off when all of it already has it. */
export const toggleInline = (root: HTMLElement, tag: InlineTag) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	if (range.collapsed) return toggleAtCaret(root, range, tag)
	splitBoundaries(range)
	const texts = textNodesIn(root, range)
	if (!texts.length) return
	const allHave = texts.every(text => closestTag(text, tag, root))
	for (const text of texts) {
		const has = closestTag(text, tag, root)
		if (allHave && has) {
			isolate(text, has)
			unwrap(has)
		} else if (!allHave && !has) wrapText(text, tag)
	}
	mergeNeighbours(root, tag)
	removeEmpty(root, tag)
	selectTexts(texts)
}

const styleOf = (element: HTMLElement, property: string) => element.style.getPropertyValue(property)

const setStyle = (element: HTMLElement, property: string, value: string | null) => {
	if (value) element.style.setProperty(property, value)
	else element.style.removeProperty(property)
	if (!element.getAttribute('style')?.trim()) element.removeAttribute('style')
}

/** Sets the text color or highlight of the selection; `null` removes it. */
export const applyStyle = (root: HTMLElement, property: 'color' | 'background-color', value: string | null) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	if (range.collapsed) {
		if (!value) return
		const span = make('span')
		setStyle(span, property, value)
		const marker = document.createTextNode(ZWSP)
		span.appendChild(marker)
		range.insertNode(span)
		return select(marker, 1)
	}
	splitBoundaries(range)
	const texts = textNodesIn(root, range)
	for (const text of texts) {
		let owner: HTMLElement | null = null
		for (let node: Node | null = text.parentNode; node && node !== root; node = node.parentNode) {
			if (isElement(node) && node.tagName === 'SPAN' && styleOf(node as HTMLElement, property)) {
				owner = node as HTMLElement
				break
			}
		}
		if (owner) isolate(text, owner)
		else if (value) owner = wrapText(text, 'span')
		if (!owner) continue
		setStyle(owner, property, value)
		if (!owner.getAttribute('style')) unwrap(owner)
	}
	mergeNeighbours(root, 'span')
	removeEmpty(root, 'span')
	selectTexts(texts)
}

/** Removes every inline format (and link) from the selection, and turns its blocks back into plain paragraphs. */
export const clearFormat = (root: HTMLElement) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	for (const block of blocksIn(root, range)) {
		const plain = ['LI', 'TD', 'TH', 'P'].includes(block.tagName) ? block : convertBlock(block, 'p')
		plain.removeAttribute('style')
	}
	if (range.collapsed) return
	splitBoundaries(range)
	const texts = textNodesIn(root, range)
	for (const text of texts) {
		for (let node: Node | null = text.parentNode; node && node !== root && !(isElement(node) && isLeafBlock(node));) {
			const next: Node | null = node.parentNode
			if (isElement(node) && ['STRONG', 'EM', 'U', 'S', 'CODE', 'A', 'SPAN'].includes(node.tagName)) {
				isolate(text, node)
				unwrap(node)
			}
			node = next
		}
	}
	selectTexts(texts)
}

// ---------------------------------------------------------------------------------------------------------------
// Blocks

/** The text of `node`, with a line break for each `<br>`. */
const plainLines = (node: Node): string =>
	[...node.childNodes]
		.map(child => (isElement(child) && child.tagName === 'BR' ? '\n' : isText(child) ? child.data : plainLines(child)))
		.join('')

/** Replaces `block` by an element of another tag with the same content (and alignment). */
const convertBlock = (block: HTMLElement, tag: string): HTMLElement => {
	const copy = make(tag)
	const align = block.style.textAlign
	if (align) copy.style.textAlign = align
	if (tag === 'pre') {
		copy.textContent = plainLines(block)
	} else if (block.tagName === 'PRE') {
		const lines = (block.textContent ?? '').split('\n')
		lines.forEach((line, index) => {
			if (index) copy.appendChild(make('br'))
			if (line) copy.appendChild(document.createTextNode(line))
		})
		if (!copy.firstChild) copy.appendChild(make('br'))
	} else {
		while (block.firstChild) copy.appendChild(block.firstChild)
	}
	block.parentNode?.replaceChild(copy, block)
	return copy
}

type Saved = { startContainer: Node; startOffset: number; endContainer: Node; endOffset: number }

const save = (range: Range): Saved => ({
	startContainer: range.startContainer,
	startOffset: range.startOffset,
	endContainer: range.endContainer,
	endOffset: range.endOffset,
})

/** Reselects the same stretch of text after blocks were replaced, falling back to the start of the first block. */
const keepSelection = (saved: Saved, blocks: HTMLElement[]) => {
	const { startContainer, startOffset, endContainer, endOffset } = saved
	if (startContainer.isConnected && endContainer.isConnected && isText(startContainer)) {
		select(startContainer, startOffset, endContainer, endOffset)
	} else if (blocks[0]?.isConnected) caretIn(blocks[0])
}

/** Makes the blocks of the selection paragraphs or headings (a block that already is a heading of that level goes back to a paragraph). */
export const setBlock = (root: HTMLElement, tag: BlockTag) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	const blocks = blocksIn(root, range).filter(
		block => block.tagName !== 'LI' && block.tagName !== 'TD' && block.tagName !== 'TH'
	)
	if (!blocks.length) return
	const target = tag !== 'p' && blocks.every(block => block.tagName.toLowerCase() === tag) ? 'p' : tag
	const saved = save(range)
	const converted = blocks.map(block => (block.tagName.toLowerCase() === target ? block : convertBlock(block, target)))
	keepSelection(saved, converted)
}

const newList = (kind: ListKind) => make(kind)

/** Moves the list item out of its list, as a paragraph (nested lists stay below it). */
const liftItem = (item: HTMLElement) => {
	const list = item.parentNode as HTMLElement
	if (!list || !(list.tagName === 'UL' || list.tagName === 'OL')) return item
	const paragraph = make('p')
	const nested: Node[] = []
	for (const child of [...item.childNodes]) {
		if (isElement(child) && (child.tagName === 'UL' || child.tagName === 'OL')) nested.push(child)
		else paragraph.appendChild(child)
	}
	if (!paragraph.firstChild) paragraph.appendChild(make('br'))
	const align = item.style.textAlign
	if (align) paragraph.style.textAlign = align
	// everything after the item goes to a list of its own, placed behind the paragraph
	const after: Node[] = []
	for (let next = item.nextSibling; next; next = next.nextSibling) after.push(next)
	if (after.length) {
		const tail = list.cloneNode(false)
		after.forEach(node => tail.appendChild(node))
		list.parentNode?.insertBefore(tail, list.nextSibling)
	}
	list.parentNode?.insertBefore(paragraph, list.nextSibling)
	item.parentNode?.removeChild(item)
	let anchor: Node = paragraph
	for (const node of nested) {
		anchor.parentNode?.insertBefore(node, anchor.nextSibling)
		anchor = node
	}
	if (!list.firstChild) list.parentNode?.removeChild(list)
	return paragraph
}

/** Makes the selected blocks a bulleted or numbered list, or takes them out of it when they already are one. */
export const toggleList = (root: HTMLElement, kind: ListKind) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	const blocks = blocksIn(root, range).filter(
		block => block.tagName !== 'PRE' && block.tagName !== 'TD' && block.tagName !== 'TH'
	)
	if (!blocks.length) return
	const saved = save(range)
	const wanted = kind.toUpperCase()
	const inKind = blocks.every(block => block.tagName === 'LI' && (block.parentNode as Element).tagName === wanted)
	let focus: HTMLElement[]
	if (inKind) {
		focus = blocks.map(liftItem)
	} else {
		focus = []
		for (const block of blocks) {
			if (block.tagName === 'LI') {
				const list = block.parentNode as HTMLElement
				if (list.tagName !== wanted) {
					const replacement = newList(kind)
					while (list.firstChild) replacement.appendChild(list.firstChild)
					list.parentNode?.replaceChild(replacement, list)
				}
				focus.push(block)
				continue
			}
			const list = newList(kind)
			const item = make('li')
			const align = block.style.textAlign
			if (align) item.style.textAlign = align
			while (block.firstChild) item.appendChild(block.firstChild)
			list.appendChild(item)
			block.parentNode?.replaceChild(list, block)
			focus.push(item)
		}
		mergeNeighbours(root, kind)
	}
	keepSelection(saved, focus)
}

/** Takes an empty list item out of its list (what Enter does on a blank line in a list). Returns whether it did. */
export const exitEmptyListItem = (root: HTMLElement): boolean => {
	const range = currentRange(root)
	if (!range || !range.collapsed) return false
	const item = closestTag(range.startContainer, 'li', root)
	if (!item || (item.textContent ?? '').replace(ZWSP, '').trim() || item.querySelector('img')) return false
	const paragraph = liftItem(item)
	caretIn(paragraph)
	return true
}

/** Puts the selected top-level blocks in a quote, or takes them out of it when they are all quoted already. */
export const toggleQuote = (root: HTMLElement) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	const blocks = blocksIn(root, range)
	if (!blocks.length) return
	const saved = save(range)
	const quotes = new Set(blocks.map(block => closestTag(block, 'blockquote', root)))
	if (!quotes.has(null)) {
		quotes.forEach(quote => quote && unwrap(quote))
	} else {
		const tops = [...new Set(blocks.map(block => topBlockOf(block, root)))]
		let group: HTMLElement | null = null
		let previous: Node | null = null
		for (const top of tops) {
			if (isElement(top) && top.tagName === 'BLOCKQUOTE') {
				group = null
			} else if (group && previous && previous.nextSibling === top) {
				group.appendChild(top)
			} else {
				group = make('blockquote')
				top.parentNode?.insertBefore(group, top)
				group.appendChild(top)
			}
			previous = top
		}
		if (group) mergeNeighbours(root, 'blockquote')
	}
	keepSelection(saved, blocks)
}

/** Aligns the selected blocks. */
export const setAlign = (root: HTMLElement, align: Alignment) => {
	const range = currentRange(root)
	if (!range) return
	ensureBlocks(root)
	for (const block of blocksIn(root, range)) setStyle(block, 'text-align', align === 'left' ? null : align)
}

/** Turns the selected blocks into a code block, or back into paragraphs. */
export const toggleCodeBlock = (root: HTMLElement) => setBlock(root, 'pre')

// ---------------------------------------------------------------------------------------------------------------
// Links, images and other inserts

/** The link around the caret or the first selected text, if any. */
const linkAt = (root: HTMLElement, range: Range) => {
	const around = closestTag(range.startContainer, 'a', root)
	if (around) return around
	return (
		textNodesIn(root, range)
			.map(text => closestTag(text, 'a', root))
			.find(Boolean) ?? null
	)
}

/** Links the selection to `href`, or inserts a link with `text` at the caret. Returns `false` when the address is not allowed. */
export const insertLink = (root: HTMLElement, href: string, text?: string): boolean => {
	const safe = safeUrl(href)
	if (!safe) return false
	const range = currentRange(root)
	if (!range) return false
	ensureBlocks(root)
	if (range.collapsed) {
		const existing = closestTag(range.startContainer, 'a', root)
		if (existing) {
			existing.setAttribute('href', safe)
			return true
		}
		const link = make('a')
		link.setAttribute('href', safe)
		link.appendChild(document.createTextNode(text || safe))
		range.insertNode(link)
		select(link, link.childNodes.length)
		return true
	}
	splitBoundaries(range)
	const texts = textNodesIn(root, range)
	for (const node of texts) {
		const existing = closestTag(node, 'a', root)
		if (existing) existing.setAttribute('href', safe)
		else wrapText(node, 'a').setAttribute('href', safe)
	}
	mergeNeighbours(root, 'a')
	selectTexts(texts)
	return true
}

/** Takes the link away from the selection (or the link around the caret), keeping its text. */
export const removeLink = (root: HTMLElement) => {
	const range = currentRange(root)
	if (!range) return
	if (range.collapsed) {
		const link = closestTag(range.startContainer, 'a', root)
		if (link) unwrap(link)
		return
	}
	splitBoundaries(range)
	const texts = textNodesIn(root, range)
	for (const text of texts) {
		const link = closestTag(text, 'a', root)
		if (link) {
			isolate(text, link)
			unwrap(link)
		}
	}
	selectTexts(texts)
}

/** Inserts `node` as a block after the block that holds the selection (or at the end), followed by a paragraph to type in. */
const insertBlockAfterSelection = (root: HTMLElement, node: HTMLElement) => {
	ensureBlocks(root)
	const range = currentRange(root)
	// a caret placed on the editor itself (clicking blank space, select all) sits between its blocks
	const between =
		range && range.endContainer === root ? (root.childNodes[Math.max(0, range.endOffset - 1)] ?? root.lastChild) : null
	const anchor = between ?? (range ? topBlockOf(range.endContainer, root) : root.lastChild)
	const empty =
		isElement(anchor) &&
		anchor.tagName === 'P' &&
		!(anchor.textContent ?? '').replace(ZWSP, '').trim() &&
		!anchor.querySelector('img')
	if (empty && anchor) anchor.parentNode?.replaceChild(node, anchor)
	else anchor?.parentNode?.insertBefore(node, anchor.nextSibling)
	if (!node.nextSibling) {
		const paragraph = make('p')
		paragraph.appendChild(make('br'))
		root.appendChild(paragraph)
	}
	caretIn(node.nextSibling as Node)
}

/**
 * Inserts sanitized `html` at the selection, replacing what is selected. Inline content goes in place; blocks split the
 * block around the caret. Used for paste.
 */
export const insertHtml = (root: HTMLElement, html: string) => {
	ensureBlocks(root)
	const range = currentRange(root)
	const parsed = new DOMParser().parseFromString(`<body>${html}`, 'text/html')
	const fragment = document.createDocumentFragment()
	while (parsed.body.firstChild) fragment.appendChild(document.adoptNode(parsed.body.firstChild))
	if (!fragment.firstChild) return
	const last = fragment.lastChild as Node
	const hasBlocks = [...fragment.childNodes].some(node => isElement(node) && BLOCKISH.has(node.tagName))
	if (!range) {
		root.appendChild(fragment)
		return caretIn(last, true)
	}
	range.deleteContents()
	const block = leafBlockOf(range.startContainer, root)
	// a single paragraph, or a paste into a list item, cell or code block, goes in as inline content
	const single =
		fragment.childNodes.length === 1 && isElement(fragment.firstChild) && fragment.firstChild.tagName === 'P'
	if (!hasBlocks || single || !block || ['LI', 'TD', 'TH', 'PRE'].includes(block.tagName)) {
		if (single) {
			const inline = document.createDocumentFragment()
			while (fragment.firstChild?.firstChild) inline.appendChild(fragment.firstChild.firstChild)
			range.insertNode(inline)
		} else range.insertNode(hasBlocks ? document.createTextNode(fragment.textContent ?? '') : fragment)
		range.collapse(false)
		// the placeholder line break of an empty block is not needed once there is content
		const target = leafBlockOf(range.startContainer, root)
		if (
			target?.lastChild &&
			isElement(target.lastChild) &&
			target.lastChild.tagName === 'BR' &&
			target.childNodes.length > 1
		) {
			target.removeChild(target.lastChild)
		}
		return select(range.endContainer, range.endOffset)
	}
	const tail = block.cloneNode(false)
	const rest = document.createRange()
	rest.setStart(range.startContainer, range.startOffset)
	rest.setEndAfter(block.lastChild ?? block)
	tail.appendChild(rest.extractContents())
	const parent = block.parentNode as Node
	parent.insertBefore(fragment, block.nextSibling)
	const hasText = (node: Node) =>
		!!(node.textContent ?? '').replace(ZWSP, '').trim() || !!(node as Element).querySelector?.('img')
	if (hasText(tail)) {
		if (!tail.firstChild) (tail as Element).appendChild(make('br'))
		parent.insertBefore(tail, last.nextSibling)
	}
	if (!hasText(block)) parent.removeChild(block)
	caretIn(last, true)
}

export const insertHr = (root: HTMLElement) => insertBlockAfterSelection(root, make('hr'))

/** Inserts a table with a header row. */
export const insertTable = (root: HTMLElement, rows = 3, columns = 3) => {
	const table = make('table')
	const head = make('thead')
	const body = make('tbody')
	const row = (cell: 'th' | 'td') => {
		const tr = make('tr')
		for (let column = 0; column < columns; column++) {
			const td = make(cell)
			td.appendChild(make('br'))
			tr.appendChild(td)
		}
		return tr
	}
	head.appendChild(row('th'))
	for (let index = 1; index < Math.max(1, rows); index++) body.appendChild(row('td'))
	table.setAttribute('width', '100%')
	table.appendChild(head)
	table.appendChild(body)
	insertBlockAfterSelection(root, table)
	caretIn(table.querySelector('th') as Node)
}

/** Inserts an image at the caret. Returns `false` when the address is not allowed. */
export const insertImage = (root: HTMLElement, src: string, alt = ''): boolean => {
	const safe = safeUrl(src, true)
	if (!safe) return false
	ensureBlocks(root)
	const range = currentRange(root)
	const image = make('img')
	image.setAttribute('src', safe)
	if (alt) image.setAttribute('alt', alt)
	if (range) {
		range.deleteContents()
		range.insertNode(image)
	} else {
		root.lastElementChild?.appendChild(image)
	}
	select(image.parentNode as Node, indexOf(image) + 1)
	return true
}

// ---------------------------------------------------------------------------------------------------------------
// State, for the toolbar

export interface EditorState {
	bold: boolean
	italic: boolean
	underline: boolean
	strike: boolean
	code: boolean
	/** `p`, `h1`...`h6` or `pre` (a list item counts as `p`). */
	block: BlockTag
	list: ListKind | null
	quote: boolean
	align: Alignment
	/** The address of the link around the selection. */
	link: string | null
}

export const emptyState: EditorState = {
	bold: false,
	italic: false,
	underline: false,
	strike: false,
	code: false,
	block: 'p',
	list: null,
	quote: false,
	align: 'left',
	link: null,
}

/** What the selection looks like: which formats are on, the block type, the list, alignment and link. */
export const queryState = (root: HTMLElement): EditorState => {
	const range = currentRange(root)
	if (!range) return emptyState
	const covered: Node[] = range.collapsed ? [range.startContainer] : textNodesIn(root, range)
	if (!covered.length) covered.push(range.startContainer)
	const every = (tag: string) => covered.every(node => closestTag(node, tag, root))
	const block = leafBlockOf(range.startContainer, root)
	const tag = block?.tagName.toLowerCase() ?? 'p'
	const list = closestTag(range.startContainer, 'li', root)?.parentNode as Element | undefined
	return {
		bold: every('strong'),
		italic: every('em'),
		underline: every('u'),
		strike: every('s'),
		code: every('code'),
		block: (/^(h[1-6]|pre)$/.test(tag) ? tag : 'p') as BlockTag,
		list: list ? (list.tagName.toLowerCase() as ListKind) : null,
		quote: !!closestTag(range.startContainer, 'blockquote', root),
		align: (block?.style.textAlign as Alignment) || 'left',
		link: linkAt(root, range)?.getAttribute('href') ?? null,
	}
}
