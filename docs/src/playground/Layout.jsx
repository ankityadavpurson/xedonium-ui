import { useState } from 'react'
import {
	AppShell,
	Button,
	Card,
	Container,
	Dashboard,
	Flex,
	FocusTrap,
	Grid,
	GridIcon,
	HomeIcon,
	Image,
	LineChart,
	Navbar,
	Portal,
	SettingsIcon,
	Sidebar,
	Stack,
	Tabs,
	Video,
} from 'xedonium'
import { Section, months, series } from './shared'

const Box = ({ children }) => <div className="border border-app-border bg-app-bg p-3 text-xs">{children}</div>

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

const Layout = () => {
	const [key, setKey] = useState('home')
	const [collapsed, setCollapsed] = useState(false)

	return (
		<div className="flex flex-col gap-4">
			<Section title="Navbar / Tabs" className="flex-col items-stretch">
				<Navbar
					brand="Brand"
					links={[
						{ href: '#', label: 'One', active: true },
						{ href: '#2', label: 'Two' },
					]}
					actions={<Button variant="secondary">Action</Button>}
				/>
				<Tabs
					items={[
						{ key: 'a', label: 'Overview', content: <p className="py-3 text-sm">Overview content</p> },
						{ key: 'b', label: 'Activity', content: <p className="py-3 text-sm">Activity content</p> },
						{ key: 'c', label: 'Disabled', disabled: true },
					]}
				/>
			</Section>
			<Section title="Sidebar / AppShell" className="flex-col items-stretch">
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
			</Section>
			<Section title="Flex / Stack / Grid / Container" className="flex-col items-stretch">
				<Flex gap={3} justify="between">
					<Box>flex 1</Box>
					<Box>flex 2</Box>
					<Box>flex 3</Box>
				</Flex>
				<Stack gap={2}>
					<Box>stack 1</Box>
					<Box>stack 2</Box>
				</Stack>
				<Grid cols={3}>
					<Box>1</Box>
					<Box>2</Box>
					<Box>3</Box>
				</Grid>
				<Container maxWidth="max-w-sm">
					<Box>container max-w-sm</Box>
				</Container>
			</Section>
			<Section title="Media" className="items-start">
				<div className="w-60">
					<Image src="https://picsum.photos/seed/xed/400/300" alt="Sample" ratio="photo" />
				</div>
				<div className="w-60">
					<Image src="/missing.png" alt="Broken" ratio="photo" />
				</div>
				<div className="w-80">
					<Video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" title="Flower" />
				</div>
			</Section>
			<Section title="Dashboard" className="flex-col items-stretch">
				<Dashboard
					title="Overview"
					subtitle="Last 6 months"
					actions={<Button variant="secondary">Export</Button>}
					stats={[
						{ label: 'Visits', value: '1,204', delta: '+12%', trend: 'up' },
						{ label: 'Errors', value: '8', delta: '-3', trend: 'down' },
					]}
				>
					<Card title="Traffic">
						<LineChart labels={months} series={series} height={200} />
					</Card>
					<Card title="Notes">Anything goes here.</Card>
				</Dashboard>
			</Section>
			<Section title="FocusTrap / Portal">
				<FocusTrap className="flex gap-2 border border-dashed border-app-border p-3">
					<Button variant="secondary">Tab stays</Button>
					<Button variant="secondary">inside</Button>
				</FocusTrap>
				<Portal>
					<span className="fixed bottom-2 left-2 text-[10px] text-app-muted">portalled to body</span>
				</Portal>
			</Section>
		</div>
	)
}

export default Layout
