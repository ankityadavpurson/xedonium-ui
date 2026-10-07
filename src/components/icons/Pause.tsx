import type { IconProps } from '../../types'

const PauseIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" focusable="false" className={className ?? 'w-4 h-4'} fill="currentColor" viewBox="0 0 24 24">
		<path d="M7 5h4v14H7z" />
		<path d="M13 5h4v14h-4z" />
	</svg>
)

export default PauseIcon
