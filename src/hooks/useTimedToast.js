import { useCallback, useEffect, useRef, useState } from 'react'

// showToast(msg, type, { link: { href, label }, actions: [{ label, onClick }], icon, duration }) returns the toast's id.
// type: success | danger (or error) | warning | info. `duration: 0` keeps the toast until hideToast(id).
// Several toasts can be on screen at once (`toasts`, oldest first); beyond `max` the oldest is dropped.
// `toast` is the newest one (or null) for the single-toast `<Toast toast={toast} />` usage.
// hideToast(id) removes one toast; hideToast() removes them all.
const useTimedToast = (duration = 3000, { max = 5 } = {}) => {
	const [toasts, setToasts] = useState([])
	const timers = useRef(new Map())
	const nextId = useRef(1)

	const forget = id => {
		clearTimeout(timers.current.get(id))
		timers.current.delete(id)
	}

	useEffect(() => {
		const active = timers.current
		return () => active.forEach(timer => clearTimeout(timer))
	}, [])

	const hideToast = useCallback(id => {
		if (id === undefined) {
			timers.current.forEach(timer => clearTimeout(timer))
			timers.current.clear()
			setToasts([])
			return
		}
		forget(id)
		setToasts(current => current.filter(t => t.id !== id))
	}, [])

	const showToast = useCallback(
		(msg, type = 'success', { link, actions, icon, duration: ms = duration } = {}) => {
			const id = nextId.current++
			setToasts(current => {
				const next = [...current, { id, msg, type, link, actions, icon }]
				next.slice(0, Math.max(0, next.length - max)).forEach(dropped => forget(dropped.id))
				return next.slice(-max)
			})
			if (ms > 0)
				timers.current.set(
					id,
					setTimeout(() => hideToast(id), ms)
				)
			return id
		},
		[duration, max, hideToast]
	)

	return { toast: toasts[toasts.length - 1] ?? null, toasts, showToast, hideToast }
}

export default useTimedToast
