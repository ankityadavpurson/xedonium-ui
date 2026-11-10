import type { IconProps } from '../../types'

const PipetteIcon = ({ className }: IconProps) => (
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
		<path d="M6 18l.8-.8h2.4l7.2-7.2" />
		<path d="M6.8 17.2v-2.4l7.2-7.2" />
		<path d="M16.4 5.2l2.72-2.72a1.68 1.68 0 1 1 2.4 2.4L18.8 7.6l.32.32a1.68 1.68 0 1 1-2.4 2.4l-3.04-3.04a1.68 1.68 0 1 1 2.4-2.4l.32.32z" />
		<path d="M3.5 18.5c1 1 1.5 1.7 1.5 2.5a1.5 1.5 0 0 1-3 0c0-.8.5-1.5 1.5-2.5z" />
	</svg>
)

export default PipetteIcon
