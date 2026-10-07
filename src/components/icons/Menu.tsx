import type { IconProps } from '../../types'

const MenuIcon = ({ className }: IconProps) => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={className ?? 'h-5 w-5'}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path strokeLinecap="square" strokeLinejoin="miter" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	)
}

export default MenuIcon
