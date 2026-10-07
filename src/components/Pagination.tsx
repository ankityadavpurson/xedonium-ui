import Select from './Select'

export interface PaginationProps {
	/** Current page, 1-based. */
	page: number
	pageCount: number
	/** Receives the new page number. */
	onChange: (page: number) => void
	/** Page buttons shown each side of the current one. */
	siblings?: number
	pageSize?: number
	/** E.g. `[10, 25, 50]`; with `onPageSizeChange` adds a "Per page" select. */
	pageSizeOptions?: number[]
	onPageSizeChange?: (size: number) => void
	pageSizeLabel?: string
	className?: string
}

// Page numbers to show: first, last, current +/- siblings, with null marking a gap
const buildPages = (page: number, pageCount: number, siblings: number) => {
	const pages = new Set([1, pageCount])
	for (let p = page - siblings; p <= page + siblings; p++) if (p > 1 && p < pageCount) pages.add(p)
	const sorted = [...pages].sort((a, b) => a - b)
	const result: (number | null)[] = []
	sorted.forEach((p, i) => {
		if (i > 0 && p - sorted[i - 1] > 1) result.push(null)
		result.push(p)
	})
	return result
}

const itemClass = (active = false) =>
	`min-h-9 min-w-9 border px-2 py-1.5 text-xs font-semibold tracking-widest transition disabled:cursor-not-allowed disabled:opacity-50 ${
		active
			? 'border-app-strong bg-app-strong text-app-bg'
			: 'border-app-border bg-app-bg text-app-text hover:border-app-strong'
	}`

/**
 * Page selector. 1-based `page`; `onChange` receives the new page number. Pass `pageSizeOptions` (e.g. [10, 25, 50])
 * with `pageSize` and `onPageSizeChange(size)` to add a "Per page" select; the parent decides what page to show next
 * (usually back to 1) and recomputes `pageCount`.
 */
const Pagination = ({
	page,
	pageCount,
	onChange,
	siblings = 1,
	pageSize,
	pageSizeOptions,
	onPageSizeChange,
	pageSizeLabel = 'Per page',
	className = '',
}: PaginationProps) => {
	const pages = (
		<ul className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
			<li>
				<button type="button" className={itemClass()} disabled={page <= 1} onClick={() => onChange(page - 1)}>
					Prev
				</button>
			</li>
			{buildPages(page, pageCount, siblings).map((p, i) =>
				p === null ? (
					<li key={`gap-${i}`} aria-hidden="true" className="px-1 text-app-muted">
						…
					</li>
				) : (
					<li key={p}>
						<button
							type="button"
							className={itemClass(p === page)}
							aria-current={p === page ? 'page' : undefined}
							aria-label={`Page ${p}`}
							onClick={() => onChange(p)}
						>
							{p}
						</button>
					</li>
				)
			)}
			<li>
				<button type="button" className={itemClass()} disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
					Next
				</button>
			</li>
		</ul>
	)

	if (!pageSizeOptions || !onPageSizeChange)
		return (
			<nav aria-label="Pagination" className={className}>
				{pages}
			</nav>
		)

	return (
		<div className={`flex flex-wrap items-end justify-between gap-3 ${className}`}>
			<div className="w-28">
				<Select
					label={pageSizeLabel}
					value={String(pageSize)}
					onChange={value => onPageSizeChange(Number(value))}
					options={pageSizeOptions.map(size => ({ value: String(size), label: String(size) }))}
				/>
			</div>
			<nav aria-label="Pagination">{pages}</nav>
		</div>
	)
}

export default Pagination
