import { useState } from 'react'
import { DataGrid, Switch } from 'xedonium'

// Loading skeleton, columns hidden on small screens, a fixed width, and no footer when everything fits on one page
export default function Demo() {
	const [loading, setLoading] = useState(false)
	const rows = [
		{ id: 1, name: 'Ada', team: 'Core', email: 'ada@example.com' },
		{ id: 2, name: 'Linus', team: 'Web', email: 'linus@example.com' },
		{ id: 3, name: 'Grace', team: 'Infra', email: 'grace@example.com' },
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
