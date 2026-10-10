import { useEffect, useState, type RefObject } from 'react'

/** What to measure: the page (the default), an element, or a ref to one (such as a scrolling panel). */
export type ScrollTarget = HTMLElement | RefObject<HTMLElement | null> | null | undefined

export interface ScrollProgressState {
	/** How far the target has scrolled, from `0` (top) to `1` (the end). `0` when there is nothing to scroll. */
	progress: number
	/** Pixels scrolled from the top. */
	scrollTop: number
	/** The target is taller than its view, so it can scroll at all. */
	scrollable: boolean
}

const EMPTY: ScrollProgressState = { progress: 0, scrollTop: 0, scrollable: false }

const resolve = (target: ScrollTarget): HTMLElement | null => {
	if (!target) return null
	return 'current' in target ? target.current : target
}

const measure = (element: HTMLElement | null): ScrollProgressState => {
	if (typeof window === 'undefined') return EMPTY
	const scroller = element ?? document.documentElement
	const scrollTop = Math.max(0, element ? element.scrollTop : window.scrollY || document.documentElement.scrollTop)
	const max = scroller.scrollHeight - scroller.clientHeight
	if (max <= 0) return { progress: 0, scrollTop, scrollable: false }
	// within a pixel of the end counts as the end: scroll positions can be fractional
	return { progress: max - scrollTop < 1 ? 1 : scrollTop / max, scrollTop, scrollable: true }
}

const same = (a: ScrollProgressState, b: ScrollProgressState) =>
	a.scrollTop === b.scrollTop && a.scrollable === b.scrollable && Math.abs(a.progress - b.progress) < 0.001

/**
 * How far the page, or one scrolling element (`target`), has been scrolled. It updates while scrolling and when the
 * size changes, and only re-renders when the numbers really change. A ref passed as `target` is read after the first
 * render, so it can point at an element rendered by the same component.
 */
const useScrollProgress = (target?: ScrollTarget): ScrollProgressState => {
	const [state, setState] = useState(EMPTY)

	useEffect(() => {
		const element = resolve(target)
		const source: HTMLElement | Window = element ?? window
		const update = () => setState(previous => (same(previous, measure(element)) ? previous : measure(element)))
		update()
		source.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
		observer?.observe(element ?? document.documentElement)
		return () => {
			source.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
			observer?.disconnect()
		}
	}, [target])

	return state
}

export default useScrollProgress
