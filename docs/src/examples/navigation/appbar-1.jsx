import { AppBar } from 'xedonium'

export default function Demo() {
	return (
		<AppBar
			brand="Minion HQ"
			links={[
				{ href: '#', label: 'Missions', active: true },
				{ href: '#admin', label: 'Gadgets' },
			]}
		/>
	)
}
