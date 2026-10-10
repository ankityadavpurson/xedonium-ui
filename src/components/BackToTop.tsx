import type { ReactNode } from 'react'
import type { Size } from '../types'
import useScrollProgress, { type ScrollTarget } from '../hooks/useScrollProgress'
import FloatingActionButton from './FloatingActionButton'
import ChevronUpIcon from './icons/ChevronUp'

export type BackToTopPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'

export interface BackToTopProps {
	/** What scrolls: the page (the default), an element, or a ref to a scrolling element. */
	target?: ScrollTarget
	/** Show the button after this many pixels of scrolling (default `300`). */
	threshold?: number
	/** Which corner it sits in (default `bottom-right`). */
	position?: BackToTopPosition
	/**
	 * `true` (the default) fixes it to the viewport, for a page. `false` places it inside the nearest `relative`
	 * parent instead, for a scrolling panel: put the button next to the scrolling element, not inside it.
	 */
	fixed?: boolean
	/** Draw a ring around the button that fills as the reader scrolls. */
	showProgress?: boolean
	/** Name of the button, also shown as its tooltip (default `Back to top`). */
	label?: string
	size?: Size
	/** `square` (the default) or `circle`. A progress ring is always round. */
	shape?: 'circle' | 'square'
	/** Replaces the arrow. */
	children?: ReactNode
	/** Scroll without the animation (the animation is also skipped for users who prefer reduced motion). */
	instant?: boolean
	className?: string
}

const CORNER: Record<BackToTopPosition, string> = {
	'bottom-right': 'bottom-5 right-5',
	'bottom-left': 'bottom-5 left-5',
	'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
}

const prefersReducedMotion = () =>
	typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** The ring: a track and an arc of `progress` (0 to 1) of the way round, starting at the top. */
export const ProgressRing = ({ progress }: { progress: number }) => {
	// a dash that is the whole circle still leaves a hairline where it starts: draw a plain circle instead
	const full = progress >= 0.999
	return (
		<span className="pointer-events-none absolute -inset-px">
			<svg
				aria-hidden="true"
				focusable="false"
				viewBox="0 0 36 36"
				className="h-full w-full -rotate-90"
				fill="none"
				strokeWidth={2.5}
			>
				<circle cx="18" cy="18" r="16.5" className="stroke-app-border" />
				<circle
					cx="18"
					cy="18"
					r="16.5"
					pathLength={100}
					strokeDasharray={full ? undefined : 100}
					strokeDashoffset={full ? undefined : 100 - progress * 100}
					className="stroke-app-strong"
				/>
			</svg>
		</span>
	)
}

/**
 * A button that appears once the page (or one scrolling element) has moved down, and scrolls back to the top. With
 * `showProgress` a ring around it fills as the reader goes down. It is hidden, and out of the tab order, until it is
 * needed.
 */
const BackToTop = ({
	target,
	threshold = 300,
	position = 'bottom-right',
	fixed = true,
	showProgress = false,
	label = 'Back to top',
	size = 'md',
	shape = 'square',
	children,
	instant = false,
	className = '',
}: BackToTopProps) => {
	const { progress, scrollTop } = useScrollProgress(target)
	const visible = scrollTop > threshold

	const goTop = () => {
		const behavior = instant || prefersReducedMotion() ? 'auto' : 'smooth'
		const element = target ? ('current' in target ? target.current : target) : null
		;(element ?? window).scrollTo({ top: 0, behavior })
	}

	return (
		<div
			className={`${fixed ? 'fixed' : 'absolute'} z-[var(--xd-z-popover,85)] ${CORNER[position]} transition-opacity duration-200 ${
				visible ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
			} ${className}`}
		>
			<FloatingActionButton
				variant="secondary"
				size={size}
				shape={showProgress ? 'circle' : shape}
				aria-label={label}
				tooltip={label}
				tooltipPlacement="left"
				tabIndex={visible ? 0 : -1}
				onClick={goTop}
				className={
					showProgress ? 'relative !border-transparent hover:[&_circle:first-child]:stroke-app-text' : 'relative'
				}
			>
				{showProgress && <ProgressRing progress={progress} />}
				{children ?? <ChevronUpIcon className="h-5 w-5" />}
			</FloatingActionButton>
		</div>
	)
}

export default BackToTop
