import { useRef } from 'react'
import useDialogFocus from '../hooks/useDialogFocus'

/**
 * Keeps Tab focus inside while `active`, focuses the first control (or `[data-autofocus]`) on activation and
 * restores focus to the previous element on deactivation.
 */
const FocusTrap = ({ active = true, className = '', children, ...rest }) => {
	const ref = useRef(null)
	useDialogFocus(active, ref)
	return (
		<div ref={ref} tabIndex={-1} className={className} {...rest}>
			{children}
		</div>
	)
}

export default FocusTrap
