import { Menu } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-start gap-3">
			<Menu
				label="Grouped"
				trigger="Default look"
				items={[
					{ key: 'page', heading: 'Page' },
					{ key: 'add', label: 'Add site', onClick: () => {} },
					{ key: 'edit', label: 'Edit page', onClick: () => {} },
					{ key: 'd', divider: true },
					{ key: 'account', heading: 'Account' },
					{ key: 'sign-out', label: 'Sign out', onClick: () => {} },
				]}
			/>
			<Menu
				label="Grouped"
				trigger="look=actions"
				look="actions"
				items={[
					{ key: 'page', heading: 'Page' },
					{ key: 'add', label: 'Add site', onClick: () => {} },
					{ key: 'account', heading: 'Account' },
					{ key: 'sign-out', label: 'Sign out', onClick: () => {} },
				]}
			/>
		</div>
	)
}
