import { useRef } from 'react'
import { BodyText, useScrollProgress } from 'xedonium'

// How far a panel has been scrolled. Leave out the argument to measure the page instead.
export default function Demo() {
	const panel = useRef(null)
	const { progress, scrollTop, scrollable } = useScrollProgress(panel)

	return (
		<div className="flex flex-col gap-3">
			<p className="m-0 text-sm text-app-text">
				{scrollable
					? `${Math.round(progress * 100)}% read (${Math.round(scrollTop)}px from the top)`
					: 'Nothing to scroll'}
			</p>
			<div ref={panel} className="h-40 overflow-y-auto border border-app-border p-4">
				{Array.from({ length: 12 }, (_, i) => (
					<BodyText key={i} className="mb-3">
						Paragraph {i + 1}. Scroll this box.
					</BodyText>
				))}
			</div>
		</div>
	)
}
