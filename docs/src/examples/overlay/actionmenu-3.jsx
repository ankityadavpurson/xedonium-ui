import { ActionMenu } from 'xedonium'

export default function Demo() {
	return (
		<ActionMenu
			label="Lair actions"
			trigger="Grouped"
			items={[
				{ key: 'page', heading: 'Minions' },
				{ key: 'add', label: 'Add Minion', onClick: () => {} },
				{ key: 'edit', label: 'Edit Minion', onClick: () => {} },
				{ key: 'account', heading: 'Gru' },
				{ key: 'sign-out', label: 'Leave the lair', onClick: () => {} },
			]}
		/>
	)
}
