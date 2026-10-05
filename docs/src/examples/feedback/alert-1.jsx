import { Alert, Stack } from 'xedonium'

export default function Demo() {
	return (
		<Stack gap={3}>
			<Alert title="Heads up">Something you should know.</Alert>
			<Alert tone="success" title="Saved">
				Your changes were saved.
			</Alert>
			<Alert tone="warning" title="Careful">
				This cannot be undone.
			</Alert>
			<Alert tone="danger" title="Failed" onClose={() => {}}>
				Could not reach the server.
			</Alert>
		</Stack>
	)
}
