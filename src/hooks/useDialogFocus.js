import { useEffect } from 'react'

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Moves focus into an open dialog, keeps Tab inside it, and restores focus to the opener on close
const useDialogFocus = (open, containerRef) => {
	useEffect(() => {
		const container = containerRef.current
		if (!open || !container) return undefined

		const opener = document.activeElement
		const focusables = () => [...container.querySelectorAll(FOCUSABLE)]
		;(container.querySelector('[data-autofocus]') || focusables()[0] || container).focus()

		const handleKeyDown = event => {
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
	}, [open, containerRef])
}

export default useDialogFocus
