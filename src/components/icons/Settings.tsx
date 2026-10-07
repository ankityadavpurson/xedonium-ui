import type { IconProps } from '../../types'

const SettingsIcon = ({ className }: IconProps) => (
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
		<path d="M9.84,5.34 L10.22,2.67 L13.78,2.67 L14.16,5.34 L16.68,6.8 L19.19,5.79 L20.97,8.88 L18.85,10.54 L18.85,13.46 L20.97,15.12 L19.19,18.21 L16.68,17.2 L14.16,18.66 L13.78,21.33 L10.22,21.33 L9.84,18.66 L7.32,17.2 L4.81,18.21 L3.03,15.12 L5.15,13.46 L5.15,10.54 L3.03,8.88 L4.81,5.79 L7.32,6.8Z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
)

export default SettingsIcon
