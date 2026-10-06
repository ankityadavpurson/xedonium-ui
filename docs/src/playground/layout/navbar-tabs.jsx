import { Button, Navbar, Tabs } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-col gap-4">
			<Navbar
				brand="Brand"
				links={[
					{ href: '#', label: 'One', active: true },
					{ href: '#2', label: 'Two' },
				]}
				actions={<Button variant="secondary">Action</Button>}
			/>
			<Tabs
				items={[
					{ key: 'a', label: 'Overview', content: <p className="py-3 text-sm">Overview content</p> },
					{ key: 'b', label: 'Activity', content: <p className="py-3 text-sm">Activity content</p> },
					{ key: 'c', label: 'Disabled', disabled: true },
				]}
			/>
		</div>
	)
}
