import { Table } from 'xedonium'

export default function Demo() {
	return (
		<Table
			compact
			columns={[
				{ key: 'name', header: 'Name' },
				{ key: 'role', header: 'Role' },
				{ key: 'seats', header: 'Bananas', align: 'right' },
			]}
			rows={[
				{ id: 1, name: 'Kevin', role: 'Banana boss', seats: 3 },
				{ id: 2, name: 'Stuart', role: 'Goggle polisher', seats: 12 },
				{ id: 3, name: 'Bob', role: 'Banana taster', seats: 1 },
			]}
		/>
	)
}
