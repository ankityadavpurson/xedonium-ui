import { useEffect, useRef, type RefObject } from 'react'

export type DismissReason = 'outside' | 'escape'

// Calls onDismiss('outside' | 'escape') on an outside mousedown or Escape while `open`.
// `insideRefs` is the ref (or array of refs, e.g. trigger wrapper + portalled panel) that counts as "inside".
const useDismissable = (
	open: boolean,
	insideRefs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
	onDismiss: (reason: DismissReason) => void
) => {
	const dismissRef = useRef(onDismiss)
	useEffect(() => {
		dismissRef.current = onDismiss
	})

	useEffect(() => {
		if (!open) return undefined
		const refs = Array.isArray(insideRefs) ? insideRefs : [insideRefs]
		const onPointerDown = (event: MouseEvent) => {
			if (!refs.some(ref => ref.current?.contains(event.target as Node))) dismissRef.current('outside')
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') dismissRef.current('escape')
		}
		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
		// insideRefs is a stable set of refs; an inline array literal must not retrigger the effect
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])
}

export default useDismissable
