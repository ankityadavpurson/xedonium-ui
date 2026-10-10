import { useState } from 'react'
import { FileExplorer } from 'xedonium'

const nodes = [
	{
		id: 'src',
		name: 'src',
		type: 'folder',
		size: 48210,
		children: [
			{ id: 'app', name: 'App.tsx', type: 'file', size: 1820, modified: '2026-03-28T09:12:00' },
			{ id: 'main', name: 'main.tsx', type: 'file', size: 410, modified: '2026-03-01T17:40:00' },
			{
				id: 'components',
				name: 'components',
				type: 'folder',
				size: 30120,
				children: [
					{ id: 'button', name: 'Button.tsx', type: 'file', size: 920, modified: '2026-03-30T11:00:00' },
					{ id: 'modal', name: 'Modal.tsx', type: 'file', size: 4100, modified: '2026-03-30T11:05:00' },
				],
			},
		],
	},
	{
		id: 'public',
		name: 'public',
		type: 'folder',
		children: [{ id: 'logo', name: 'logo.svg', type: 'file', size: 2200 }],
	},
	{ id: 'readme', name: 'README.md', type: 'file', size: 5320, modified: '2026-02-11T08:30:00' },
	{ id: 'pkg', name: 'package.json', type: 'file', size: 1180, modified: '2026-03-02T10:15:00' },
]

export default function Demo() {
	const [picked, setPicked] = useState(null)

	return (
		<div className="flex flex-col gap-3">
			<FileExplorer
				nodes={nodes}
				selected={picked?.id}
				onSelect={setPicked}
				defaultPath={['src']}
				defaultExpanded={['src']}
			/>
			<p className="m-0 text-xs text-app-muted">
				{picked ? `Opened ${picked.name}` : 'Click a folder to open it, a file to select it.'}
			</p>
		</div>
	)
}
