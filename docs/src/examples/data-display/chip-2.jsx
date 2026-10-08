import { Chip } from 'xedonium'

// `tone` colours a chip and `filled` makes it solid: use a Chip for status labels
export default function Demo() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap gap-2">
				<Chip>Default</Chip>
				<Chip tone="success">Active</Chip>
				<Chip tone="warning">Pending</Chip>
				<Chip tone="danger">Failed</Chip>
				<Chip tone="info">Info</Chip>
			</div>
			<div className="flex flex-wrap gap-2">
				<Chip tone="success" filled>
					Active
				</Chip>
				<Chip tone="warning" filled>
					Pending
				</Chip>
				<Chip tone="danger" filled>
					Failed
				</Chip>
				<Chip tone="info" filled>
					Info
				</Chip>
			</div>
		</div>
	)
}
