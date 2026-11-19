import type { ReactNode } from 'react'
import { portal, usePortalReady } from '../utils/portalTarget'

/**
 * Renders children into `container` (default <body>, or the fullscreen element while something is fullscreen),
 * escaping ancestors that clip or transform.
 */
export interface PortalProps {
	children?: ReactNode
	/** Where to render; defaults to `<body>` (or the fullscreen element). */
	container?: Element | DocumentFragment | null
}

// Renders nothing on a server and while hydrating (see `usePortalReady`), so a Portal can sit in a server-rendered tree
const Portal = ({ children, container }: PortalProps) => {
	const ready = usePortalReady()
	return portal(children, ready, container ? () => container : undefined)
}

export default Portal
