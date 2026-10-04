const COLS = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
	5: 'grid-cols-5',
	6: 'grid-cols-6',
	12: 'grid-cols-12',
}
// `responsive` collapses to fewer columns on small screens and steps up at sm / lg
const RESPONSIVE_COLS = {
	1: 'grid-cols-1',
	2: 'grid-cols-1 sm:grid-cols-2',
	3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
	4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
	5: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5',
	6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
	12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12',
}
const GAPS = { 0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' }

/** CSS grid. cols: 1-6 or 12. */
const Grid = ({ cols = 2, gap = 4, responsive = true, className = '', as: Tag = 'div', children, ...rest }) => (
	<Tag className={`grid ${(responsive ? RESPONSIVE_COLS : COLS)[cols]} ${GAPS[gap]} ${className}`} {...rest}>
		{children}
	</Tag>
)

export default Grid
