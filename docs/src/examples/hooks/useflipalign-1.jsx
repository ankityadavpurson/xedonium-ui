import { useEffect, useRef, useState } from 'react'
import { Button, useFlipAlign } from 'xedonium'

// The panel prefers to start at the trigger's left edge. When that would run it off the screen the hook answers "end"
// and it lines up with the trigger's right edge instead. The trigger sits at the right of this box, so on a narrow
// window it flips; on a very wide one there is room and it stays "start".
// (The panel is `fixed`, placed from the trigger, so the demo box does not cut it off; it closes when the page moves.)
export default function Demo() {
	const [anchor, setAnchor] = useState(null)
	const panelRef = useRef(null)
	const side = useFlipAlign(anchor !== null, panelRef, 'start')

	useEffect(() => {
		if (!anchor) return undefined
		const close = () => setAnchor(null)
		window.addEventListener('scroll', close, true)
		window.addEventListener('resize', close)
		return () => {
			window.removeEventListener('scroll', close, true)
			window.removeEventListener('resize', close)
		}
	}, [anchor])

	const toggle = event => {
		if (anchor) return setAnchor(null)
		const { left, right, bottom } = event.currentTarget.getBoundingClientRect()
		setAnchor({ left, right, bottom })
	}

	return (
		<div className="flex justify-end pb-4">
			<Button variant="secondary" aria-expanded={anchor !== null} onClick={toggle}>
				{anchor ? 'Close' : 'Open'} panel
			</Button>
			{anchor && (
				<div
					ref={panelRef}
					className="fixed z-10 w-56 border border-app-border bg-app-card p-3 text-sm text-app-text shadow-xl"
					style={{
						top: anchor.bottom + 4,
						...(side === 'end'
							? { right: document.documentElement.clientWidth - anchor.right }
							: { left: anchor.left }),
					}}
				>
					Preferred side: <strong>start</strong>. Used: <strong>{side}</strong>.
				</div>
			)}
		</div>
	)
}
