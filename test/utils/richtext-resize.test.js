import {
	columnIndex,
	columnWidth,
	ensureColumns,
	imageWidth,
	lastColumnIndex,
	MIN_SIZE,
	nearRightBorder,
	setColumnWidth,
	setImageWidth,
} from '../../src/utils/richtext/resize'
import sanitizeHtml from '../../src/utils/richtext/sanitize'

const rect = width => ({ width, left: 0, right: width, top: 0, bottom: 0, height: 0, x: 0, y: 0, toJSON() {} })
const table = html => {
	const element = document.createElement('div')
	element.innerHTML = html
	document.body.appendChild(element)
	return element.querySelector('table')
}
afterEach(() => (document.body.innerHTML = ''))

describe('images', () => {
	it('sets the width in px (never below the minimum), in percent, or back to the original', () => {
		const image = document.createElement('img')
		setImageWidth(image, 200.4)
		expect(image.getAttribute('width')).toBe('200')
		setImageWidth(image, 3)
		expect(image.getAttribute('width')).toBe(String(MIN_SIZE))
		setImageWidth(image, '50%')
		expect(image.getAttribute('width')).toBe('50%')
		setImageWidth(image, null)
		expect(image.hasAttribute('width')).toBe(false)
		image.getBoundingClientRect = () => rect(123.6)
		expect(imageWidth(image)).toBe(124)
	})
})

describe('table columns', () => {
	it('numbers the columns, counting spans', () => {
		const t = table('<table><tr><td>a</td><td colspan="2">b</td><td>c</td></tr></table>')
		const cells = [...t.querySelectorAll('td')]
		expect(cells.map(columnIndex)).toEqual([0, 1, 3])
		expect(cells.map(lastColumnIndex)).toEqual([0, 2, 3])
	})

	it('knows when a press is on the right border of a cell', () => {
		const cell = document.createElement('td')
		cell.getBoundingClientRect = () => ({ ...rect(100), right: 100 })
		expect(nearRightBorder(cell, 100)).toBe(true)
		expect(nearRightBorder(cell, 96)).toBe(true)
		expect(nearRightBorder(cell, 90)).toBe(false)
	})

	it('creates a colgroup that matches how the table is drawn', () => {
		const t = table(
			'<table><thead><tr><th>a</th><th colspan="2">b</th></tr></thead><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>'
		)
		const [first, wide] = t.querySelectorAll('th')
		first.getBoundingClientRect = () => rect(100)
		wide.getBoundingClientRect = () => rect(300)
		const columns = ensureColumns(t)
		expect(columns).toHaveLength(3)
		expect(columns.map(columnWidth)).toEqual([100, 150, 150])
		expect(t.firstChild.tagName).toBe('COLGROUP')
		// asking again keeps what is there
		expect(ensureColumns(t)).toEqual(columns)
	})

	it('sets a column width and the table width to the total', () => {
		const t = table('<table><tr><td>a</td><td>b</td></tr></table>')
		const [a, b] = t.querySelectorAll('td')
		a.getBoundingClientRect = () => rect(100)
		b.getBoundingClientRect = () => rect(80)
		setColumnWidth(t, 0, 150.2)
		expect(t.getAttribute('width')).toBe('230')
		setColumnWidth(t, 1, 2)
		expect(t.getAttribute('width')).toBe(String(150 + MIN_SIZE))
		setColumnWidth(t, 9, 100)
		expect(t.getAttribute('width')).toBe(String(150 + MIN_SIZE))
	})

	it('copes with a table without rows, and a column without a width', () => {
		const t = table('<table></table>')
		expect(ensureColumns(t)).toEqual([])
		expect(columnWidth(document.createElement('col'))).toBe(MIN_SIZE)
	})
})

describe('sanitizing sizes', () => {
	it('keeps widths on images, tables and columns, as digits or a percentage', () => {
		expect(sanitizeHtml('<img src="/a.png" width="50%">')).toBe('<img src="/a.png" width="50%">')
		expect(sanitizeHtml('<img src="/a.png" width="320" height="9">')).toBe('<img src="/a.png" width="320">')
		expect(
			sanitizeHtml(
				'<table width="480"><colgroup><col width="200"><col width="280"></colgroup><tr><td>a</td></tr></table>'
			)
		).toBe(
			'<table width="480"><colgroup><col width="200"><col width="280"></colgroup><tbody><tr><td>a</td></tr></tbody></table>'
		)
	})

	it('drops widths that are not plain sizes', () => {
		expect(sanitizeHtml('<img src="/a.png" width="1px;onload=x">')).toBe('<img src="/a.png">')
		expect(sanitizeHtml('<table width="calc(1px)"><tr><td>a</td></tr></table>')).toBe(
			'<table><tbody><tr><td>a</td></tr></tbody></table>'
		)
		expect(sanitizeHtml('<img src="/a.png" width="99999">')).toBe('<img src="/a.png">')
	})
})
