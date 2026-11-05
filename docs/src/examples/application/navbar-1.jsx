import { Button, Navbar } from 'xedonium'

export default function Demo() {
	return (
		<Navbar
			brand="Minion HQ"
			links={[
				{ href: '#', label: 'Lair', active: true },
				{ href: '#docs', label: 'Missions' },
			]}
			actions={<Button variant="secondary">Sign in</Button>}
		/>
	)
}
