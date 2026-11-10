import type { IconProps } from '../../types'

const Flower2Icon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="2" />
		<circle cx="12" cy="6" r="3" />
		<circle cx="17.2" cy="9" r="3" />
		<circle cx="17.2" cy="15" r="3" />
		<circle cx="12" cy="18" r="3" />
		<circle cx="6.8" cy="15" r="3" />
		<circle cx="6.8" cy="9" r="3" />
	</svg>
)

export default Flower2Icon
