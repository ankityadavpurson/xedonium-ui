import { ActionMenu, Toast, useTimedToast } from 'xedonium'

export default function Demo() {
	const { toast, showToast } = useTimedToast()
	return (
		<>
			<ActionMenu
				label="Actions"
				trigger="Actions"
				items={[
					{ key: 'a', label: 'First', description: 'Does a thing', onClick: () => showToast('First') },
					{ key: 'b', label: 'Second', badge: 3, onClick: () => showToast('Second', 'error') },
				]}
			/>
			<Toast toast={toast} />
		</>
	)
}
