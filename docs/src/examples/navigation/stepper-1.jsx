import { Stepper } from 'xedonium'

export default function Demo() {
	return (
		<Stepper
			current={1}
			steps={[
				{ label: 'Recruit', description: 'Pick a Minion' },
				{ label: 'Gear up', description: 'Goggles and overalls' },
				{ label: 'Mission ready' },
			]}
		/>
	)
}
