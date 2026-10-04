import { createPortal } from 'react-dom'

/** Renders children into `container` (default document.body), escaping ancestors that clip or transform. */
const Portal = ({ children, container }) => createPortal(children, container ?? document.body)

export default Portal
