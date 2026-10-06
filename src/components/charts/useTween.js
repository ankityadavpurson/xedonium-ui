import { useEffect, useRef, useState } from 'react'

const easeOut = p => 1 - (1 - p) ** 3

const prefersReducedMotion = () =>
	typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Animates an array of numbers: when `targets` change, the returned values glide from where they currently are to the
 * new targets (an interrupted glide continues from its current position, not from the old target). The first render,
 * `enabled={false}`, reduced motion, a different array length and a changed `snapKey` all jump straight to the
 * targets: pass the chart size as `snapKey` so resizing never lags behind.
 */
const useTween = (targets, { enabled = true, snapKey = '', duration = 450 } = {}) => {
	const [values, setValues] = useState(targets)
	const shown = useRef(targets) // what is on screen right now (also while a glide is running)
	const lastSnapKey = useRef(snapKey)
	const frame = useRef(0)
	const key = targets.join(',')

	useEffect(() => {
		cancelAnimationFrame(frame.current)
		const snapped = lastSnapKey.current !== snapKey
		lastSnapKey.current = snapKey
		const from = shown.current
		const jump =
			!enabled ||
			snapped ||
			prefersReducedMotion() ||
			from.length !== targets.length ||
			from.every((value, i) => value === targets[i])
		if (jump) {
			shown.current = targets
			setValues(targets)
			return undefined
		}

		const started = performance.now()
		const step = now => {
			const progress = Math.min(1, (now - started) / duration)
			const eased = easeOut(progress)
			const next = progress === 1 ? targets : targets.map((target, i) => from[i] + (target - from[i]) * eased)
			shown.current = next
			setValues(next)
			if (progress < 1) frame.current = requestAnimationFrame(step)
		}
		frame.current = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frame.current)
		// `key` stands for the contents of `targets`, which is a new array on every render
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key, enabled, snapKey, duration])

	// right after the targets change in length, `values` still has the old length for one render
	return values.length === targets.length ? values : targets
}

export default useTween
