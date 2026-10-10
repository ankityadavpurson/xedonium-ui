import sanitizeHtml, { cleanStyle } from '../../src/utils/richtext/sanitize'

describe('sanitizeHtml', () => {
	it('keeps the supported formatting', () => {
		const html =
			'<h2>Title</h2><p>Some <strong>bold</strong>, <em>italic</em>, <u>under</u>, <s>strike</s> and <code>code</code>.</p>' +
			'<ul><li>one</li><li>two</li></ul><ol start="3"><li>three</li></ol><blockquote><p>quote</p></blockquote><hr>' +
			'<pre>a\nb</pre><table><thead><tr><th>H</th></tr></thead><tbody><tr><td colspan="2">C</td></tr></tbody></table>'
		expect(sanitizeHtml(html)).toBe(html)
	})

	it('renames the old-fashioned tags', () => {
		expect(sanitizeHtml('<b>a</b><i>b</i><strike>c</strike><del>d</del><div>e</div>')).toBe(
			'<strong>a</strong><em>b</em><s>c</s><s>d</s><p>e</p>'
		)
	})

	it('unwraps a div that wraps blocks, and unknown tags', () => {
		expect(sanitizeHtml('<div><p>a</p><p>b</p></div>')).toBe('<p>a</p><p>b</p>')
		expect(sanitizeHtml('<p><font color="red">x</font><custom-tag>y</custom-tag></p>')).toBe('<p>xy</p>')
	})

	it('drops scripts, styles, frames, forms and their contents', () => {
		const out = sanitizeHtml(
			'<p>a</p><script>alert(1)</script><style>p{}</style><iframe></iframe><form><input value="x"></form><svg onload="x"></svg><p>b</p>'
		)
		expect(out).toBe('<p>a</p><p>b</p>')
	})

	it('removes event handlers and unknown attributes', () => {
		const out = sanitizeHtml(
			'<p onclick="x()" id="a" class="b" data-x="1">hi</p><img src="/a.png" onerror="x()" alt="A">'
		)
		expect(out).toBe('<p>hi</p><img src="/a.png" alt="A">')
	})

	it('only lets safe URLs through', () => {
		expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).toBe('x')
		expect(sanitizeHtml('<a href="  JaVa\nScRiPt:alert(1)">x</a>')).toBe('x')
		expect(sanitizeHtml('<a href="data:text/html,<b>">x</a>')).toBe('x')
		expect(sanitizeHtml('<a href="https://example.com/a?b=1" title="T">x</a>')).toBe(
			'<a href="https://example.com/a?b=1" title="T">x</a>'
		)
		expect(sanitizeHtml('<a href="/relative">x</a><a href="#top">y</a><a href="mailto:a@b.c">z</a>')).toContain(
			'href="/relative"'
		)
		expect(sanitizeHtml('<img src="javascript:alert(1)">')).toBe('')
		expect(sanitizeHtml('<img src="data:text/html;base64,AAAA">')).toBe('')
		expect(sanitizeHtml('<img src="data:image/png;base64,AAAA" alt="x">')).toContain('data:image/png')
	})

	it('adds rel to links that open a new tab, and only for web addresses', () => {
		expect(sanitizeHtml('<a href="https://a.b" target="_blank">x</a>')).toBe(
			'<a href="https://a.b" target="_blank" rel="noopener noreferrer">x</a>'
		)
		expect(sanitizeHtml('<a href="/a" target="_blank">x</a>')).toBe('<a href="/a">x</a>')
	})

	it('keeps colors and alignment but nothing else from style', () => {
		expect(sanitizeHtml('<p style="text-align: center; position: fixed; color: red">a</p>')).toBe(
			'<p style="text-align: center; color: red">a</p>'
		)
		expect(sanitizeHtml('<span style="background-color:#ff0; color:rgb(1, 2, 3)">a</span>')).toBe(
			'<span style="background-color: #ff0; color: rgb(1, 2, 3)">a</span>'
		)
		expect(sanitizeHtml('<span style="color: url(javascript:x)">a</span>')).toBe('a')
		expect(sanitizeHtml('<span style="background-color: expression(alert(1))">a</span>')).toBe('a')
		expect(sanitizeHtml('<mark style="background-color: yellow">a</mark>')).toBe(
			'<span style="background-color: yellow">a</span>'
		)
	})

	it('survives malformed and nested markup', () => {
		expect(sanitizeHtml('<p>a<b>b<i>c</p>d')).toBe('<p>a<strong>b<em>c</em></strong></p>d')
		expect(sanitizeHtml('<<script>script>x</script>')).not.toContain('<script')
		expect(sanitizeHtml('<p title="&quot;><script>x</script>">a</p>')).not.toContain('<script')
	})

	it('removes the invisible characters the editor uses to hold the caret', () => {
		expect(sanitizeHtml('<p>a​b﻿c</p>')).toBe('<p>abc</p>')
	})

	it('returns an empty string for empty input, and keeps text as text', () => {
		expect(sanitizeHtml('')).toBe('')
		expect(sanitizeHtml('a < b & c')).toBe('a &lt; b &amp; c')
	})

	it('numbers and sizes in table attributes must be plain digits', () => {
		expect(sanitizeHtml('<table><tr><td colspan="x" rowspan="2">a</td></tr></table>')).toContain('<td rowspan="2">')
		expect(sanitizeHtml('<ol start="x"><li>a</li></ol>')).toBe('<ol><li>a</li></ol>')
	})
})

describe('cleanStyle', () => {
	it('keeps only valid declarations', () => {
		expect(cleanStyle('color: red; nonsense; width: 5px; text-align: weird; text-align: RIGHT')).toBe(
			'color: red; text-align: right'
		)
		expect(cleanStyle('color: red !important')).toBe('color: red')
	})
})
