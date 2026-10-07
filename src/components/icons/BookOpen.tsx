import type { IconProps } from '../../types'

const BookOpenIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-4 w-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<path d="M2 4h7l3 2 3-2h7v15h-7l-3 2-3-2H2z" />
		<path d="M12 6v15" />
	</svg>
)

export default BookOpenIcon
