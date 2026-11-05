import { Chip } from 'xedonium'

// `tone` colours a chip and `filled` makes it solid: use a Chip for status labels
export default function Demo() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap gap-2">
				<Chip>Minion</Chip>
				<Chip tone="success">Happy</Chip>
				<Chip tone="warning">Hungry</Chip>
				<Chip tone="danger">Caught</Chip>
				<Chip tone="info">Bello</Chip>
			</div>
			<div className="flex flex-wrap gap-2">
				<Chip tone="success" filled>
					Happy
				</Chip>
				<Chip tone="warning" filled>
					Hungry
				</Chip>
				<Chip tone="danger" filled>
					Caught
				</Chip>
				<Chip tone="info" filled>
					Bello
				</Chip>
			</div>
		</div>
	)
}
