import { useCallback, useEffect, useRef, useState } from 'react'

// showToast(msg, type, { link: { href, label }, duration })
const useTimedToast = (duration = 3000) => {
	const [toast, setToast] = useState(null)
	const timeoutRef = useRef(null)

	useEffect(() => () => clearTimeout(timeoutRef.current), [])

	const showToast = useCallback(
		(msg, type = 'success', { link, duration: ms = duration } = {}) => {
			clearTimeout(timeoutRef.current)
			setToast({ msg, type, link })
			timeoutRef.current = setTimeout(() => setToast(null), ms)
		},
		[duration]
	)

	return { toast, showToast }
}

export default useTimedToast
