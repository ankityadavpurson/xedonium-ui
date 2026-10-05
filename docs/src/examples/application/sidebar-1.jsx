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
					header={<strong className="text-sm">Acme</strong>}
					items={[
						{ key: 'home', label: 'Home', icon: <HomeIcon /> },
						{ key: 'grid', label: 'Projects', icon: <GridIcon />, badge: 3 },
						{
							key: 'settings',
							label: 'Settings',
							icon: <SettingsIcon />,
							children: [
								{ key: 'profile', label: 'Profile' },
								{ key: 'security', label: 'Security' },
							],
						},
					]}
				/>
			</div>
		</Stack>
	)
}
