import {
	applyStyle,
	clearFormat,
	comparePoints,
	currentRange,
	ensureBlocks,
	exitEmptyListItem,
	insertHr,
	insertHtml,
	insertImage,
	insertLink,
	insertTable,
	queryState,
	removeLink,
	setAlign,
	setBlock,
	toggleCodeBlock,
	toggleInline,
	toggleList,
	toggleQuote,
} from '../../src/utils/richtext/commands'
import sanitizeHtml from '../../src/utils/richtext/sanitize'

// `{` and `}` in the html mark where the selection starts and ends (`|` for a caret)
let root
const setup = html => {
	root = document.createElement('div')
	root.contentEditable = 'true'
	root.innerHTML = html
	document.body.appendChild(root)
	const find = marker => {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			const at = node.data.indexOf(marker)
			if (at >= 0) {
				node.data = node.data.slice(0, at) + node.data.slice(at + 1)
				return [node, at]
			}
		}
		return null
	}
	const caret = find('|')
	const start = caret ?? find('{')
	const end = caret ?? find('}')
	if (start && end) {
		const range = document.createRange()
		range.setStart(...start)
		range.setEnd(...end)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
	}
	return root
}
const html = () => sanitizeHtml(root.innerHTML)
const selectedText = () => window.getSelection().toString()

afterEach(() => {
	root?.remove()
	root = null
	window.getSelection().removeAllRanges()
})

describe('positions', () => {
	it('orders points in the document', () => {
		setup('<p>ab<b>cd</b>ef</p>')
		const p = root.firstChild
		const text = p.firstChild
		const inner = p.querySelector('b').firstChild
		expect(comparePoints(text, 1, text, 1)).toBe(0)
		expect(comparePoints(text, 1, text, 2)).toBe(-1)
		expect(comparePoints(text, 2, inner, 0)).toBe(-1)
		expect(comparePoints(inner, 0, text, 2)).toBe(1)
		expect(comparePoints(p, 1, inner, 0)).toBe(-1)
		expect(comparePoints(p, 2, inner, 0)).toBe(1)
		expect(comparePoints(inner, 0, p, 1)).toBe(1)
		expect(comparePoints(p, 0, inner, 0)).toBe(-1)
		expect(comparePoints(inner, 0, p.lastChild, 0)).toBe(-1)
		expect(comparePoints(p.lastChild, 0, inner, 0)).toBe(1)
	})

	it('finds the selection only inside the root', () => {
		setup('<p>a{b}c</p>')
		expect(currentRange(root)).not.toBeNull()
		const other = document.createElement('div')
		other.textContent = 'x'
		document.body.appendChild(other)
		window.getSelection().selectAllChildren(other)
		expect(currentRange(root)).toBeNull()
		other.remove()
		window.getSelection().removeAllRanges()
		expect(currentRange(root)).toBeNull()
	})
})

describe('ensureBlocks', () => {
	it('wraps loose text and inline runs in paragraphs, and fills an empty editor', () => {
		setup('hello <b>there</b><h2>T</h2>tail')
		ensureBlocks(root)
		expect(html()).toBe('<p>hello <strong>there</strong></p><h2>T</h2><p>tail</p>')
		setup('')
		ensureBlocks(root)
		expect(root.innerHTML).toBe('<p><br></p>')
		setup('\n<p>a</p>\n')
		ensureBlocks(root)
		expect(root.children).toHaveLength(1)
	})
})

describe('toggleInline', () => {
	it('wraps the selected text, and takes it off again', () => {
		setup('<p>one {two} three</p>')
		toggleInline(root, 'strong')
		expect(html()).toBe('<p>one <strong>two</strong> three</p>')
		expect(selectedText()).toBe('two')
		toggleInline(root, 'strong')
		expect(html()).toBe('<p>one two three</p>')
		expect(selectedText()).toBe('two')
	})

	it('formats across blocks', () => {
		setup('<p>a{b</p><p>c}d</p>')
		toggleInline(root, 'em')
		expect(html()).toBe('<p>a<em>b</em></p><p><em>c</em>d</p>')
		toggleInline(root, 'em')
		expect(html()).toBe('<p>ab</p><p>cd</p>')
	})

	it('adds the format to everything when only some of it has it', () => {
		setup('<p>{a <strong>b</strong> c}</p>')
		toggleInline(root, 'strong')
		expect(html()).toBe('<p><strong>a b c</strong></p>')
	})

	it('removes the format from the middle of a longer stretch', () => {
		setup('<p><strong>aa{bb}cc</strong></p>')
		toggleInline(root, 'strong')
		expect(html()).toBe('<p><strong>aa</strong>bb<strong>cc</strong></p>')
	})

	it('keeps other formats around the one it removes', () => {
		setup('<p><strong><em>a{b}c</em></strong></p>')
		toggleInline(root, 'strong')
		expect(html()).toBe('<p><strong><em>a</em></strong><em>b</em><strong><em>c</em></strong></p>')
	})

	it('merges neighbours of the same format', () => {
		setup('<p><u>a</u>{b}<u>c</u></p>')
		toggleInline(root, 'u')
		expect(html()).toBe('<p><u>abc</u></p>')
	})

	it('formats part of one text node, at either end', () => {
		setup('<p>{ab}cd</p>')
		toggleInline(root, 's')
		expect(html()).toBe('<p><s>ab</s>cd</p>')
		setup('<p>ab{cd}</p>')
		toggleInline(root, 'code')
		expect(html()).toBe('<p>ab<code>cd</code></p>')
	})

	it('does nothing without a selection, or with an empty one in structure', () => {
		setup('<p>x</p>')
		toggleInline(root, 'strong')
		expect(html()).toBe('<p>x</p>')
		setup('<ul>\n<li>a</li>\n</ul>')
		const range = document.createRange()
		range.setStart(root.querySelector('ul'), 0)
		range.setEnd(root.querySelector('ul'), 1)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
		toggleInline(root, 'strong')
		expect(html()).not.toContain('<strong>')
	})

	it('opens a format at the caret and leaves it again', () => {
		setup('<p>ab|cd</p>')
		toggleInline(root, 'strong')
		expect(root.querySelector('strong').textContent).toBe('​')
		const marker = root.querySelector('strong').firstChild
		expect(window.getSelection().anchorNode).toBe(marker)
		expect(queryState(root).bold).toBe(true)
		toggleInline(root, 'strong')
		expect(queryState(root).bold).toBe(false)
		expect(html()).toBe('<p>ab<strong></strong>cd</p>')
	})
})

describe('queryState', () => {
	it('reports formats, block, list, quote, alignment and link', () => {
		setup(
			'<blockquote><h2 style="text-align: center"><strong><em><a href="/x">{ab}</a></em></strong></h2></blockquote>'
		)
		expect(queryState(root)).toMatchObject({
			bold: true,
			italic: true,
			underline: false,
			block: 'h2',
			quote: true,
			align: 'center',
			link: '/x',
			list: null,
		})
		setup('<ol><li>a|b</li></ol>')
		expect(queryState(root)).toMatchObject({ list: 'ol', block: 'p', quote: false, align: 'left', link: null })
	})

	it('needs all of a selection to have a format', () => {
		setup('<p><strong>{a</strong> b}</p>')
		expect(queryState(root).bold).toBe(false)
		setup('<p><strong>{a b}</strong></p>')
		expect(queryState(root).bold).toBe(true)
	})

	it('has a neutral state without a selection', () => {
		setup('<p>a</p>')
		expect(queryState(root)).toMatchObject({ bold: false, block: 'p', list: null })
	})
})

describe('applyStyle', () => {
	it('colors and highlights the selection', () => {
		setup('<p>a {b} c</p>')
		applyStyle(root, 'color', 'red')
		expect(html()).toBe('<p>a <span style="color: red">b</span> c</p>')
		applyStyle(root, 'background-color', '#ff0')
		expect(html()).toContain('background-color: #ff0')
		expect(html()).toContain('color: red')
	})

	it('changes and removes a color', () => {
		setup('<p><span style="color: red">a{b}c</span></p>')
		applyStyle(root, 'color', 'blue')
		expect(html()).toBe(
			'<p><span style="color: red">a</span><span style="color: blue">b</span><span style="color: red">c</span></p>'
		)
		applyStyle(root, 'color', null)
		expect(html()).toBe('<p><span style="color: red">a</span>b<span style="color: red">c</span></p>')
	})

	it('removing a color where there is none changes nothing', () => {
		setup('<p>a{b}c</p>')
		applyStyle(root, 'color', null)
		expect(html()).toBe('<p>abc</p>')
	})

	it('opens a color at the caret', () => {
		setup('<p>a|b</p>')
		applyStyle(root, 'color', 'green')
		expect(root.querySelector('span').style.color).toBe('green')
		expect(window.getSelection().anchorNode).toBe(root.querySelector('span').firstChild)
		setup('<p>a|b</p>')
		applyStyle(root, 'color', null)
		expect(html()).toBe('<p>ab</p>')
	})
})

describe('setBlock', () => {
	it('turns paragraphs into headings and back', () => {
		setup('<p>a|b</p><p>cd</p>')
		setBlock(root, 'h2')
		expect(html()).toBe('<h2>ab</h2><p>cd</p>')
		expect(selectedText()).toBe('')
		expect(window.getSelection().anchorNode.parentNode.tagName).toBe('H2')
		setBlock(root, 'h2')
		expect(html()).toBe('<p>ab</p><p>cd</p>')
	})

	it('changes every selected block and keeps the selection and alignment', () => {
		setup('<p style="text-align: right">{ab</p><p>cd}</p>')
		setBlock(root, 'h3')
		expect(html()).toBe('<h3 style="text-align: right">ab</h3><h3>cd</h3>')
		expect(selectedText()).toBe('abcd')
	})

	it('leaves list items alone and falls back to the start of an empty block', () => {
		setup('<ul><li>a|</li></ul>')
		setBlock(root, 'h1')
		expect(html()).toBe('<ul><li>a</li></ul>')
		setup('<p><br></p>')
		const range = document.createRange()
		range.setStart(root.firstChild, 0)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
		setBlock(root, 'h1')
		expect(root.innerHTML).toBe('<h1><br></h1>')
		expect(window.getSelection().anchorNode).toBe(root.firstChild)
	})

	it('makes and unmakes a code block', () => {
		setup('<p>x{y}<br>z</p>')
		toggleCodeBlock(root)
		expect(root.innerHTML).toBe('<pre>xy\nz</pre>')
		toggleCodeBlock(root)
		expect(html()).toBe('<p>xy<br>z</p>')
		setup('<pre>a\nb\n\nc|</pre>')
		toggleCodeBlock(root)
		expect(html()).toBe('<p>a<br>b<br><br>c</p>')
		setup('<pre>|</pre>')
		toggleCodeBlock(root)
		expect(root.innerHTML).toBe('<p><br></p>')
	})
})

describe('toggleList', () => {
	it('turns paragraphs into a list, and joins them', () => {
		setup('<p>{a</p><p>b}</p><p>c</p>')
		toggleList(root, 'ul')
		expect(html()).toBe('<ul><li>a</li><li>b</li></ul><p>c</p>')
		expect(selectedText()).toBe('ab')
	})

	it('joins a new item to a list next to it', () => {
		setup('<ul><li>a</li></ul><p>b|</p>')
		toggleList(root, 'ul')
		expect(html()).toBe('<ul><li>a</li><li>b</li></ul>')
	})

	it('takes items out of the list, splitting it', () => {
		setup('<ul><li>a</li><li>b|</li><li>c</li></ul>')
		toggleList(root, 'ul')
		expect(html()).toBe('<ul><li>a</li></ul><p>b</p><ul><li>c</li></ul>')
		setup('<ul><li>a|</li></ul>')
		toggleList(root, 'ul')
		expect(html()).toBe('<p>a</p>')
	})

	it('switches between bulleted and numbered', () => {
		setup('<ul><li>a|</li><li>b</li></ul>')
		toggleList(root, 'ol')
		expect(html()).toBe('<ol><li>a</li><li>b</li></ol>')
	})

	it('keeps nested lists when it lifts an item, and the alignment', () => {
		setup('<ul><li style="text-align: center">a|<ul><li>n</li></ul></li></ul>')
		toggleList(root, 'ul')
		expect(html()).toBe('<p style="text-align: center">a</p><ul><li>n</li></ul>')
		setup('<p style="text-align: right">x|</p>')
		toggleList(root, 'ol')
		expect(html()).toBe('<ol><li style="text-align: right">x</li></ol>')
	})

	it('works on the item the caret is in, not on the one that holds it', () => {
		setup('<ul><li>a<ul><li>n|</li></ul></li></ul>')
		toggleList(root, 'ol')
		expect(html()).toBe('<ul><li>a<ol><li>n</li></ol></li></ul>')
	})

	it('skips code blocks and cells', () => {
		setup('<pre>a|</pre>')
		toggleList(root, 'ul')
		expect(html()).toBe('<pre>a</pre>')
	})

	it('leaves an empty list item as a paragraph with Enter', () => {
		setup('<ul><li>a</li><li>|<br></li></ul>')
		expect(exitEmptyListItem(root)).toBe(true)
		expect(html()).toBe('<ul><li>a</li></ul><p><br></p>')
		expect(window.getSelection().anchorNode.tagName).toBe('P')
		setup('<ul><li>a|</li></ul>')
		expect(exitEmptyListItem(root)).toBe(false)
		setup('<ul><li>{a}</li></ul>')
		expect(exitEmptyListItem(root)).toBe(false)
		setup('<p>x</p>')
		expect(exitEmptyListItem(root)).toBe(false)
	})
})

describe('toggleQuote and setAlign', () => {
	it('quotes and unquotes blocks', () => {
		setup('<p>{a</p><p>b}</p><p>c</p>')
		toggleQuote(root)
		expect(html()).toBe('<blockquote><p>a</p><p>b</p></blockquote><p>c</p>')
		toggleQuote(root)
		expect(html()).toBe('<p>a</p><p>b</p><p>c</p>')
	})

	it('joins quotes that touch, and does not quote a quote twice', () => {
		setup('<blockquote><p>a</p></blockquote><p>b|</p>')
		toggleQuote(root)
		expect(html()).toBe('<blockquote><p>a</p><p>b</p></blockquote>')
		setup('<blockquote><p>a|</p></blockquote><p>b</p>')
		toggleQuote(root)
		expect(html()).toBe('<p>a</p><p>b</p>')
	})

	it('quotes everything selected, joining the quote that was already there', () => {
		setup('<p>{a</p><h2>b</h2><blockquote><p>c</p></blockquote><p>d}</p>')
		toggleQuote(root)
		// the groups touch the quote that was already there, so they join it
		expect(html()).toBe('<blockquote><p>a</p><h2>b</h2><p>c</p><p>d</p></blockquote>')
	})

	it('aligns blocks', () => {
		setup('<p>{a</p><p>b}</p>')
		setAlign(root, 'center')
		expect(html()).toBe('<p style="text-align: center">a</p><p style="text-align: center">b</p>')
		setAlign(root, 'left')
		expect(html()).toBe('<p>a</p><p>b</p>')
	})
})

describe('links', () => {
	it('links the selected text', () => {
		setup('<p>a {b} c</p>')
		expect(insertLink(root, 'https://example.com')).toBe(true)
		expect(html()).toBe('<p>a <a href="https://example.com">b</a> c</p>')
		expect(queryState(root).link).toBe('https://example.com')
	})

	it('changes the address of an existing link', () => {
		setup('<p><a href="/old">{ab}</a></p>')
		insertLink(root, '/new')
		expect(html()).toBe('<p><a href="/new">ab</a></p>')
		setup('<p><a href="/old">a|b</a></p>')
		insertLink(root, '/newer')
		expect(html()).toBe('<p><a href="/newer">ab</a></p>')
	})

	it('inserts a link with text at the caret', () => {
		setup('<p>a|b</p>')
		insertLink(root, 'https://x.y', 'Site')
		expect(html()).toBe('<p>a<a href="https://x.y">Site</a>b</p>')
		setup('<p>|</p>')
		insertLink(root, 'https://x.y')
		expect(html()).toBe('<p><a href="https://x.y">https://x.y</a></p>')
	})

	it('refuses addresses that are not safe, or when nothing is selected', () => {
		setup('<p>{a}</p>')
		expect(insertLink(root, 'javascript:alert(1)')).toBe(false)
		expect(html()).toBe('<p>a</p>')
		window.getSelection().removeAllRanges()
		expect(insertLink(root, 'https://x.y')).toBe(false)
	})

	it('removes a link, selected or around the caret', () => {
		setup('<p><a href="/x">a{b}c</a></p>')
		removeLink(root)
		expect(html()).toBe('<p><a href="/x">a</a>b<a href="/x">c</a></p>')
		setup('<p><a href="/x">a|b</a></p>')
		removeLink(root)
		expect(html()).toBe('<p>ab</p>')
		setup('<p>a|b</p>')
		removeLink(root)
		expect(html()).toBe('<p>ab</p>')
		window.getSelection().removeAllRanges()
		removeLink(root)
	})
})

describe('inserts', () => {
	it('inserts an image at the caret and refuses unsafe sources', () => {
		setup('<p>a|b</p>')
		expect(insertImage(root, '/pic.png', 'A picture')).toBe(true)
		expect(html()).toBe('<p>a<img src="/pic.png" alt="A picture">b</p>')
		expect(insertImage(root, 'javascript:alert(1)')).toBe(false)
		setup('<p>a{b}c</p>')
		insertImage(root, '/p.png')
		expect(html()).toBe('<p>a<img src="/p.png">c</p>')
		setup('<p>x</p>')
		insertImage(root, '/p.png')
		expect(html()).toBe('<p>x<img src="/p.png"></p>')
	})

	it('inserts a rule, replacing an empty paragraph and leaving a paragraph to type in', () => {
		setup('<p>a|</p>')
		insertHr(root)
		expect(html()).toBe('<p>a</p><hr><p><br></p>')
		setup('<p>a</p><p>|<br></p>')
		insertHr(root)
		expect(html()).toBe('<p>a</p><hr><p><br></p>')
		expect(window.getSelection().anchorNode.tagName).toBe('P')
	})

	it('inserts a table with a header row', () => {
		setup('<p>a|</p><p>b</p>')
		insertTable(root, 3, 2)
		expect(root.querySelectorAll('thead th')).toHaveLength(2)
		expect(root.querySelectorAll('tbody tr')).toHaveLength(2)
		expect(root.querySelectorAll('td')).toHaveLength(4)
		expect(root.children[2].tagName).toBe('P')
		expect(window.getSelection().anchorNode.tagName).toBe('TH')
		setup('<p>a|</p>')
		insertTable(root)
		expect(root.querySelectorAll('tbody tr')).toHaveLength(2)
		insertTable(root, 0, 1)
		expect(root.querySelectorAll('table')).toHaveLength(2)
	})

	it('adds at the end when nothing is selected', () => {
		setup('<p>a</p>')
		window.getSelection().removeAllRanges()
		insertHr(root)
		expect(html()).toBe('<p>a</p><hr><p><br></p>')
	})
})

describe('clearFormat', () => {
	it('removes formats, colors and links, and plain-paragraphs the blocks', () => {
		setup(
			'<h2 style="text-align: center">{a <strong>b <a href="/x"><em>c</em></a></strong> <span style="color: red">d</span>}</h2>'
		)
		clearFormat(root)
		expect(html()).toBe('<p>a b c d</p>')
	})

	it('keeps list items and cleans a code block', () => {
		setup('<ul><li style="text-align: right">{<strong>a</strong>}</li></ul>')
		clearFormat(root)
		expect(html()).toBe('<ul><li>a</li></ul>')
		setup('<pre>x|y</pre>')
		clearFormat(root)
		expect(html()).toBe('<p>xy</p>')
	})

	it('only resets the block when nothing is selected', () => {
		setup('<h1>a|<strong>b</strong></h1>')
		clearFormat(root)
		expect(html()).toBe('<p>a<strong>b</strong></p>')
		window.getSelection().removeAllRanges()
		clearFormat(root)
	})
})

describe('without a selection', () => {
	it('every command does nothing', () => {
		setup('<p>a</p>')
		window.getSelection().removeAllRanges()
		toggleInline(root, 'strong')
		applyStyle(root, 'color', 'red')
		setBlock(root, 'h1')
		toggleList(root, 'ul')
		toggleQuote(root)
		setAlign(root, 'center')
		expect(html()).toBe('<p>a</p>')
		expect(exitEmptyListItem(root)).toBe(false)
	})
})

describe('insertHtml', () => {
	it('inserts inline content in place', () => {
		setup('<p>a|b</p>')
		insertHtml(root, '<strong>X</strong> y')
		expect(html()).toBe('<p>a<strong>X</strong> yb</p>')
		setup('<p>a{bc}d</p>')
		insertHtml(root, 'Z')
		expect(html()).toBe('<p>aZd</p>')
	})

	it('puts the content of a single paragraph in the current block', () => {
		setup('<p>a|b</p>')
		insertHtml(root, '<p>one</p>')
		expect(html()).toBe('<p>aoneb</p>')
		setup('<p>|<br></p>')
		insertHtml(root, '<p>x</p>')
		expect(html()).toBe('<p>x</p>')
	})

	it('splits the block around the caret for several blocks', () => {
		setup('<p>a|b</p>')
		insertHtml(root, '<h2>T</h2><p>one</p>')
		expect(html()).toBe('<p>a</p><h2>T</h2><p>one</p><p>b</p>')
		setup('<p>ab|</p>')
		insertHtml(root, '<p>one</p><p>two</p>')
		expect(html()).toBe('<p>ab</p><p>one</p><p>two</p>')
		setup('<p>|ab</p>')
		insertHtml(root, '<p>one</p><p>two</p>')
		expect(html()).toBe('<p>one</p><p>two</p><p>ab</p>')
		expect(window.getSelection().anchorNode.tagName).toBe('P')
	})

	it('keeps blocks out of list items, cells and code blocks', () => {
		setup('<ul><li>a|</li></ul>')
		insertHtml(root, '<p>one</p><p>two</p>')
		expect(html()).toBe('<ul><li>aonetwo</li></ul>')
		setup('<pre>a|</pre>')
		insertHtml(root, '<h2>x</h2><p>y</p>')
		expect(html()).toBe('<pre>axy</pre>')
	})

	it('appends at the end without a selection, and ignores nothing', () => {
		setup('<p>a</p>')
		window.getSelection().removeAllRanges()
		insertHtml(root, '<p>b</p>')
		expect(html()).toBe('<p>a</p><p>b</p>')
		insertHtml(root, '')
		expect(html()).toBe('<p>a</p><p>b</p>')
	})
})

describe('div lines', () => {
	it('become paragraphs, keeping the caret', () => {
		setup('<div>one</div><div><br></div><div><p>wrapped</p></div>')
		const range = document.createRange()
		range.setStart(root.children[1], 0)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
		ensureBlocks(root)
		expect(root.innerHTML).toBe('<p>one</p><p><br></p><p>wrapped</p>')
		expect(window.getSelection().anchorNode).toBe(root.children[1])
	})
})

describe('a caret on the editor itself', () => {
	it('inserts blocks after the block before it', () => {
		setup('<p>a</p><p>b</p>')
		const range = document.createRange()
		range.setStart(root, 1)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
		insertHr(root)
		expect(html()).toBe('<p>a</p><hr><p>b</p>')
		setup('<p>a</p><p>b</p>')
		const end = document.createRange()
		end.setStart(root, 0)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(end)
		insertTable(root, 2, 2)
		expect(root.children[1].tagName).toBe('TABLE')
		expect(root.querySelectorAll('td')).toHaveLength(2)
	})
})
