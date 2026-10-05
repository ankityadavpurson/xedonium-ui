import { Button, Tooltip } from 'xedonium'

const PLACEMENTS = ['top', 'right', 'bottom', 'left', 'auto']

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4 py-10">
			{PLACEMENTS.map(placement => (
				<Tooltip key={placement} text={`Tooltip on ${placement}`} placement={placement}>
					<span className="border border-app-border bg-app-card px-3 py-2 text-xs capitalize">{placement}</span>
				</Tooltip>
			))}
			<Button variant="secondary" tooltip="Top, aligned to the start" tooltipPlacement="top-start">
				top-start
			</Button>
		</div>
	)
}
