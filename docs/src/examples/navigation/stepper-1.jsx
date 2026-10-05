import { Stepper } from 'xedonium'

export default function Demo() {
	return (
		<Stepper
			current={1}
			steps={[
				{ label: 'Account', description: 'Create login' },
				{ label: 'Profile', description: 'Tell us more' },
				{ label: 'Done' },
			]}
		/>
	)
}
