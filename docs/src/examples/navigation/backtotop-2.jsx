import { useRef } from 'react'
import { BackToTop, BodyText, ChevronsUpIcon } from 'xedonium'

// Corners, shape, size and your own icon.
export default function Demo() {
	const panel = useRef(null)

	return (
		<div className="relative border border-app-border">
			<div ref={panel} className="h-64 overflow-y-auto p-4">
				{Array.from({ length: 14 }, (_, i) => (
					<BodyText key={i} className="mb-3">
						Paragraph {i + 1}. Three buttons below: one in each bottom corner.
					</BodyText>
				))}
			</div>
			<BackToTop target={panel} fixed={false} threshold={80} position="bottom-left" size="sm" />
			<BackToTop
				target={panel}
				fixed={false}
				threshold={80}
				position="bottom-center"
				shape="circle"
				label="Jump to the top"
			>
				<ChevronsUpIcon className="h-5 w-5" />
			</BackToTop>
			<BackToTop target={panel} fixed={false} threshold={80} />
		</div>
	)
}
