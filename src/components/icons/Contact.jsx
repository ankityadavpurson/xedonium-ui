const ContactIcon = ({ className }) => (
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
		<rect x="3" y="4" width="18" height="16" />
		<circle cx="9" cy="11" r="2.5" />
		<path d="M5.5 17.5l1.5-2.5h4l1.5 2.5" />
		<path d="M15 9h3M15 13h3" />
	</svg>
)

export default ContactIcon
