import { Button, ButtonGroup } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-start gap-8">
				<ButtonGroup orientation="vertical" aria-label="Zoom">
					<Button variant="secondary">Zoom in</Button>
					<Button variant="secondary">Reset</Button>
					<Button variant="secondary">Zoom out</Button>
				</ButtonGroup>
				<ButtonGroup attached={false} aria-label="Dialog actions">
					<Button variant="flat">Cancel</Button>
					<Button>Save</Button>
				</ButtonGroup>
			</div>
			<ButtonGroup fullWidth aria-label="Plan">
				<Button variant="secondary">Monthly</Button>
				<Button>Yearly</Button>
				<Button variant="secondary">Lifetime</Button>
			</ButtonGroup>
		</div>
	)
}
