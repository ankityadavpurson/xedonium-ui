import { useRef } from 'react'
import { BodyText, ScrollProgress } from 'xedonium'

// The bar along the top: it fills as the panel is scrolled. On a page, leave out `target` and `fixed`: it then sticks
// to the top of the window.
export default function Demo() {
	const panel = useRef(null)

	return (
		<div className="relative border border-app-border">
			<ScrollProgress target={panel} fixed={false} />
			<div ref={panel} className="h-64 overflow-y-auto p-4 pt-5">
				{Array.from({ length: 14 }, (_, i) => (
					<BodyText key={i} className="mb-3">
						Paragraph {i + 1}. Scroll down and watch the bar at the top of the box.
					</BodyText>
				))}
			</div>
		</div>
	)
}
