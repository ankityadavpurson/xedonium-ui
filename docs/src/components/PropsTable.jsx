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

// Phone and tablet: one card per prop (the inline sidebar leaves a table too little room below the lg breakpoint)
const PropCards = ({ rows }) => (
	<ul className="m-0 flex list-none flex-col gap-2 p-0 lg:hidden">
		{rows.map(row => (
			<li key={row.name} className="flex flex-col gap-1.5 border border-app-border bg-app-card p-3 text-sm">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<Code>{row.name}</Code>
					{row.type && <span className="min-w-0 break-words text-xs text-app-soft">{row.type}</span>}
				</div>
				{row.default && (
					<div className="text-xs text-app-muted">
						Default: <Code>{row.default}</Code>
					</div>
				)}
				{row.description && <p className="m-0 text-app-text">{row.description}</p>}
			</li>
		))}
	</ul>
)

/** `groups` is { ComponentName: [[name, type, default, description], ...] }; the name is shown when there are several. */
const PropsTable = ({ groups }) => {
	const entries = Object.entries(groups)
	return (
		<div className="flex flex-col gap-6">
			{entries.map(([component, rows]) => {
				const data = rows.map(([name, type, def, description]) => ({ name, type, default: def, description }))
				return (
					<div key={component} className="flex flex-col gap-2">
						{entries.length > 1 && <h3 className="m-0 text-sm font-semibold text-app-text">{component}</h3>}
						<PropCards rows={data} />
						<div className="hidden lg:block">
							<Table caption={`${component} props`} rowKey="name" columns={columns} rows={data} />
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default PropsTable
