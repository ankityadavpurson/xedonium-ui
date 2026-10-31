import { ActionMenu } from 'xedonium'

export default function Demo() {
	return (
		<ActionMenu
			label="Site actions"
			trigger="Grouped"
			items={[
				{ key: 'page', heading: 'Page' },
				{ key: 'add', label: 'Add site', onClick: () => {} },
				{ key: 'edit', label: 'Edit page', onClick: () => {} },
				{ key: 'account', heading: 'Account' },
				{ key: 'sign-out', label: 'Sign out', onClick: () => {} },
			]}
		/>
	)
}
