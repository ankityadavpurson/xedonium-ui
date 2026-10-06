const EditIcon = ({ className }) => (
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
		<path d="M11 4H3v17h17v-8" />
		<path d="M18 3l3 3-10 10-4 1 1-4z" />
	</svg>
)

export default EditIcon
