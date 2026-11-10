import type { IconProps } from '../../types'

const VolleyballIcon = ({ className }: IconProps) => (
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
		<path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
		<path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
		<path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
		<path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
		<path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
	</svg>
)

export default VolleyballIcon
