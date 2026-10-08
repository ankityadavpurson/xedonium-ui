import { Button, PlusIcon } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Button>Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="flat">Flat</Button>
			<Button variant="success">Success</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="warning">Warning</Button>
			<Button>
				<PlusIcon />
				With icon
			</Button>
			<Button tooltip="Tooltip text">Hover me</Button>
			<Button disabled>Disabled</Button>
		</div>
	)
}
