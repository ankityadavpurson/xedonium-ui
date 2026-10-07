import type { IconProps } from '../../types'

const PlayIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" focusable="false" className={className ?? 'w-4 h-4'} fill="currentColor" viewBox="0 0 24 24">
		<path d="M8 5v14l11-7z" />
	</svg>
)

export default PlayIcon
