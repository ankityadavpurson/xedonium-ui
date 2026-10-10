import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseUnsavedChangesOptions {
	/** `true` while the form holds changes that have not been saved or submitted. */
	when: boolean
	/**
	 * Also catch clicks on links to other pages of your app, so you can ask first with your own dialog (default `true`).
	 * Set it to `false` to only use the browser's "Leave site?" prompt for closing or reloading the tab.
	 */
	links?: boolean
}

export interface UnsavedChanges {
	/** A link click was held back and is waiting for an answer: show your "Discard changes?" dialog while this is true. */
	blocked: boolean
	/** The reader chose to leave: goes on to the link that was clicked, without asking again. */
	proceed: () => void
	/** The reader chose to stay: drops the held-back click. */
	stay: () => void
}

const isModifiedClick = (event: MouseEvent) =>
	event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

/** The same-site link that a click would follow to another page, if any. */
const pageLink = (event: MouseEvent): HTMLAnchorElement | null => {
	const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
	if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return null
	if (link.origin !== window.location.origin) return null
	// A link to a place on this very page (or an empty or hash-only one) is not leaving it
	if (link.pathname === window.location.pathname && link.search === window.location.search) return null
	return link
}

/**
 * Protects a form with unsaved changes. While `when` is true:
 * - closing, reloading or leaving the tab shows the browser's own "Leave site?" prompt (browsers do not allow
 *   custom text there), and
 * - a click on a link to another page of your app is held back (`blocked`), so you can show your own dialog and
 *   call `proceed()` or `stay()`. It works with plain links and router links alike.
 *
 * It does not see navigation that is not a link click (the back button, `navigate()` in code): use your router's
 * own blocker for those. Set `when` back to `false` as soon as the form is saved.
 */
const useUnsavedChanges = ({ when, links = true }: UseUnsavedChangesOptions): UnsavedChanges => {
	const [link, setLink] = useState<HTMLAnchorElement | null>(null)
	const allowed = useRef(false)

	// A new "unsaved" period starts with nothing held back and nothing allowed yet
	useEffect(() => {
		allowed.current = false
		setLink(null)
	}, [when])

	useEffect(() => {
		if (!when || typeof window === 'undefined') return undefined
		const beforeUnload = (event: BeforeUnloadEvent) => {
			if (allowed.current) return
			event.preventDefault()
			event.returnValue = '' // required by Chrome and Edge to show the prompt
		}
		window.addEventListener('beforeunload', beforeUnload)
		return () => window.removeEventListener('beforeunload', beforeUnload)
	}, [when])

	useEffect(() => {
		if (!when || !links || typeof document === 'undefined') return undefined
		const onClick = (event: MouseEvent) => {
			if (allowed.current || event.defaultPrevented || isModifiedClick(event)) return
			const target = pageLink(event)
			if (!target) return
			// capture phase: ahead of the link's own handler, so a router link never sees this click
			event.preventDefault()
			event.stopPropagation()
			setLink(target)
		}
		document.addEventListener('click', onClick, true)
		return () => document.removeEventListener('click', onClick, true)
	}, [when, links])

	const proceed = useCallback(() => {
		if (!link) return
		allowed.current = true
		setLink(null)
		link.click()
	}, [link])

	const stay = useCallback(() => setLink(null), [])

	return { blocked: link !== null, proceed, stay }
}

export default useUnsavedChanges
