import { useState } from 'react'
import { Alert, PipelineGraph } from 'xedonium'

const nodes = [
	{ id: 'goggles', label: 'goggles', status: 'success', duration: '8s' },
	{ id: 'overalls', label: 'overalls', status: 'success', duration: '14s' },
	{ id: 'banana-test', label: 'banana-test', status: 'success', duration: '1m 4s', needs: ['goggles', 'overalls'] },
	{ id: 'rehearsal', label: 'rehearsal', status: 'cancelled', description: 'day, night', needs: ['goggles'] },
	{ id: 'gru-audit', label: 'gru-audit', status: 'skipped', needs: ['overalls'] },
	{ id: 'build-lair', label: 'build-lair', status: 'success', duration: '52s', needs: ['banana-test'] },
	{ id: 'build-rocket', label: 'build-rocket', status: 'running', needs: ['banana-test'] },
	{ id: 'pack-bananas', label: 'pack-bananas', status: 'running', needs: ['build-lair', 'rehearsal'] },
	{ id: 'launch-test', label: 'launch-test', status: 'queued', needs: ['pack-bananas'] },
	{ id: 'launch-rocket', label: 'launch-rocket', status: 'queued', needs: ['build-rocket'] },
	{ id: 'smoke-check', label: 'smoke-check', status: 'queued', needs: ['launch-test'] },
	{
		id: 'steal-moon',
		label: 'steal-moon',
		status: 'queued',
		trailing: 'v1.3',
		disabled: true,
		needs: ['smoke-check', 'launch-rocket'],
	},
]

export default function Demo() {
	const [selected, setSelected] = useState('banana-test')
	return (
		<div className="flex flex-col gap-3">
			{/* The graph is wider than its frame on small screens: drag it sideways to pan */}
			<div className="border border-app-border bg-app-bg py-4">
				<PipelineGraph nodes={nodes} selectedId={selected} onNodeClick={node => setSelected(node.id)} />
			</div>
			<Alert>
				Selected: <strong>{selected}</strong>
			</Alert>
		</div>
	)
}
