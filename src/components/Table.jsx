const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' }

/**
 * Simple data table. columns: [{ key, header, render?(row), align? }]. `rowKey` names the unique field on each row
 * (default "id"). Scrolls horizontally when it doesn't fit.
 */
const Table = ({ columns, rows, rowKey = 'id', empty = 'No data', caption, className = '' }) => (
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
						<tr key={row[rowKey]} className="border-b border-app-border last:border-b-0 hover:bg-app-bg">
							{columns.map(column => (
								<td key={column.key} className={`px-4 py-2.5 ${ALIGN[column.align ?? 'left']}`}>
									{column.render ? column.render(row) : row[column.key]}
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
