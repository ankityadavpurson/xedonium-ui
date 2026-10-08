import { Children, useEffect, useState, type ReactNode } from 'react'
import Button from './Button'
import ChevronLeftIcon from './icons/ChevronLeft'
import ChevronRightIcon from './icons/ChevronRight'

export interface CarouselProps {
	/** Each child is one slide. */
	children?: ReactNode
	/** Current slide (controlled). */
	index?: number
	defaultIndex?: number
	onIndexChange?: (index: number) => void
	/** Milliseconds between automatic advances; pauses on hover and focus. */
	autoPlay?: number
	/** Wrap around at the ends (default true). */
	loop?: boolean
	/** Accessible name of the carousel. */
	label?: string
	className?: string
}

// Icon-only arrows, vertically centred on the slides (not on the slides plus the dots below them). The positioning is on
// a wrapper, not on the button: a tooltip adds its own inline wrapper, which would otherwise sit in the normal flow and
// make the area taller than the slides.
const arrowSlot = 'absolute top-1/2 z-10 -translate-y-1/2'
const arrow = 'inline-flex h-9 w-9 items-center justify-center !p-0'

/**
 * Slide carousel; each child is one slide (text, cards, or `Image`s). Controlled with `index` + `onIndexChange`, or
 * uncontrolled via `defaultIndex`. `autoPlay` (ms) advances automatically and pauses on hover / focus. `loop` wraps
 * around. The previous / next buttons are icon buttons with tooltips, centred on the slides; the dots below jump
 * straight to a slide.
 */
const Carousel = ({
	children,
	index,
	defaultIndex = 0,
	onIndexChange,
	autoPlay = 0,
	loop = true,
	label = 'Carousel',
	className = '',
}: CarouselProps) => {
	const slides = Children.toArray(children)
	const [inner, setInner] = useState(defaultIndex)
	const [paused, setPaused] = useState(false)
	const current = index ?? inner

	const go = (next: number) => {
		if (!slides.length) return
		let target = next
		if (loop) target = (next + slides.length) % slides.length
		else target = Math.min(Math.max(next, 0), slides.length - 1)
		if (index === undefined) setInner(target)
		onIndexChange?.(target)
	}

	useEffect(() => {
		if (!autoPlay || paused || slides.length < 2) return undefined
		const id = setTimeout(() => go(current + 1), autoPlay)
		return () => clearTimeout(id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoPlay, paused, current, slides.length])

	return (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label={label}
			className={className}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
			onKeyDown={event => {
				if (event.key === 'ArrowLeft') go(current - 1)
				else if (event.key === 'ArrowRight') go(current + 1)
			}}
		>
			<div className="relative">
				<div className="overflow-hidden border border-app-border bg-app-card">
					<div
						className="flex transition-transform duration-300 ease-out"
						style={{ transform: `translateX(-${current * 100}%)` }}
						aria-live={autoPlay && !paused ? 'off' : 'polite'}
					>
						{slides.map((slide, i) => (
							<div
								key={i}
								role="group"
								aria-roledescription="slide"
								aria-label={`${i + 1} of ${slides.length}`}
								aria-hidden={i !== current}
								ref={el => {
									if (!el) return
									if (i === current) el.removeAttribute('inert')
									else el.setAttribute('inert', '')
								}}
								className="w-full shrink-0"
							>
								{slide}
							</div>
						))}
					</div>
				</div>
				{slides.length > 1 && (
					<>
						<div className={`${arrowSlot} left-2`}>
							<Button
								variant="secondary"
								aria-label="Previous slide"
								tooltip="Previous slide"
								tooltipPlacement="top"
								className={arrow}
								disabled={!loop && current === 0}
								onClick={() => go(current - 1)}
							>
								<ChevronLeftIcon />
							</Button>
						</div>
						<div className={`${arrowSlot} right-2`}>
							<Button
								variant="secondary"
								aria-label="Next slide"
								tooltip="Next slide"
								tooltipPlacement="top"
								className={arrow}
								disabled={!loop && current === slides.length - 1}
								onClick={() => go(current + 1)}
							>
								<ChevronRightIcon />
							</Button>
						</div>
					</>
				)}
			</div>
			{slides.length > 1 && (
				<div className="mt-2 flex justify-center gap-1.5">
					{slides.map((_, i) => (
						<button
							key={i}
							type="button"
							aria-label={`Go to slide ${i + 1}`}
							aria-current={i === current}
							onClick={() => go(i)}
							className="flex h-6 w-6 items-center justify-center"
						>
							<span
								className={`h-2 w-2 border border-app-strong transition ${i === current ? 'bg-app-strong' : 'bg-transparent'}`}
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default Carousel
