import { Breadcrumb } from 'xedonium'

export default function Demo() {
	return (
		<Breadcrumb items={[{ label: 'Lair', href: '#' }, { label: 'Missions', href: '#' }, { label: 'Moon heist' }]} />
	)
}
