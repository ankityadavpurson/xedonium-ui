import { Select, useTheme } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page, { H2 } from '../pages/Page'

const modes = [
	'- `light`: always the light theme.',
	'- `dark`: always the dark theme.',
	'- `system`: follow the device (`prefers-color-scheme`), including live changes while the page is open.',
].join('\n')

// Live picker: the docs site runs its ThemeProvider with `allowSystem`
const ModePicker = () => {
	const { themeMode, setThemeMode, activeTheme } = useTheme()
	return (
		<div className="flex max-w-xs flex-col gap-2">
			<Select
				label="Theme"
				value={themeMode}
				onChange={setThemeMode}
				options={[
					{ value: 'system', label: 'Device' },
					{ value: 'light', label: 'Light' },
					{ value: 'dark', label: 'Dark' },
				]}
			/>
			<p className="m-0 text-xs text-app-muted">
				Mode: {themeMode}. On screen: {activeTheme}.
			</p>
		</div>
	)
}

const ThemePage = () => (
	<Page title="Theme" subtitle="Light, dark and the device theme">
		<Markdown>
			{
				'The theme is driven by `<html data-theme="light|dark">`. Wrap your app in `ThemeProvider` to set it. The user can choose a fixed theme, and the choice is remembered under `storageKey`.'
			}
		</Markdown>
		<CodeBlock
			code={`<ThemeProvider storageKey="my-app-theme" favicon>
	<App />
</ThemeProvider>`}
		/>

		<H2>Following the device theme</H2>
		<Markdown>
			{
				'By default the app follows the device theme until the user toggles; from then on their choice is stored. Add `allowSystem` to make "follow the device" a real third choice that stays selectable and is the default for new visitors.'
			}
		</Markdown>
		<CodeBlock
			code={`<ThemeProvider storageKey="my-app-theme" allowSystem>
	<App />
</ThemeProvider>`}
		/>
		<Markdown>{modes}</Markdown>
		<ModePicker />
		<Markdown>
			{
				"With `allowSystem`:\n\n- `system` is the default, so first-time visitors get their device theme and keep getting it when the device switches (for example at sunset).\n- Choosing `system` again clears the stored choice. Only `light` and `dark` are saved.\n- [`ThemeToggle`](/theme/themetoggle) cycles device, light, dark and shows a monitor icon while following the device. So do the toggles in `AppBar` and `PageLayout`.\n- `toggleTheme()` takes the same cycle. To pick a mode directly, for example from a menu, call `setThemeMode('system' | 'light' | 'dark')`.\n\nWithout `allowSystem` nothing changes: `toggleTheme()` switches between light and dark."
			}
		</Markdown>
		<CodeBlock
			code={`import { useTheme } from 'xedonium'

function ThemeMenu() {
	const { themeMode, setThemeMode, activeTheme } = useTheme()
	// themeMode: the choice ('system' | 'light' | 'dark'); activeTheme: what is on screen ('light' | 'dark')
	return (
		<select value={themeMode} onChange={e => setThemeMode(e.target.value)}>
			<option value="system">Device ({activeTheme})</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	)
}`}
		/>

		<H2>Switching</H2>
		<Markdown>
			{
				"Changing the theme crossfades the whole page using the browser's View Transitions API. Browsers without it, and users who prefer reduced motion, get the plain colour transitions instead."
			}
		</Markdown>

		<H2>Reference</H2>
		<Markdown>
			{
				"- [`ThemeProvider`](/theme/themeprovider) takes `storageKey`, `favicon`, `faviconTitle` and `allowSystem`.\n- [`useTheme()`](/theme/usetheme) returns `{ activeTheme, themeMode, setThemeMode, allowSystem, toggleTheme }`.\n- [`ThemeToggle`](/theme/themetoggle) is a ready-made button for `toggleTheme`.\n- [`useAppTheme`](/theme/useapptheme) is the hook behind the provider, for use without a context.\n- [`buildFaviconHref(theme)`](/theme/buildfaviconhref) builds a theme-colored favicon data URL.\n\nAll of them are documented, with examples, in the [Theme](/theme) section.\n\nTailwind's `dark:` variant is wired to the same attribute by the preset (`darkMode: ['selector', '[data-theme=\"dark\"]']`). `data-theme` always holds the resolved theme (`light` or `dark`), never `system`, so your own CSS only needs to handle those two."
			}
		</Markdown>
	</Page>
)

export default ThemePage
