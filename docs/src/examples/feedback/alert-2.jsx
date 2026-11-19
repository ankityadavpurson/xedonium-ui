import { Alert, Stack } from 'xedonium'

const STRIPES = 'repeating-linear-gradient(45deg, #fde047 0 12px, #1f2937 12px 24px)'

export default function Demo() {
	return (
		<div className="p-6" style={{ backgroundImage: STRIPES }}>
			<Stack gap={3}>
				<Alert tone="danger" title="Soft (default)">
					The stripes of the lair show through this one.
				</Alert>
				<Alert tone="danger" variant="solid" title="Solid">
					Kevin can read this one over the stripes.
				</Alert>
				<Alert tone="success" variant="solid" title="Banana secured">
					The bananas are safe in the vault.
				</Alert>
				<Alert tone="warning" variant="solid" title="Careful">
					Gru will not like this.
				</Alert>
				<Alert tone="info" variant="solid" title="Bello!">
					A Minion has something to tell you.
				</Alert>
			</Stack>
		</div>
	)
}
