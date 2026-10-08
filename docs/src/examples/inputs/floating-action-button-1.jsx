import { EditIcon, FloatingActionButton, PlusIcon, SaveIcon } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<FloatingActionButton size="sm" aria-label="Add" tooltip="Add">
				<PlusIcon />
			</FloatingActionButton>
			<FloatingActionButton aria-label="Add" tooltip="Add">
				<PlusIcon />
			</FloatingActionButton>
			<FloatingActionButton size="lg" variant="secondary" aria-label="Edit">
				<EditIcon />
			</FloatingActionButton>
			<FloatingActionButton variant="success" label="Save">
				<SaveIcon />
			</FloatingActionButton>
			<FloatingActionButton variant="danger" label="Delete" size="sm" />
			<FloatingActionButton color="#2563eb" aria-label="Custom color" tooltip="Any CSS color">
				<PlusIcon />
			</FloatingActionButton>
			<FloatingActionButton color="#facc15" label="Light color">
				<SaveIcon />
			</FloatingActionButton>
			<FloatingActionButton shape="circle" aria-label="Add" tooltip="Circle">
				<PlusIcon />
			</FloatingActionButton>
			<FloatingActionButton shape="circle" size="lg" color="#3b82f6" aria-label="Edit">
				<EditIcon />
			</FloatingActionButton>
			<FloatingActionButton shape="circle" variant="success" label="Save">
				<SaveIcon />
			</FloatingActionButton>
			<FloatingActionButton aria-label="Disabled" disabled>
				<PlusIcon />
			</FloatingActionButton>
		</div>
	)
}
