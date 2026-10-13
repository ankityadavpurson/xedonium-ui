import { useState } from 'react'
import { Alert, PipelineGraph } from 'xedonium'

const nodes = [
	{ id: 'lint', label: 'lint', status: 'success', duration: '8s' },
	{ id: 'typecheck', label: 'typecheck', status: 'success', duration: '14s' },
	{ id: 'test', label: 'test', status: 'success', duration: '1m 4s', needs: ['lint', 'typecheck'] },
	{ id: 'e2e', label: 'e2e', status: 'cancelled', description: 'chrome, firefox', needs: ['lint'] },
	{ id: 'audit', label: 'audit', status: 'skipped', needs: ['typecheck'] },
	{ id: 'build-web', label: 'build-web', status: 'success', duration: '52s', needs: ['test'] },
	{ id: 'build-docs', label: 'build-docs', status: 'running', needs: ['test'] },
	{ id: 'package', label: 'package', status: 'running', needs: ['build-web', 'e2e'] },
	{ id: 'deploy-staging', label: 'deploy-staging', status: 'queued', needs: ['package'] },
	{ id: 'deploy-docs', label: 'deploy-docs', status: 'queued', needs: ['build-docs'] },
	{ id: 'smoke', label: 'smoke', status: 'queued', needs: ['deploy-staging'] },
	{
		id: 'release',
		label: 'release',
		status: 'queued',
		trailing: 'v1.3',
		disabled: true,
		needs: ['smoke', 'deploy-docs'],
	},
]

export default function Demo() {
	const [selected, setSelected] = useState('test')
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
