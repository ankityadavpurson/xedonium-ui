import { useState } from 'react'
import { DataGrid, Table } from 'xedonium'

const columns = [
	{ key: 'name', header: 'Name', sortable: true },
	{ key: 'role', header: 'Role', sortable: true },
	{ key: 'score', header: 'Score', sortable: true, align: 'right' },
]

const people = Array.from({ length: 23 }, (_, i) => ({
	id: i + 1,
	name: ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret'][i % 5] + ' ' + (i + 1),
	role: ['Admin', 'Editor', 'Viewer'][i % 3],
	score: (i * 37) % 100,
}))

export default function Demo() {
	const [selected, setSelected] = useState([])

	return (
		<div className="flex flex-col gap-4">
			<Table columns={columns} rows={people.slice(0, 4)} caption="Simple table" />
			<DataGrid
				columns={columns}
				rows={people}
				pageSize={5}
				searchable
				selectable
				selected={selected}
				onSelectionChange={setSelected}
				caption="Data grid"
			/>
		</div>
	)
}
