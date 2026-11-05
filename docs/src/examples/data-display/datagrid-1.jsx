import { DataGrid } from 'xedonium'

export default function Demo() {
	const rows = Array.from({ length: 23 }, (_, i) => ({
		id: i + 1,
		name: ['Kevin', 'Stuart', 'Bob', 'Dave', 'Carl'][i % 5] + ' ' + (i + 1),
		team: ['Bananas', 'Gadgets', 'Pranks'][i % 3],
		score: (i * 37) % 100,
	}))
	return (
		<DataGrid
			searchable
			selectable
			pageSize={5}
			pageSizeOptions={[5, 10, 25]}
			rows={rows}
			columns={[
				{ key: 'name', header: 'Name', sortable: true },
				{ key: 'team', header: 'Team', sortable: true },
				{ key: 'score', header: 'Score', sortable: true, align: 'right' },
			]}
		/>
	)
}
