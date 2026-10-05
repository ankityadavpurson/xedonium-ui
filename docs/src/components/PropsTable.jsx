import { Table } from 'xedonium'
import { Code } from './Markdown'

const columns = [
	{ key: 'name', header: 'Prop', render: row => <Code>{row.name}</Code> },
	{ key: 'type', header: 'Type', render: row => <span className="text-xs text-app-soft">{row.type}</span> },
	{
		key: 'default',
		header: 'Default',
		render: row => (row.default ? <Code>{row.default}</Code> : <span className="text-app-muted">–</span>),
	},
	{ key: 'description', header: 'Description' },
]

/** `groups` is { ComponentName: [[name, type, default, description], ...] }; the name is shown when there are several. */
const PropsTable = ({ groups }) => {
	const entries = Object.entries(groups)
	return (
		<div className="flex flex-col gap-6">
			{entries.map(([component, rows]) => (
				<div key={component} className="flex flex-col gap-2">
					{entries.length > 1 && <h3 className="m-0 text-sm font-semibold text-app-text">{component}</h3>}
					<Table
						caption={`${component} props`}
						rowKey="name"
						columns={columns}
						rows={rows.map(([name, type, def, description]) => ({ name, type, default: def, description }))}
					/>
				</div>
			))}
		</div>
	)
}

export default PropsTable
