import { useEffect, useRef } from 'react'

// Calls onDismiss on outside mousedown or Escape while `open`; `rootRef` is the element that counts as "inside"
const useDismissable = (open, rootRef, onDismiss) => {
	const dismissRef = useRef(onDismiss)
	useEffect(() => {
		dismissRef.current = onDismiss
	})

	useEffect(() => {
		if (!open) return undefined
		const onPointerDown = event => {
			if (!rootRef.current?.contains(event.target)) dismissRef.current('outside')
		}
		const onKeyDown = event => {
			if (event.key === 'Escape') dismissRef.current('escape')
		}
		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open, rootRef])
}

export default useDismissable
