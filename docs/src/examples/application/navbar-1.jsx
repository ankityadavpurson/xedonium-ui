import { Button, Navbar } from 'xedonium'

export default function Demo() {
	return (
		<Navbar
			brand="Acme"
			links={[
				{ href: '#', label: 'Home', active: true },
				{ href: '#docs', label: 'Docs' },
			]}
			actions={<Button variant="secondary">Sign in</Button>}
		/>
	)
}
