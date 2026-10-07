import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type ToastType = 'success' | 'danger' | 'error' | 'warning' | 'info'

export interface ToastAction {
	label: string
	onClick: () => void
}

export interface ToastItem {
	id: number
	msg: ReactNode
	type: ToastType
	link?: { href: string; label: string }
	actions?: ToastAction[]
	icon?: ReactNode
}

export interface ShowToastOptions {
	link?: ToastItem['link']
	actions?: ToastAction[]
	icon?: ReactNode
	/** Milliseconds before it hides; `0` keeps it until `hideToast(id)`. */
	duration?: number
}

// showToast(msg, type, { link: { href, label }, actions: [{ label, onClick }], icon, duration }) returns the toast's id.
// type: success | danger (or error) | warning | info. `duration: 0` keeps the toast until hideToast(id).
// Several toasts can be on screen at once (`toasts`, oldest first); beyond `max` the oldest is dropped.
// `toast` is the newest one (or null) for the single-toast `<Toast toast={toast} />` usage.
// hideToast(id) removes one toast; hideToast() removes them all.
const useTimedToast = (duration = 3000, { max = 5 }: { max?: number } = {}) => {
	const [toasts, setToasts] = useState<ToastItem[]>([])
	const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())
	const nextId = useRef(1)

	const forget = (id: number) => {
		clearTimeout(timers.current.get(id))
		timers.current.delete(id)
	}

	useEffect(() => {
		const active = timers.current
		return () => active.forEach(timer => clearTimeout(timer))
	}, [])

	const hideToast = useCallback((id?: number) => {
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
		(
			msg: ReactNode,
			type: ToastType = 'success',
			{ link, actions, icon, duration: ms = duration }: ShowToastOptions = {}
		) => {
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
