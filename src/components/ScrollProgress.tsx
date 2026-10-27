import useScrollProgress, { type ScrollTarget } from '../hooks/useScrollProgress'
import BackToTop, { type BackToTopPosition } from './BackToTop'
import type { Size } from '../types'

export interface ScrollProgressProps {
	/**
	 * `bar` (the default): a thin bar along the top of the page that fills as the reader scrolls.
	 * `button`: a round back-to-top button with a ring that fills instead.
	 */
	variant?: 'bar' | 'button'
	/** What scrolls: the page (the default), an element, or a ref to a scrolling element. */
	target?: ScrollTarget
	/** `true` (the default) fixes it to the viewport; `false` places it inside the nearest `relative` parent. */
	fixed?: boolean
	/** Accessible name (default `Reading progress`; for the button variant, `Back to top`). */
	label?: string
	/** Bar: which edge it sits on (default `top`). */
	edge?: 'top' | 'bottom'
	/** Bar: thickness in px (default `4`). */
	thickness?: number
	/** Button: show it after this many pixels of scrolling (default `300`). */
	threshold?: number
	/** Button: which corner it sits in (default `bottom-right`). */
	position?: BackToTopPosition
	/** Button: size of the button. */
	size?: Size
	/** Classes for the bar's fill (e.g. `bg-red-500`). Set the `--xd-progress` CSS variable to colour the bar and the ring without classes. */
	barClassName?: string
	className?: string
}

/**
 * Shows how far down the page (or a scrolling element) the reader is. The `bar` variant is a slim line along the top
 * edge; the `button` variant is a back-to-top button wrapped in a progress ring (see `BackToTop`).
 * The bar fill and the ring stroke read the `--xd-progress` CSS variable (default: the strong text colour); `barClassName` styles the bar fill.
 */
const ScrollProgress = ({
	variant = 'bar',
	target,
	fixed = true,
	label,
	edge = 'top',
	thickness = 4,
	threshold,
	position,
	size,
	barClassName = '',
	className = '',
}: ScrollProgressProps) => {
	const { progress } = useScrollProgress(target)

	if (variant === 'button') {
		return (
			<BackToTop
				showProgress
				target={target}
				fixed={fixed}
				label={label}
				threshold={threshold}
				position={position}
				size={size}
				className={className}
			/>
		)
	}

	const percent = Math.round(progress * 100)
	return (
		<div
			role="progressbar"
			aria-label={label ?? 'Reading progress'}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={percent}
			style={{ height: thickness }}
			className={`${fixed ? 'fixed' : 'absolute'} inset-x-0 ${edge === 'top' ? 'top-0' : 'bottom-0'} z-[var(--xd-z-popover,85)] bg-app-border/40 ${className}`}
		>
			<div
				className={`h-full ${barClassName}`}
				style={{ width: `${progress * 100}%`, background: 'var(--xd-progress, rgb(var(--color-app-strong)))' }}
			/>
		</div>
	)
}

export default ScrollProgress
