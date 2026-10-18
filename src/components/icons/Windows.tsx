import type { IconProps } from '../../types'

// Brand mark drawn for this library: four squares. Windows is a trademark of Microsoft.
const WindowsIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" focusable="false" className={className ?? 'h-4 w-4'} viewBox="0 0 24 24" fill="currentColor">
		<path d="M0 0h11.5v11.5H0zM12.5 0H24v11.5H12.5zM0 12.5h11.5V24H0zM12.5 12.5H24V24H12.5z" />
	</svg>
)

export default WindowsIcon
