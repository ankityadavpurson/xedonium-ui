const PencilIcon = ({ className }) => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={className ?? 'h-5 w-5 text-app-soft'}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.862 3.487a2.25 2.25 0 113.182 3.182L8.25 18.463 4 20l1.537-4.25L16.862 3.487z"
			/>
		</svg>
	)
}

export default PencilIcon
