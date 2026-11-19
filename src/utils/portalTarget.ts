import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import useClientValue from './useClientValue'

// Where floating UI (menus, tooltips) is rendered. In fullscreen only the fullscreen element and its children are
// visible, so portal into it; otherwise use <body>. (iOS fullscreens the <video> itself, which cannot hold children.)
const portalTarget = (): HTMLElement => {
	const element =
		document.fullscreenElement ??
		(document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement
	return element && element.tagName !== 'VIDEO' ? (element as HTMLElement) : document.body
}

/**
 * Whether a portal can be rendered yet: `false` on a server and while the browser hydrates server markup, then `true`.
 * An overlay that portals during hydration would not match the server's HTML (which has nothing there), so, like the
 * portals of other UI libraries, it appears right after hydration instead. Without server rendering it is `true` from
 * the first render, so nothing is delayed.
 */
export const usePortalReady = () => useClientValue(() => true, false)

/** `createPortal` once `ready` (from `usePortalReady`), nothing before; `target` is a function so `document` is only read in the browser. */
export const portal = (children: ReactNode, ready: boolean, target: () => Element | DocumentFragment = portalTarget) =>
	ready ? createPortal(children, target()) : null

export default portalTarget
