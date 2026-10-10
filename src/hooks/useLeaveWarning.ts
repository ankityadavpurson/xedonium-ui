import { useEffect, useRef } from 'react'

export interface UseLeaveWarningOptions {
	/**
	 * Also ask before the browser back button leaves the page (default `false`). Browsers do not let a page cancel the
	 * back button, so the hook keeps one extra history entry while `when` is true and puts it back each time the reader
	 * chooses to stay. With a router, prefer the router's own blocker: this changes the history the router also reads.
	 */
	backButton?: boolean
	/** Question shown by the browser's confirm box when the back button is pressed (ignored when `onBack` is given). */
	message?: string
	/**
	 * Ask in your own dialog instead of the confirm box. The reader stays on the page; call `leave()` to go back after
	 * all, for example from the dialog's "Discard and leave" button.
	 */
	onBack?: (leave: () => void) => void
}

const GUARD = '__xedoniumLeaveGuard'
const DEFAULT_MESSAGE = 'Leave this page? Changes you made may not be saved.'

/**
 * While `when` is true, closing or reloading the tab shows the browser's "Leave site?" prompt. Browsers ignore custom
 * text there and show their own message. With `backButton`, the back button asks too. Links inside your app are not
 * intercepted: see `useUnsavedChanges` for that.
 */
const useLeaveWarning = (
	when: boolean,
	{ backButton = false, message = DEFAULT_MESSAGE, onBack }: UseLeaveWarningOptions = {}
) => {
	const ask = useRef({ message, onBack })
	ask.current = { message, onBack }

	useEffect(() => {
		if (!when) return undefined

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault()
			event.returnValue = '' // required by Chrome/Edge to show the prompt
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [when])

	useEffect(() => {
		if (!when || !backButton) return undefined
		let active = true
		const guard = () =>
			window.history.pushState({ ...(window.history.state ?? {}), [GUARD]: true }, '', window.location.href)

		// Going back from the guard entry lands on the page's own entry: put the guard straight back, then ask
		const leave = () => {
			if (!active) return
			active = false
			window.removeEventListener('popstate', handlePop)
			window.history.go(-2) // past the guard and the page's own entry
		}
		function handlePop() {
			if (!active) return
			guard()
			const { message: text, onBack: custom } = ask.current
			if (custom) custom(leave)
			else if (window.confirm(text)) leave()
		}

		guard()
		window.addEventListener('popstate', handlePop)
		return () => {
			window.removeEventListener('popstate', handlePop)
			// take the extra entry away again, unless the reader is already on their way out
			if (active && window.history.state?.[GUARD]) window.history.back()
			active = false
		}
	}, [when, backButton])
}

export default useLeaveWarning
