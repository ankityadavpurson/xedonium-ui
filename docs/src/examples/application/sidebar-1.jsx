import { useState } from 'react'
import { Sidebar, Stack, Switch, GridIcon, HomeIcon, SettingsIcon } from 'xedonium'

export default function Demo() {
	const [active, setActive] = useState('home')
	const [collapsed, setCollapsed] = useState(false)
	return (
		<Stack gap={3}>
			<Switch label="Collapsed" checked={collapsed} onChange={setCollapsed} />
			<div className="h-80">
				<Sidebar
					collapsed={collapsed}
					activeKey={active}
					onSelect={setActive}
					header={<strong className="text-sm">Minion HQ</strong>}
					items={[
						{ key: 'home', label: 'Lair', icon: <HomeIcon /> },
						{ key: 'grid', label: 'Missions', icon: <GridIcon />, badge: 3 },
						{
							key: 'settings',
							label: 'Gadgets',
							icon: <SettingsIcon />,
							children: [
								{ key: 'profile', label: 'Goggles' },
								{ key: 'security', label: 'Overalls' },
							],
						},
					]}
				/>
			</div>
		</Stack>
	)
}
