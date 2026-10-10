import type { IconProps } from '../../types'

const QuoteIcon = ({ className }: IconProps) => (
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
		<path d="M3 5h7v7H3z" />
		<path d="M10 12c0 4-2 6-5 7" />
		<path d="M14 5h7v7h-7z" />
		<path d="M21 12c0 4-2 6-5 7" />
	</svg>
)

export default QuoteIcon
