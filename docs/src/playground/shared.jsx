export const Section = ({ title, children, className = '' }) => (
	<section className="flex flex-col gap-3 border border-app-border bg-app-card p-5">
		<h2 className="text-xs font-semibold uppercase tracking-widest text-app-muted">{title}</h2>
		<div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>
	</section>
)

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
export const series = [
	{ name: 'Visits', values: [12, 19, 14, 25, 22, 30] },
	{ name: 'Wakes', values: [5, 9, 7, 12, 10, 16] },
]
export const people = Array.from({ length: 23 }, (_, i) => ({
	id: i + 1,
	name: ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret'][i % 5] + ' ' + (i + 1),
	role: ['Admin', 'Editor', 'Viewer'][i % 3],
	score: (i * 37) % 100,
}))
