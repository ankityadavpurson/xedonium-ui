import { DataGrid } from 'xedonium'

export default function Demo() {
	const rows = Array.from({ length: 23 }, (_, i) => ({
		id: i + 1,
		name: ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret'][i % 5] + ' ' + (i + 1),
		team: ['Core', 'Web', 'Infra'][i % 3],
		score: (i * 37) % 100,
	}))
	return (
		<DataGrid
			searchable
			selectable
			pageSize={5}
			rows={rows}
			columns={[
				{ key: 'name', header: 'Name', sortable: true },
				{ key: 'team', header: 'Team', sortable: true },
				{ key: 'score', header: 'Score', sortable: true, align: 'right' },
			]}
		/>
	)
}
