import { Breadcrumb } from 'xedonium'

export default function Demo() {
	return <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Xedonium' }]} />
}
