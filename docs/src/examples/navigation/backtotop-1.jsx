import { useRef } from 'react'
import { BackToTop, BodyText } from 'xedonium'

// A scrolling panel: scroll it down and the button appears. For a whole page leave out `target` and `fixed`.
// The button sits next to the scrolling element (in a `relative` wrapper), not inside it.
export default function Demo() {
	const panel = useRef(null)

	return (
		<div className="relative border border-app-border">
			<div ref={panel} className="h-64 overflow-y-auto p-4">
				{Array.from({ length: 14 }, (_, i) => (
					<BodyText key={i} className="mb-3">
						Paragraph {i + 1}. Keep scrolling: the button shows up after the first screen and takes you back to the top
						with a smooth scroll.
					</BodyText>
				))}
			</div>
			<BackToTop target={panel} fixed={false} threshold={120} />
		</div>
	)
}
