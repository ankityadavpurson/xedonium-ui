import { createPortal } from 'react-dom'
import portalTarget from '../utils/portalTarget'

/**
 * Renders children into `container` (default <body>, or the fullscreen element while something is fullscreen),
 * escaping ancestors that clip or transform.
 */
const Portal = ({ children, container }) => createPortal(children, container ?? portalTarget())

export default Portal
