import { DataGrid } from 'xedonium'

const TEAMS = ['Core', 'Web', 'Infra', 'Data']

// 50,000 rows: only the ones in view are in the DOM. Sorting, search and selection still cover every row.
const rows = Array.from({ length: 50000 }, (_, i) => ({
	id: i + 1,
	name: `User ${i + 1}`,
	team: TEAMS[i % TEAMS.length],
	score: (i * 7919) % 1000,
}))

export default function Demo() {
	return (
		<DataGrid
			virtualized
			searchable
			selectable
			rowHeight={40}
			height={360}
			rows={rows}
			columns={[
				{ key: 'name', header: 'Name', sortable: true },
				{ key: 'team', header: 'Team', sortable: true },
				{ key: 'score', header: 'Score', sortable: true, align: 'right' },
			]}
		/>
	)
}
