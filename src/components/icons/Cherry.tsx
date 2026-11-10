import type { IconProps } from '../../types'

const CherryIcon = ({ className }: IconProps) => (
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
		<path d="M2 17a5 5 0 0 0 10 0c0-2.8-2.5-5-5-3-2.5-2-5 .2-5 3z" />
		<path d="M12 17a5 5 0 0 0 10 0c0-2.8-2.5-5-5-3-2.5-2-5 .2-5 3z" />
		<path d="M7 14c3.2-2.9 4.3-8.8 5-12 1.7 2.4 4.9 9 5 12" />
		<path d="M22 9c-4.3 0-7.1-2.3-10-7 5.7 0 10 4.7 10 7z" />
	</svg>
)

export default CherryIcon
