import { ActionMenu, Button, ButtonLink, Toast, Tooltip, useTimedToast } from 'xedonium'

export default function Demo() {
	const { toast, showToast } = useTimedToast()

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Button>Default</Button>
			<ButtonLink href="#link" variant="secondary">
				Link
			</ButtonLink>
			<Button variant="secondary">Secondary</Button>
			<Button variant="success">Success</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="warning">Warning</Button>
			<Button tooltip="Tooltip text">Hover me</Button>
			<Button disabled>Disabled</Button>
			<Tooltip text="Plain tooltip">
				<span className="border border-app-border px-2 py-1 text-xs">Tooltip target</span>
			</Tooltip>
			<ActionMenu
				label="Actions"
				trigger="Actions"
				items={[
					{ key: 'a', label: 'First', description: 'Does a thing', onClick: () => showToast('First') },
					{ key: 'b', label: 'Second', badge: 3, onClick: () => showToast('Second', 'error') },
				]}
			/>
			<Toast toast={toast} />
		</div>
	)
}
