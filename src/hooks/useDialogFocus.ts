import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Moves focus into an open dialog, keeps Tab inside it, and restores focus to the opener on close.
// Initial focus goes to `initialFocusRef`, else the element marked `data-autofocus`, else the first focusable one.
const useDialogFocus = (
	open: boolean,
	containerRef: RefObject<HTMLElement | null>,
	initialFocusRef?: RefObject<HTMLElement | null>
) => {
	useEffect(() => {
		const container = containerRef.current
		if (!open || !container) return undefined

		const opener = document.activeElement as HTMLElement | null
		const focusables = () => [...container.querySelectorAll<HTMLElement>(FOCUSABLE)]
		;(
			initialFocusRef?.current ||
			container.querySelector<HTMLElement>('[data-autofocus]') ||
			focusables()[0] ||
			container
		).focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return
			const items = focusables()
			if (!items.length) {
				event.preventDefault()
				return
			}
			const first = items[0]
			const last = items[items.length - 1]
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			}
		}

		container.addEventListener('keydown', handleKeyDown)
		return () => {
			container.removeEventListener('keydown', handleKeyDown)
			if (opener?.isConnected) opener.focus()
		}
	}, [open, containerRef, initialFocusRef])
}

export default useDialogFocus
