const GAPS = { 0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8' }
const DIRECTIONS = { row: 'flex-row', column: 'flex-col' }
const ALIGNS = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
}
const JUSTIFIES = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
}

/** Flexbox wrapper. gap: 0-4, 6 or 8 (Tailwind spacing steps). */
const Flex = ({
	direction = 'row',
	gap = 3,
	align,
	justify,
	wrap = false,
	inline = false,
	className = '',
	as: Tag = 'div',
	children,
	...rest
}) => (
	<Tag
		className={`${inline ? 'inline-flex' : 'flex'} ${DIRECTIONS[direction]} ${GAPS[gap]} ${align ? ALIGNS[align] : ''} ${
			justify ? JUSTIFIES[justify] : ''
		} ${wrap ? 'flex-wrap' : ''} ${className}`}
		{...rest}
	>
		{children}
	</Tag>
)

export default Flex
