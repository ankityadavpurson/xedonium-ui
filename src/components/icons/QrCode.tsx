import type { IconProps } from '../../types'

const QrCodeIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="3" width="6" height="6" />
		<rect x="15" y="3" width="6" height="6" />
		<rect x="3" y="15" width="6" height="6" />
		<path d="M15 15h2v2h-2zM19 15h2M15 19h2M19 19h2v2h-2z" />
	</svg>
)

export default QrCodeIcon
