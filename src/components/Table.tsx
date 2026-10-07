import type { ReactNode } from 'react'

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
 */
const Table = <Row extends object = Record<string, unknown>>({
	columns,
	rows,
	rowKey = 'id',
	empty = 'No data',
	caption,
	className = '',
}: TableProps<Row>) => (
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
				{rows.length === 0 ? (
					<tr>
						<td colSpan={columns.length} className="px-4 py-6 text-center text-app-muted">
							{empty}
						</td>
					</tr>
				) : (
					rows.map(row => (
						<tr
							key={String(row[rowKey as keyof Row])}
							className="border-b border-app-border last:border-b-0 hover:bg-app-bg"
						>
							{columns.map(column => (
								<td key={column.key} className={`px-4 py-2.5 ${ALIGN[column.align ?? 'left']}`}>
									{column.render ? column.render(row) : (row[column.key as keyof Row] as ReactNode)}
								</td>
							))}
						</tr>
					))
				)}
			</tbody>
		</table>
	</div>
)

export default Table
