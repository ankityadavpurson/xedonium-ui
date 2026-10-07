import {
	cloneElement,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type ElementType,
	type FocusEvent,
	type MouseEvent,
	type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import { computePosition } from '../utils/position'
import portalTarget from '../utils/portalTarget'
import type { Placement } from '../types'

export interface TooltipProps {
	text?: string
	children: ReactElement<{ 'aria-label'?: string; 'aria-describedby'?: string }>
	placement?: Placement
	/** Wrapper element; use `g` to put a tooltip on SVG shapes. */
	as?: ElementType
	/** Place the tooltip at the mouse instead of beside the trigger. */
	followPointer?: boolean
	/** Styles the wrapper. */
	className?: string
}

const GAP = 6 // px between trigger and tooltip

// Replaces the native `title` attribute. Shows `text` next to the child on hover or keyboard focus
// (:focus-visible, so focus restored after a mouse-closed dialog doesn't reopen it).
// Rendered into <body> with fixed positioning so dialogs and scroll containers can't clip it;
// `placement` is top | bottom | left | right | auto (default bottom), optionally with -start / -end; the tooltip
// flips to the opposite side when there is no room and always stays inside the viewport.
// Hover is tracked on the wrapper, so it also works for disabled buttons.
// `className` styles the wrapper (e.g. to position it where the bare button used to sit).
// `as` changes the wrapper element: use `as="g"` to put a tooltip on SVG shapes (a span is not valid inside <svg>).
// `followPointer` places the tooltip at the mouse instead of beside the trigger, for big shapes such as pie slices.
const Tooltip = ({
	text,
	children,
	placement = 'bottom',
	as: Wrapper = 'span',
	followPointer = false,
	className = '',
}: TooltipProps) => {
	const id = useId()
	const triggerRef = useRef<Element>(null)
	const tipRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
	const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)

	const show = () => setOpen(true)
	const hide = () => {
		setOpen(false)
		setPosition(null)
	}

	useLayoutEffect(() => {
		if (!open || !triggerRef.current || !tipRef.current) return
		const trigger =
			followPointer && pointer
				? ({
						left: pointer.x,
						top: pointer.y,
						right: pointer.x,
						bottom: pointer.y,
						width: 0,
						height: 0,
					} as DOMRect)
				: triggerRef.current.getBoundingClientRect()
		const tip = tipRef.current.getBoundingClientRect()
		const { top, left } = computePosition(trigger, tip, { placement, gap: GAP })
		setPosition({ top, left })
	}, [open, text, placement, followPointer, pointer])

	// Dismissible (Escape) and never left floating after the page moves
	useEffect(() => {
		if (!open) return undefined
		const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && hide()
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('scroll', hide, true)
		window.addEventListener('resize', hide)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
			window.removeEventListener('scroll', hide, true)
			window.removeEventListener('resize', hide)
		}
	}, [open])

	if (!text) return children

	// Icon buttons already carry the same text as aria-label; don't make screen readers say it twice
	// (an SVG wrapper cannot hold the hidden description either, so only the default span does it)
	const describe = Wrapper === 'span' && children.props['aria-label'] !== text

	const track = (event: MouseEvent) => followPointer && setPointer({ x: event.clientX, y: event.clientY })

	return (
		<Wrapper
			ref={triggerRef}
			// A disabled child ignores the pointer so hover always lands on the wrapper (some browsers
			// don't fire mouse events for disabled elements); the wrapper keeps the not-allowed cursor
			className={
				Wrapper === 'span'
					? `inline-flex [&>:disabled]:pointer-events-none has-[>:disabled]:cursor-not-allowed ${className}`
					: className || undefined
			}
			onMouseEnter={(event: MouseEvent) => {
				track(event)
				show()
			}}
			onMouseMove={followPointer ? track : undefined}
			onMouseLeave={hide}
			onFocus={(event: FocusEvent) => (event.target as Element).matches(':focus-visible') && show()}
			onBlur={hide}
			onPointerDown={hide}
		>
			{describe ? cloneElement(children, { 'aria-describedby': id }) : children}
			{describe && (
				<span id={id} hidden>
					{text}
				</span>
			)}
			{open &&
				createPortal(
					<div
						ref={tipRef}
						aria-hidden="true"
						style={{ top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? 'visible' : 'hidden' }}
						className="pointer-events-none fixed z-[var(--xd-z-tooltip,100)] w-max max-w-[16rem] border border-app-border bg-app-card px-2.5 py-1.5 text-xs normal-case tracking-normal text-app-text shadow-xl"
					>
						{text}
					</div>,
					portalTarget()
				)}
		</Wrapper>
	)
}

export default Tooltip
