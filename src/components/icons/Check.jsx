const CheckIcon = ({ className }) => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={className ?? 'w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400'}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
		>
			<path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
		</svg>
	)
}

export default CheckIcon
