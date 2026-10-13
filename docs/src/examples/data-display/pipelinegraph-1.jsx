import { PipelineGraph } from 'xedonium'

export default function Demo() {
	return (
		<div className="border border-app-border bg-app-bg py-4">
			<PipelineGraph
				aria-label="Publish run"
				nodes={[
					{ id: 'changes', label: 'changes', status: 'success', duration: '3s' },
					{ id: 'verify-post', label: 'verify-post', status: 'success', duration: '2m 25s', needs: ['changes'] },
					{ id: 'verify-admin', label: 'verify-admin', status: 'running', needs: ['changes'] },
					{ id: 'build-post', label: 'build-post', status: 'success', duration: '48s', needs: ['verify-post'] },
					{ id: 'build-admin', label: 'build-admin', status: 'queued', needs: ['verify-admin'] },
					{ id: 'deploy-post', label: 'deploy-post', status: 'failed', duration: '12s', needs: ['build-post'] },
					{ id: 'deploy-admin', label: 'deploy-admin', status: 'skipped', needs: ['build-admin'] },
				]}
			/>
		</div>
	)
}
