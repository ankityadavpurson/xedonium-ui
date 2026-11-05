import { Menu } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-start gap-3">
			<Menu
				label="Grouped"
				trigger="Default look"
				items={[
					{ key: 'page', heading: 'Minions' },
					{ key: 'add', label: 'Add Minion', onClick: () => {} },
					{ key: 'edit', label: 'Edit Minion', onClick: () => {} },
					{ key: 'd', divider: true },
					{ key: 'account', heading: 'Gru' },
					{ key: 'sign-out', label: 'Leave the lair', onClick: () => {} },
				]}
			/>
			<Menu
				label="Grouped"
				trigger="look=actions"
				look="actions"
				items={[
					{ key: 'page', heading: 'Minions' },
					{ key: 'add', label: 'Add Minion', onClick: () => {} },
					{ key: 'account', heading: 'Gru' },
					{ key: 'sign-out', label: 'Leave the lair', onClick: () => {} },
				]}
			/>
		</div>
	)
}
