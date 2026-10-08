import { useState } from 'react'
import { Sidebar, Stack, Switch, GridIcon, HomeIcon, SettingsIcon } from 'xedonium'

// `section` items are captions (dividers when collapsed); long labels get a tooltip; `bordered` and `density` tune the look
export default function Demo() {
	const [active, setActive] = useState('home')
	const [bordered, setBordered] = useState(false)
	return (
		<Stack gap={3}>
			<Switch label="Bordered" checked={bordered} onChange={setBordered} />
			<div className="h-72 w-48">
				<Sidebar
					bordered={bordered}
					density="dense"
					activeKey={active}
					onSelect={setActive}
					items={[
						{ key: 'main', label: 'Main Menu', section: true },
						{ key: 'home', label: 'Home', icon: <HomeIcon /> },
						{ key: 'projects', label: 'Projects with a very long name', icon: <GridIcon /> },
						{ key: 'admin', label: 'Administration', section: true },
						{ key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
					]}
				/>
			</div>
		</Stack>
	)
}
