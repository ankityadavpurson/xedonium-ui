import type { IconProps } from '../../types'

const JapaneseYenIcon = ({ className }: IconProps) => (
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
		<path d="M12 9.5V21" />
		<path d="M12 9.5L6 3" />
		<path d="M12 9.5L18 3" />
		<path d="M6 15h12" />
		<path d="M6 11h12" />
	</svg>
)

export default JapaneseYenIcon
