import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
	ActionMenu,
	AppBar,
	Button,
	ConfirmDialog,
	FanFavicon,
	Field,
	PageHeader,
	PageLayout,
	RackServer,
	ThemeProvider,
	Toast,
	Tooltip,
	useTimedToast,
	buildFaviconHref,
	useTheme,
} from '../src'
import './main.css'

const Logo = () => {
	const { activeTheme } = useTheme()
	return <img src={buildFaviconHref(activeTheme)} alt="" width={22} height={22} />
}

const Section = ({ title, children }) => (
	<section className="flex flex-col gap-3 border border-app-border bg-app-card p-5">
		<h2 className="text-xs font-semibold uppercase tracking-widest text-app-muted">{title}</h2>
		<div className="flex flex-wrap items-center gap-3">{children}</div>
	</section>
)

const App = () => {
	const [open, setOpen] = useState(false)
	const [busy, setBusy] = useState(false)
	const [name, setName] = useState('')
	const { toast, showToast } = useTimedToast()

	const confirm = () => {
		setBusy(true)
		setTimeout(() => {
			setBusy(false)
			setOpen(false)
			showToast('Done')
		}, 1200)
	}

	return (
		<>
			<AppBar
				brand="Xedonium"
				logo={<Logo />}
				links={[
					{ href: '#', label: 'Apps', active: true },
					{ href: '#admin', label: 'Admin' },
				]}
			/>
			<PageLayout>
				<PageHeader title="Playground" subtitle="Every component, light and dark" />
				<div className="mt-6 flex flex-col gap-4">
					<Section title="Buttons">
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="danger">Danger</Button>
						<Button variant="warning">Warning</Button>
						<Button tooltip="Tooltip text">Hover me</Button>
						<Button disabled>Disabled</Button>
					</Section>
					<Section title="Field">
						<div className="w-72">
							<Field
								label="Name"
								value={name}
								onChange={setName}
								placeholder="Type here"
								error={name === 'x' ? 'Too short' : ''}
							/>
						</div>
					</Section>
					<Section title="Menu / Dialog / Toast">
						<ActionMenu
							label="Actions"
							trigger="Actions"
							items={[
								{ key: 'a', label: 'First', description: 'Does a thing', onClick: () => showToast('First') },
								{ key: 'b', label: 'Second', badge: 3, onClick: () => showToast('Second', 'error') },
							]}
						/>
						<Button onClick={() => setOpen(true)}>Open dialog</Button>
						<Tooltip text="Plain tooltip">
							<span className="border border-app-border px-2 py-1 text-xs">Tooltip target</span>
						</Tooltip>
					</Section>
					<Section title="Loaders">
						<FanFavicon label="Loading" />
						<RackServer />
					</Section>
				</div>
			</PageLayout>
			<ConfirmDialog
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={confirm}
				busy={busy}
				title="Confirm action"
				confirmLabel="Confirm"
				busyLabel="Working..."
			>
				<p>Are you sure you want to continue?</p>
			</ConfirmDialog>
			<Toast toast={toast} />
		</>
	)
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider storageKey="xedonium-playground-theme" favicon>
			<App />
		</ThemeProvider>
	</StrictMode>
)
