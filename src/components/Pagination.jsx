// Page numbers to show: first, last, current +/- siblings, with null marking a gap
const buildPages = (page, pageCount, siblings) => {
	const pages = new Set([1, pageCount])
	for (let p = page - siblings; p <= page + siblings; p++) if (p > 1 && p < pageCount) pages.add(p)
	const sorted = [...pages].sort((a, b) => a - b)
	const result = []
	sorted.forEach((p, i) => {
		if (i > 0 && p - sorted[i - 1] > 1) result.push(null)
		result.push(p)
	})
	return result
}

const itemClass = (active = false) =>
	`min-w-[2.25rem] border px-2 py-1.5 text-xs font-semibold tracking-widest transition disabled:cursor-not-allowed disabled:opacity-50 ${
		active
			? 'border-app-strong bg-app-strong text-app-bg'
			: 'border-app-border bg-app-bg text-app-text hover:border-app-strong'
	}`

/** Page selector. 1-based `page`; `onChange` receives the new page number. */
const Pagination = ({ page, pageCount, onChange, siblings = 1, className = '' }) => (
	<nav aria-label="Pagination" className={className}>
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
	</nav>
)

export default Pagination
