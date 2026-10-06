import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page from '../pages/Page'

const ThemePage = () => (
	<Page title="Theme" subtitle="Light and dark">
		<Markdown>
			{
				'Light and dark are driven by `<html data-theme="light|dark">`. Wrap your app in `ThemeProvider` to set it: it follows the OS until the user toggles, and persists the override under `storageKey`.'
			}
		</Markdown>
		<CodeBlock
			code={`<ThemeProvider storageKey="my-app-theme" favicon>
	<App />
</ThemeProvider>`}
		/>
		<Markdown>
			{
				"- [`ThemeProvider`](/theme/themeprovider) takes `storageKey`, `favicon` and `faviconTitle`.\n- [`useTheme()`](/theme/usetheme) returns `{ activeTheme, toggleTheme }`.\n- [`ThemeToggle`](/theme/themetoggle) is a ready-made button for `toggleTheme`.\n- [`useAppTheme`](/theme/useapptheme) is the hook behind the provider, for use without a context.\n- [`buildFaviconHref(theme)`](/theme/buildfaviconhref) builds a theme-colored favicon data URL.\n\nAll of them are documented, with examples, in the [Theme](/theme) section.\n\nTailwind's `dark:` variant is wired to the same attribute by the preset (`darkMode: ['selector', '[data-theme=\"dark\"]']`)."
			}
		</Markdown>
	</Page>
)

export default ThemePage
