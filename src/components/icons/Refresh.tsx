import type { IconProps } from '../../types'

const RefreshIcon = ({ className }: IconProps) => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={className ?? 'w-3.5 h-3.5'}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path strokeLinecap="square" strokeLinejoin="miter" d="M21 12a9 9 0 11-2.63-6.36" />
			<path strokeLinecap="square" strokeLinejoin="miter" d="M21 3v6h-6" />
		</svg>
	)
}

export default RefreshIcon
