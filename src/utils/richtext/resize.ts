// Sizing for images and table columns in the rich text editor. Sizes are stored as plain `width` attributes (an image's
// width, a table's width, a column's width), which the sanitizer keeps and every browser understands.

/** The smallest an image or a column can be made, in px. */
export const MIN_SIZE = 24

/** How close to a cell's right edge a press counts as grabbing the column border, in px. */
export const BORDER_GRAB = 5

const rendered = (element: Element) => Math.round(element.getBoundingClientRect().width)

// ---------------------------------------------------------------------------------------------------------------
// Images

/** Sets an image's width: a number of px, a percentage such as `'50%'`, or `null` for its own size. */
export const setImageWidth = (image: HTMLImageElement, width: number | string | null) => {
	if (width === null) image.removeAttribute('width')
	else image.setAttribute('width', typeof width === 'number' ? String(Math.max(MIN_SIZE, Math.round(width))) : width)
}

/** The width an image is shown at, in px. */
export const imageWidth = (image: HTMLImageElement) => rendered(image)

// ---------------------------------------------------------------------------------------------------------------
// Table columns

/** The column a cell starts in (counting the columns that cells before it span). */
export const columnIndex = (cell: HTMLTableCellElement) => {
	let index = 0
	for (let previous = cell.previousElementSibling; previous; previous = previous.previousElementSibling) {
		index += Number((previous as HTMLTableCellElement).colSpan) || 1
	}
	return index
}

/** The column a cell ends in: where its right border is. */
export const lastColumnIndex = (cell: HTMLTableCellElement) => columnIndex(cell) + (Number(cell.colSpan) || 1) - 1

/** Whether `clientX` is on the right border of `cell`. */
export const nearRightBorder = (cell: Element, clientX: number) => {
	const { right } = cell.getBoundingClientRect()
	return Math.abs(clientX - right) <= BORDER_GRAB
}

/** The columns of a table as `col` elements, creating a `colgroup` that matches how the table is drawn now. */
export const ensureColumns = (table: HTMLTableElement): HTMLTableColElement[] => {
	let group = table.querySelector(':scope > colgroup')
	const row = table.querySelector('tr')
	const count = row
		? [...row.children].reduce((sum, cell) => sum + (Number((cell as HTMLTableCellElement).colSpan) || 1), 0)
		: 0
	if (!group) {
		group = document.createElement('colgroup')
		table.insertBefore(group, table.firstChild)
	}
	const columns = [...group.querySelectorAll('col')]
	while (columns.length < count) {
		const column = document.createElement('col')
		group.appendChild(column)
		columns.push(column)
	}
	// columns without a pixel width take the width they are drawn at
	const cells = row ? ([...row.children] as HTMLTableCellElement[]) : []
	cells.forEach(cell => {
		const span = Number(cell.colSpan) || 1
		for (let at = columnIndex(cell); at < columnIndex(cell) + span; at++) {
			const column = columns[at]
			if (column && !/^\d+$/.test(column.getAttribute('width') ?? '')) {
				column.setAttribute('width', String(Math.max(MIN_SIZE, Math.round(rendered(cell) / span))))
			}
		}
	})
	return columns
}

/** The width of a column in px. */
export const columnWidth = (column: HTMLTableColElement) => Number(column.getAttribute('width')) || MIN_SIZE

/** Sets one column's width, and the table's width to the sum of its columns. */
export const setColumnWidth = (table: HTMLTableElement, index: number, width: number) => {
	const columns = ensureColumns(table)
	const column = columns[index]
	if (!column) return
	column.setAttribute('width', String(Math.max(MIN_SIZE, Math.round(width))))
	table.setAttribute('width', String(columns.reduce((sum, item) => sum + columnWidth(item), 0)))
}
