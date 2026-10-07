import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import portalTarget from '../utils/portalTarget'

/**
 * Renders children into `container` (default <body>, or the fullscreen element while something is fullscreen),
 * escaping ancestors that clip or transform.
 */
export interface PortalProps {
	children?: ReactNode
	/** Where to render; defaults to `<body>` (or the fullscreen element). */
	container?: Element | DocumentFragment | null
}

const Portal = ({ children, container }: PortalProps) => createPortal(children, container ?? portalTarget())

export default Portal
