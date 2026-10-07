import type { IconProps } from '../../types'

const CogIcon = ({ className }: IconProps) => (
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
		<path d="M10.32,5 L10.66,2.59 L13.34,2.59 L13.68,5 L15.76,5.86 L17.7,4.4 L19.6,6.3 L18.14,8.24 L19,10.32 L21.41,10.66 L21.41,13.34 L19,13.68 L18.14,15.76 L19.6,17.7 L17.7,19.6 L15.76,18.14 L13.68,19 L13.34,21.41 L10.66,21.41 L10.32,19 L8.24,18.14 L6.3,19.6 L4.4,17.7 L5.86,15.76 L5,13.68 L2.59,13.34 L2.59,10.66 L5,10.32 L5.86,8.24 L4.4,6.3 L6.3,4.4 L8.24,5.86Z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
)

export default CogIcon
