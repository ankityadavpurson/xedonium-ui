import type { IconProps } from '../../types'

const CloseIcon = ({ className }: IconProps) => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={className ?? 'h-5 w-5 text-app-soft'}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
		</svg>
	)
}

export default CloseIcon
