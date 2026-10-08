import { useState } from 'react'
import { AppBar, AppShell, Sidebar, HomeIcon, SettingsIcon } from 'xedonium'

// AppBar `embedded` inside the shell header (no double frame), a flat menu button, and an icon rail between md and lg
export default function Demo() {
	const [active, setActive] = useState('home')
	return (
		<AppShell
			className="!h-96 border border-app-border"
			header={<AppBar embedded brand="Acme" />}
			menuButtonVariant="flat"
			menuButtonProps={{ 'aria-label': 'Navigation' }}
			sidebarCollapsedBelow="lg"
			sidebar={(close, { collapsed }) => (
				<Sidebar
					collapsed={collapsed}
					activeKey={active}
					onSelect={key => {
						setActive(key)
						close()
					}}
					items={[
						{ key: 'home', label: 'Home', icon: <HomeIcon /> },
						{ key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
					]}
				/>
			)}
		>
			<p>Showing: {active}</p>
		</AppShell>
	)
}
