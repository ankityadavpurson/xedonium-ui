import { AppBar } from 'xedonium'

export default function Demo() {
	return (
		<AppBar
			brand="Xedonium"
			links={[
				{ href: '#', label: 'Apps', active: true },
				{ href: '#admin', label: 'Admin' },
			]}
		/>
	)
}
