import { PipelineGraph } from 'xedonium'

export default function Demo() {
	return (
		<div className="border border-app-border bg-app-bg py-4">
			<PipelineGraph
				aria-label="Moon heist"
				nodes={[
					{ id: 'plan', label: 'plan', status: 'success', duration: '3s' },
					{ id: 'hire-minions', label: 'hire-minions', status: 'success', duration: '2m 25s', needs: ['plan'] },
					{ id: 'hire-nerds', label: 'hire-nerds', status: 'running', needs: ['plan'] },
					{ id: 'build-freeze', label: 'build-freeze', status: 'success', duration: '48s', needs: ['hire-minions'] },
					{ id: 'build-shrink', label: 'build-shrink', status: 'queued', needs: ['hire-nerds'] },
					{ id: 'launch-rocket', label: 'launch-rocket', status: 'failed', duration: '12s', needs: ['build-freeze'] },
					{ id: 'grab-moon', label: 'grab-moon', status: 'skipped', needs: ['build-shrink'] },
				]}
			/>
		</div>
	)
}
