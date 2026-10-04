const GridIcon = ({ className }) => {
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
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
		</svg>
	)
}

export default GridIcon
