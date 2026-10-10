import { useRef } from 'react'
import { BodyText, ScrollProgress } from 'xedonium'

// The button variant: a back-to-top button whose ring fills as you read. The bar is `edge="bottom"` here and thicker.
export default function Demo() {
	const panel = useRef(null)

	return (
		<div className="relative border border-app-border">
			<div ref={panel} className="h-64 overflow-y-auto p-4">
				{Array.from({ length: 14 }, (_, i) => (
					<BodyText key={i} className="mb-3">
						Paragraph {i + 1}. The ring around the button shows how far down you are.
					</BodyText>
				))}
			</div>
			<ScrollProgress variant="button" target={panel} fixed={false} threshold={60} />
			<ScrollProgress target={panel} fixed={false} edge="bottom" thickness={6} />
		</div>
	)
}
