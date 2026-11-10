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
		<path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
		<path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
		<path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
	</svg>
)

export default DribbbleIcon
