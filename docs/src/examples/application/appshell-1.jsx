import { useState } from 'react'
import { AppShell, Sidebar, HomeIcon, SettingsIcon } from 'xedonium'

export default function Demo() {
	const [active, setActive] = useState('home')
	return (
		<AppShell
			className="!h-96 border border-app-border"
			header={<strong>Acme</strong>}
			sidebar={close => (
				<Sidebar
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
