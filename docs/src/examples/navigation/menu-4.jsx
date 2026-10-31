import { ActionMenu, Menu, PlusIcon, SettingsIcon, Trash2Icon } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-start gap-3">
			<ActionMenu
				label="Page actions"
				trigger="ActionMenu"
				items={[
					{ key: 'new', label: 'New item', icon: <PlusIcon />, description: 'Starts empty', onClick: () => {} },
					{ key: 'settings', label: 'Settings', icon: <SettingsIcon />, badge: 2, onClick: () => {} },
				]}
			/>
			<Menu
				label="Actions"
				trigger="Menu"
				look="actions"
				items={[
					{ key: 'new', label: 'New item', icon: <PlusIcon />, description: 'Starts empty', onClick: () => {} },
					{
						key: 'more',
						label: 'More',
						icon: <SettingsIcon />,
						children: [
							{ key: 'settings', label: 'Settings', badge: 2, onClick: () => {} },
							{
								key: 'docs',
								label: 'Documentation',
								href: 'https://github.com/ankityadavpurson/xedonium-ui',
								target: '_blank',
							},
						],
					},
					{ key: 'reset', label: 'Reset stats', description: 'Clears the counters', tone: 'warning', hasDialog: true },
					{ key: 'delete', label: 'Delete', icon: <Trash2Icon />, tone: 'danger', onClick: () => {} },
				]}
			/>
		</div>
	)
}
