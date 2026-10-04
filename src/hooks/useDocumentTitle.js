import { useEffect } from 'react'

// Sets `document.title` to "<title> · <suffix>" (or just the suffix when there is no title)
const useDocumentTitle = (title, suffix = '') => {
	useEffect(() => {
		document.title = [title, suffix].filter(Boolean).join(' · ')
	}, [title, suffix])
}

export default useDocumentTitle
