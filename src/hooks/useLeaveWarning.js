import { useEffect } from 'react'

// While `when` is true, closing/reloading the tab shows the browser's "Leave site?" prompt.
// Browsers ignore custom text and show their own generic message.
const useLeaveWarning = when => {
	useEffect(() => {
		if (!when) return undefined

		const handleBeforeUnload = event => {
			event.preventDefault()
			event.returnValue = '' // required by Chrome/Edge to show the prompt
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [when])
}

export default useLeaveWarning
