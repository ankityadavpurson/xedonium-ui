import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import useEscapeKey from '../hooks/useEscapeKey'
import portalTarget from '../utils/portalTarget'

export interface BackdropProps extends ComponentPropsWithoutRef<'div'> {
	open: boolean
	/** Called on a click on the dimmed area (not on the children) and on Escape. */
	onClose?: () => void
	/** Keep the layer transparent: it still blocks clicks, but nothing is dimmed. */
	invisible?: boolean
	/** Cover the whole viewport (default); `false` covers only the nearest positioned parent. */
	fullScreen?: boolean
	children?: ReactNode
}

/**
 * A dimmed layer over the page that blocks interaction behind it, with optional `children` centered on it (a Loader
 * while something loads, an image to preview...). It does not trap focus or lock page scroll: for dialogs use Modal.
 * Click the dimmed area or press Escape to close it when `onClose` is given.
 */
const Backdrop = ({
	open,
	onClose,
	invisible = false,
	fullScreen = true,
	className = '',
	children,
	onClick,
	...rest
}: BackdropProps) => {
	useEscapeKey(open && !!onClose, () => onClose?.())

	if (!open) return null

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		onClick?.(event)
		if (event.target === event.currentTarget) onClose?.()
	}

	const layer = (
		<div
			role="presentation"
			onClick={handleClick}
			className={`${fullScreen ? 'fixed' : 'absolute'} inset-0 z-[var(--xd-z-modal,80)] flex items-center justify-center ${
				invisible ? '' : 'bg-black/50 backdrop-blur-[1px]'
			} ${className}`}
			{...rest}
		>
			{children}
		</div>
	)

	return fullScreen ? createPortal(layer, portalTarget()) : layer
}

export default Backdrop
