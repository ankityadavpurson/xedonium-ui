import { htmlToMarkdown, markdownToHtml } from '../../src/utils/richtext/convert'
import { captureSelection, createHistory, restoreSelection } from '../../src/utils/richtext/history'

describe('markdownToHtml', () => {
	it('renders the supported blocks', () => {
		expect(markdownToHtml('# Title\n\nSome **bold**, *italic*, ~~gone~~ and `code`.')).toBe(
			'<h1>Title</h1><p>Some <strong>bold</strong>, <em>italic</em>, <s>gone</s> and <code>code</code>.</p>'
		)
		expect(markdownToHtml('- a\n- b\n\n3. c\n4. d')).toBe(
			'<ul><li>a</li><li>b</li></ul><ol start="3"><li>c</li><li>d</li></ol>'
		)
		expect(markdownToHtml('> quoted\n\n---\n\n```js\nlet a = 1 < 2\n```')).toBe(
			'<blockquote><p>quoted</p></blockquote><hr><pre>let a = 1 &lt; 2</pre>'
		)
	})

	it('renders nested and loose lists', () => {
		expect(markdownToHtml('- a\n  - b\n- c')).toBe('<ul><li>a<ul><li>b</li></ul></li><li>c</li></ul>')
		expect(markdownToHtml('- a\n\n- b')).toBe('<ul><li><p>a</p></li><li><p>b</p></li></ul>')
	})

	it('renders links, images and tables', () => {
		expect(markdownToHtml('[site](https://a.b "T") and ![pic](/p.png "P")')).toBe(
			'<p><a href="https://a.b" title="T">site</a> and <img src="/p.png" alt="pic" title="P"></p>'
		)
		expect(markdownToHtml('| a | b |\n|:--|--:|\n| 1 | 2 |')).toBe(
			'<table><thead><tr><th style="text-align: left">a</th><th style="text-align: right">b</th></tr></thead><tbody><tr><td style="text-align: left">1</td><td style="text-align: right">2</td></tr></tbody></table>'
		)
		expect(markdownToHtml('| a |\n|---|')).toBe('<table><thead><tr><th>a</th></tr></thead></table>')
	})

	it('never lets markup or unsafe addresses through', () => {
		expect(markdownToHtml('<script>alert(1)</script>')).not.toContain('<script')
		expect(markdownToHtml('[x](javascript:alert(1))')).toBe('<p>x</p>')
		expect(markdownToHtml('![x](javascript:alert(1))')).toBe('<p>x</p>')
		expect(markdownToHtml('line one  \nline two')).toBe('<p>line one<br>line two</p>')
	})
})

describe('htmlToMarkdown', () => {
	it('writes the supported blocks', () => {
		expect(
			htmlToMarkdown(
				'<h2>Title</h2><p>Some <strong>bold</strong>, <em>italic</em>, <s>gone</s> and <code>code</code>.</p>'
			)
		).toBe('## Title\n\nSome **bold**, *italic*, ~~gone~~ and `code`.')
		expect(htmlToMarkdown('<ul><li>a</li><li>b</li></ul><ol start="3"><li>c</li><li>d</li></ol>')).toBe(
			'- a\n- b\n\n3. c\n4. d'
		)
		expect(htmlToMarkdown('<blockquote><p>a</p><p>b</p></blockquote><hr><pre>x\ny</pre>')).toBe(
			'> a\n>\n> b\n\n---\n\n```\nx\ny\n```'
		)
	})

	it('writes nested lists', () => {
		expect(htmlToMarkdown('<ul><li>a<ul><li>b</li></ul></li><li>c</li></ul>')).toBe('- a\n  - b\n- c')
		expect(htmlToMarkdown('<ol><li>a<ol><li>b</li></ol></li></ol>')).toBe('1. a\n   1. b')
	})

	it('writes links, images and tables', () => {
		expect(
			htmlToMarkdown('<p><a href="https://a.b" title="T">site</a> <img src="/p.png" alt="pic" title="P"></p>')
		).toBe('[site](https://a.b "T") ![pic](/p.png "P")')
		expect(htmlToMarkdown('<p><a href="/a b">x</a><img src="/c)d.png"></p>')).toBe('[x](</a b>)![](</c)d.png>)')
		expect(
			htmlToMarkdown(
				'<table><thead><tr><th style="text-align: left">a</th><th style="text-align: center">b</th><th style="text-align: right">c</th><th>d</th></tr></thead><tbody><tr><td>1|x</td><td>2</td></tr></tbody></table>'
			)
		).toBe('| a | b | c | d |\n| :--- | :---: | ---: | --- |\n| 1\\|x | 2 |  |  |')
		expect(htmlToMarkdown('<table></table>')).toBe('')
	})

	it('drops what Markdown cannot say', () => {
		expect(htmlToMarkdown('<p style="text-align: center"><u>under</u> <span style="color: red">red</span></p>')).toBe(
			'under red'
		)
	})

	it('moves spaces outside of marks, and skips empty ones', () => {
		expect(htmlToMarkdown('<p>a<strong> b </strong>c<em> </em>d</p>')).toBe('a **b** c d')
	})

	it('escapes characters that would be read as Markdown', () => {
		expect(htmlToMarkdown('<p>1 * 2 _ 3 [x] `y` <b>z</b> a|b ~ </p>')).toBe(
			'1 \\* 2 \\_ 3 \\[x\\] \\`y\\` **z** a\\|b \\~'
		)
		expect(htmlToMarkdown('<p># not a heading</p><p>- not a list</p><p>1. nor this</p><p>&gt; nor a quote</p>')).toBe(
			'\\# not a heading\n\n\\- not a list\n\n\\1. nor this\n\n\\> nor a quote'
		)
		expect(htmlToMarkdown('<p>use <code>a `b` c</code> and <code>`x`</code></p>')).toBe('use ``a `b` c`` and `` `x` ``')
		expect(htmlToMarkdown('<pre>```\ncode\n```</pre>')).toBe('````\n```\ncode\n```\n````')
	})

	it('writes line breaks, loose text and unknown blocks', () => {
		expect(htmlToMarkdown('<p>a<br>b</p>')).toBe('a  \nb')
		expect(htmlToMarkdown('loose text<p>para</p>more')).toBe('loose text\n\npara\n\nmore')
		expect(htmlToMarkdown('<ul><li># a</li></ul>')).toBe('- \\# a')
		expect(htmlToMarkdown('<blockquote>plain</blockquote>')).toBe('> plain')
		expect(htmlToMarkdown('')).toBe('')
	})

	it('keeps a round trip stable for the supported subset', () => {
		const samples = [
			'# Title\n\nSome **bold** and *italic* text with `code` and ~~strike~~.',
			'- one\n- two\n  - nested\n- three',
			'1. first\n2. second',
			'> a quote\n>\n> second paragraph',
			'| a | b |\n| --- | :---: |\n| 1 | 2 |',
			'[link](https://example.com "T") and ![pic](/p.png)',
			'```\ncode\nblock\n```\n\n---\n\nend',
		]
		for (const sample of samples) expect(htmlToMarkdown(markdownToHtml(sample))).toBe(sample)
	})
})

describe('history', () => {
	const snap = (html, selection = null) => ({ html, selection })

	it('goes back and forward through the states', () => {
		const history = createHistory(snap('a'))
		expect(history.canUndo()).toBe(false)
		history.record(snap('b'))
		history.record(snap('c'))
		expect(history.undo()).toEqual(snap('b'))
		expect(history.undo()).toEqual(snap('a'))
		expect(history.undo()).toBeNull()
		expect(history.canRedo()).toBe(true)
		expect(history.redo()).toEqual(snap('b'))
		expect(history.redo()).toEqual(snap('c'))
		expect(history.redo()).toBeNull()
	})

	it('drops the redo steps when something new is recorded', () => {
		const history = createHistory(snap('a'))
		history.record(snap('b'))
		history.undo()
		history.record(snap('c'))
		expect(history.canRedo()).toBe(false)
		expect(history.undo()).toEqual(snap('a'))
	})

	it('shares one step between edits typed close together', () => {
		let time = 1000
		const history = createHistory(snap('a'), { now: () => time })
		history.record(snap('ab'), true)
		time += 100
		history.record(snap('abc'), true)
		time += 100
		history.record(snap('abcd'), true)
		expect(history.undo()).toEqual(snap('a'))
		history.redo()
		time += 2000
		history.record(snap('abcde'), true)
		expect(history.undo()).toEqual(snap('abcd'))
	})

	it('does not merge into a step made by a command', () => {
		let time = 1000
		const history = createHistory(snap('a'), { now: () => time })
		history.record(snap('<b>a</b>'))
		time += 50
		history.record(snap('<b>ab</b>'), true)
		expect(history.undo()).toEqual(snap('<b>a</b>'))
	})

	it('only updates the selection when the text did not change', () => {
		const history = createHistory(snap('a'))
		history.record(snap('b'))
		const moved = { start: { path: [0], offset: 1 }, end: { path: [0], offset: 1 } }
		history.record(snap('b', moved))
		history.record(snap('c'))
		expect(history.undo()).toEqual(snap('b', moved))
	})

	it('keeps at most `limit` states, and can start over', () => {
		const history = createHistory(snap('0'), { limit: 3 })
		for (const value of ['1', '2', '3', '4']) history.record(snap(value))
		expect(history.undo()).toEqual(snap('3'))
		expect(history.undo()).toEqual(snap('2'))
		expect(history.undo()).toBeNull()
		history.reset(snap('x'))
		expect(history.canUndo()).toBe(false)
		expect(history.canRedo()).toBe(false)
	})
})

describe('selection paths', () => {
	let root
	beforeEach(() => {
		root = document.createElement('div')
		root.innerHTML = '<p>one <b>two</b></p><p>three</p>'
		document.body.appendChild(root)
	})
	afterEach(() => {
		root.remove()
		window.getSelection().removeAllRanges()
	})

	it('saves a selection and puts it back after the html was rewritten', () => {
		const range = document.createRange()
		range.setStart(root.querySelector('b').firstChild, 1)
		range.setEnd(root.lastChild.firstChild, 3)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)
		const saved = captureSelection(root)
		expect(saved).toEqual({ start: { path: [0, 1, 0], offset: 1 }, end: { path: [1, 0], offset: 3 } })
		const html = root.innerHTML
		window.getSelection().removeAllRanges()
		root.innerHTML = html
		expect(restoreSelection(root, saved)).toBe(true)
		expect(window.getSelection().toString()).toBe('wo' + 'thr')
	})

	it('copes with a selection outside, a missing one and a path that no longer exists', () => {
		expect(captureSelection(root)).toBeNull()
		window.getSelection().selectAllChildren(document.body)
		expect(captureSelection(root)).toBeNull()
		expect(restoreSelection(root, null)).toBe(false)
		expect(restoreSelection(root, { start: { path: [9], offset: 0 }, end: { path: [9], offset: 0 } })).toBe(false)
		expect(restoreSelection(root, { start: { path: [0, 0], offset: 99 }, end: { path: [0, 0], offset: 99 } })).toBe(
			true
		)
		expect(window.getSelection().anchorOffset).toBe(4)
	})
})
