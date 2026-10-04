import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppBar, PageHeader, PageLayout, Tabs, ThemeProvider, buildFaviconHref, useTheme } from '../src'
import './main.css'
import Basics from './sections/Basics'
import Data from './sections/Data'
import Forms from './sections/Forms'
import Layout from './sections/Layout'
import Overlays from './sections/Overlays'

const Logo = () => {
	const { activeTheme } = useTheme()
	return <img src={buildFaviconHref(activeTheme)} alt="" width={22} height={22} />
}

const tab = (key, label, Content) => ({
	key,
	label,
	content: (
		<div className="pt-4">
			<Content />
		</div>
	),
})

const App = () => (
	<>
		<AppBar
			brand="Xedonium"
			logo={<Logo />}
			links={[
				{ href: '#', label: 'Apps', active: true },
				{ href: '#admin', label: 'Admin' },
			]}
		/>
		<PageLayout maxWidth="max-w-6xl">
			<PageHeader title="Playground" subtitle="Every component, light and dark" />
			<Tabs
				className="mt-6"
				items={[
					tab('basics', 'Basics', Basics),
					tab('forms', 'Forms', Forms),
					tab('data', 'Data', Data),
					tab('overlays', 'Overlays', Overlays),
					tab('layout', 'Layout', Layout),
				]}
			/>
		</PageLayout>
	</>
)

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider storageKey="xedonium-playground-theme" favicon>
			<App />
		</ThemeProvider>
	</StrictMode>
)
