import { Children, useEffect, useState } from 'react'

const arrow =
	'absolute top-1/2 z-10 -translate-y-1/2 border border-app-border bg-app-card/90 px-2 py-2 text-app-text transition hover:border-app-strong disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Slide carousel; each child is one slide. Controlled with `index` + `onIndexChange`, or uncontrolled via
 * `defaultIndex`. `autoPlay` (ms) advances automatically and pauses on hover / focus. `loop` wraps around.
 */
const Carousel = ({ children, index, defaultIndex = 0, onIndexChange, autoPlay = 0, loop = true, label = 'Carousel', className = '' }) => {
	const slides = Children.toArray(children)
	const [inner, setInner] = useState(defaultIndex)
	const [paused, setPaused] = useState(false)
	const current = index ?? inner

	const go = next => {
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
			className={`relative ${className}`}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
			onKeyDown={event => {
				if (event.key === 'ArrowLeft') go(current - 1)
				else if (event.key === 'ArrowRight') go(current + 1)
			}}
		>
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
					<button type="button" aria-label="Previous slide" className={`${arrow} left-2`} disabled={!loop && current === 0} onClick={() => go(current - 1)}>
						&lsaquo;
					</button>
					<button
						type="button"
						aria-label="Next slide"
						className={`${arrow} right-2`}
						disabled={!loop && current === slides.length - 1}
						onClick={() => go(current + 1)}
					>
						&rsaquo;
					</button>
					<div className="mt-2 flex justify-center gap-1.5">
						{slides.map((_, i) => (
							<button
								key={i}
								type="button"
								aria-label={`Go to slide ${i + 1}`}
								aria-current={i === current}
								onClick={() => go(i)}
								className={`h-2 w-2 border border-app-strong transition ${i === current ? 'bg-app-strong' : 'bg-transparent'}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default Carousel
