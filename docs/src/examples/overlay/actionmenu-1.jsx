import { ActionMenu, Toast, useTimedToast, PlusIcon, Trash2Icon } from 'xedonium'

export default function Demo() {
	const { toast, showToast } = useTimedToast()
	return (
		<>
			<ActionMenu
				label="Actions"
				trigger="Actions"
				items={[
					{
						key: 'a',
						label: 'Peel a banana',
						icon: <PlusIcon />,
						description: 'Mind the slip',
						onClick: () => showToast('Peeled'),
					},
					{
						key: 'b',
						label: 'Throw a banana',
						icon: <Trash2Icon />,
						badge: 3,
						onClick: () => showToast('Thrown', 'error'),
					},
					{
						key: 'c',
						label: 'Source on GitHub',
						href: 'https://github.com/ankityadavpurson/xedonium-ui',
						target: '_blank',
					},
				]}
			/>
			<Toast toast={toast} />
		</>
	)
}
