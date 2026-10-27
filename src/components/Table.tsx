import type { HTMLAttributes, ReactNode } from 'react'

export interface TableColumn<Row extends object = Record<string, unknown>> {
	key: string
	header: ReactNode
	/** Custom cell content. */
	render?: (row: Row) => ReactNode
	align?: 'left' | 'center' | 'right'
}

export interface TableProps<Row extends object = Record<string, unknown>> {
	columns: TableColumn<Row>[]
	rows: Row[]
	/** Name of the unique field on each row (default `id`). */
	rowKey?: string
	/** Shown when there are no rows. */
	empty?: ReactNode
	/** Screen-reader caption. */
	caption?: string
	/** Rows for which this returns true get the `hidden` attribute but stay mounted (images and inputs keep their state). */
	isRowHidden?: (row: Row) => boolean
	/** Extra attributes for a row's `<tr>`, e.g. `className` or `aria-selected`. */
	rowProps?: (row: Row) => HTMLAttributes<HTMLTableRowElement>
	className?: string
}

const ALIGN: Record<'left' | 'center' | 'right', string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
}

/**
 * Simple data table. columns: [{ key, header, render?(row), align? }]. `rowKey` names the unique field on each row
 * (default "id"). Scrolls horizontally when it doesn't fit.
 * `rowProps(row)` adds attributes (such as `className`) to a row; `isRowHidden(row)` hides a row with the `hidden`
 * attribute without unmounting it, so filtering keeps its images and inputs alive. The empty message shows when no
 * row is visible.
 */
const Table = <Row extends object = Record<string, unknown>>({
	columns,
	rows,
	rowKey = 'id',
	empty = 'No data',
	caption,
	isRowHidden,
	rowProps,
	className = '',
}: TableProps<Row>) => {
	const hidden = rows.map(row => !!isRowHidden?.(row))
	const lastVisible = hidden.lastIndexOf(false)
	return (
		<div className={`overflow-x-auto border border-app-border ${className}`}>
			<table className="w-full border-collapse bg-app-card text-sm text-app-text">
				{caption && <caption className="sr-only">{caption}</caption>}
				<thead>
					<tr className="border-b border-app-border bg-app-bg">
						{columns.map(column => (
							<th
								key={column.key}
								scope="col"
								className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-app-muted ${ALIGN[column.align ?? 'left']}`}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{lastVisible === -1 && (
						<tr>
							<td colSpan={columns.length} className="px-4 py-6 text-center text-app-muted">
								{empty}
							</td>
						</tr>
					)}
					{rows.map((row, index) => {
						const { className: rowClass = '', ...attributes } = rowProps?.(row) ?? {}
						return (
							<tr
								{...attributes}
								key={String(row[rowKey as keyof Row])}
								hidden={hidden[index] || undefined}
								className={`border-app-border hover:bg-app-bg ${index === lastVisible ? '' : 'border-b'} ${rowClass}`}
							>
								{columns.map(column => (
									<td key={column.key} className={`px-4 py-2.5 ${ALIGN[column.align ?? 'left']}`}>
										{column.render ? column.render(row) : (row[column.key as keyof Row] as ReactNode)}
									</td>
								))}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default Table
