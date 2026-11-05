import { useState } from 'react'
import { DataGrid, Switch } from 'xedonium'

// Loading skeleton, columns hidden on small screens, a fixed width, and no footer when everything fits on one page
export default function Demo() {
	const [loading, setLoading] = useState(false)
	const rows = [
		{ id: 1, name: 'Kevin', team: 'Bananas', email: 'kevin@minions.example' },
		{ id: 2, name: 'Stuart', team: 'Gadgets', email: 'stuart@minions.example' },
		{ id: 3, name: 'Bob', team: 'Pranks', email: 'bob@minions.example' },
	]
	return (
		<div className="flex flex-col gap-3">
			<Switch label="Loading" checked={loading} onChange={setLoading} />
			<DataGrid
				loading={loading}
				hideFooterWhenSinglePage
				rows={rows}
				columns={[
					{ key: 'name', header: 'Name', width: 140 },
					{ key: 'team', header: 'Team', hideBelow: 'sm' },
					{ key: 'email', header: 'Email', hideBelow: 'md', className: 'text-app-muted' },
				]}
			/>
		</div>
	)
}
