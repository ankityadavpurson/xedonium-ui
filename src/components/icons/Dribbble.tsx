import type { IconProps } from '../../types'

const DribbbleIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="10" />
		<path d="M18.5 4.5C14 9 9 10.5 2.5 11" />
		<path d="M21.5 13c-6-1-11 1-14.5 6.5" />
		<path d="M8 2.5C12 8 14 12 16 21" />
	</svg>
)

export default DribbbleIcon
