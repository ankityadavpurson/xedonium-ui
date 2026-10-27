import { Table } from 'xedonium'

export default function Demo() {
	return (
		<Table
			compact
			columns={[
				{ key: 'name', header: 'Name' },
				{ key: 'role', header: 'Role' },
				{ key: 'seats', header: 'Seats', align: 'right' },
			]}
			rows={[
				{ id: 1, name: 'Ada', role: 'Admin', seats: 3 },
				{ id: 2, name: 'Linus', role: 'Editor', seats: 12 },
				{ id: 3, name: 'Grace', role: 'Viewer', seats: 1 },
			]}
		/>
	)
}
