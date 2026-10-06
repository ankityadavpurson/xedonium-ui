import { useState } from 'react'
import { AppShell, Button, GridIcon, HomeIcon, SettingsIcon, Sidebar } from 'xedonium'

const items = [
	{ key: 'home', label: 'Home', icon: <HomeIcon className="h-4 w-4" /> },
	{ key: 'apps', label: 'Apps', icon: <GridIcon className="h-4 w-4" />, badge: 3 },
	{
		key: 'settings',
		label: 'Settings',
		icon: <SettingsIcon className="h-4 w-4" />,
		children: [
			{ key: 'profile', label: 'Profile' },
			{ key: 'billing', label: 'Billing' },
		],
	},
]

export default function Demo() {
	const [key, setKey] = useState('home')
	const [collapsed, setCollapsed] = useState(false)

	return (
		<div className="flex flex-col gap-4">
			<Button variant="secondary" onClick={() => setCollapsed(c => !c)} className="self-start">
				Toggle collapsed
			</Button>
			<div className="self-start border border-app-border">
				<Sidebar
					items={items}
					activeKey={key}
					onSelect={setKey}
					collapsed={collapsed}
					header={collapsed ? null : <span className="text-xs">Menu</span>}
				/>
			</div>
			<div className="h-72 overflow-hidden border border-app-border">
				<AppShell
					header={<span className="text-sm font-bold">Shell</span>}
					sidebar={close => (
						<Sidebar
							items={items}
							activeKey={key}
							onSelect={k => {
								setKey(k)
								close()
							}}
						/>
					)}
				>
					<div className="p-4 text-sm">Main area ({key})</div>
				</AppShell>
			</div>
		</div>
	)
}
