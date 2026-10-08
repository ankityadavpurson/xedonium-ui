// Content of the "Hooks & theme" page. Each entry is its own page (/hooks/<id> or /theme/<id>).
//   id, name, summary, signature (code), md (Markdown), api ({ Group: [[name, type, default, description], ...] }),
//   example (file in examples/hooks, or { from: './examples/...' } to reuse one), code (shown when there is no live
//   example), usedBy (component names whose docs page should link back here), see ([[label, path]] extra links)

export const hooks = [
	{
		id: 'usetimedtoast',
		summary: 'State for stacked, self-dismissing toasts.',
		name: 'useTimedToast',
		signature: 'const { toast, toasts, showToast, hideToast } = useTimedToast(duration = 3000, { max = 5 })',
		md: 'State for [`Toast`](/components/overlay/toast). `showToast` adds a toast that removes itself after `duration`; several can be on screen at once, and beyond `max` the oldest is dropped. Render `<Toast toasts={toasts} onClose={hideToast} />` once.',
		api: {
			Parameters: [
				[
					'duration',
					'number',
					'3000',
					'Default lifetime of a toast in ms. A toast shown with `duration: 0` stays until hidden.',
				],
				['options.max', 'number', '5', 'Most toasts shown at once; the oldest is dropped beyond it.'],
			],
			Returns: [
				['toasts', 'Toast[]', '', 'Toasts on screen, oldest first. Each is `{ id, msg, type, link, actions, icon }`.'],
				['toast', 'Toast | null', '', 'The newest toast, for the single-toast `<Toast toast={toast} />` usage.'],
				[
					'showToast',
					'(msg, type?, options?) => id',
					'',
					'Adds a toast and returns its id. `type` is "success" (default), "danger" (or "error"), "warning" or "info". `options`: `link: { href, label }`, `actions: { label, onClick }[]`, `icon`, `duration`.',
				],
				['hideToast', '(id?) => void', '', 'Removes the toast with that id, or every toast when called without one.'],
			],
		},
		example: 'usetimedtoast-1.jsx',
		usedBy: ['Toast'],
	},
	{
		id: 'usedismissable',
		summary: 'Close a panel on an outside click or Escape.',
		name: 'useDismissable',
		signature: 'useDismissable(open, insideRefs, onDismiss)',
		md: 'Calls `onDismiss` when the user clicks outside the given elements or presses Escape, while `open` is true. It is what closes the dropdown panels in `Select`, `Popover`, the date pickers and `ActionMenu`. Pass every element that counts as "inside", for example the trigger wrapper and a portalled panel.',
		api: {
			Parameters: [
				['open', 'boolean', '', 'Listeners are attached only while this is true.'],
				['insideRefs', 'RefObject | RefObject[]', '', 'Clicks inside any of these elements do not dismiss.'],
				['onDismiss', "(reason: 'outside' | 'escape') => void", '', 'Called with why it was dismissed.'],
			],
		},
		example: 'usedismissable-1.jsx',
		usedBy: [
			'Select',
			'MultiSelect',
			'SearchSelect',
			'Popover',
			'ActionMenu',
			'DatePicker',
			'DateRangePicker',
			'TimePicker',
			'NotificationCenter',
		],
	},
	{
		id: 'usedialogfocus',
		summary: 'Move, trap and restore focus for a dialog.',
		name: 'useDialogFocus',
		signature: 'useDialogFocus(open, containerRef, initialFocusRef?)',
		md: 'Focus management for dialogs. When `open` becomes true it moves focus into the container (to `initialFocusRef` if given, else the element marked `data-autofocus`, otherwise the first focusable one - which in a `Modal` or `Drawer` is the Close button), keeps Tab and Shift+Tab inside it, and returns focus to the element that opened it when it closes. `Modal`, `Drawer` and `CommandPalette` use it; for a ready-made wrapper see [`FocusTrap`](/components/utilities/focustrap).',
		api: {
			Parameters: [
				['open', 'boolean', '', 'Whether the dialog is open.'],
				['containerRef', 'RefObject<HTMLElement>', '', 'Ref of the dialog element.'],
			],
		},
		example: 'usedialogfocus-1.jsx',
		usedBy: ['Modal', 'Drawer', 'CommandPalette', 'FocusTrap'],
	},
	{
		id: 'useescapekey',
		summary: 'Run a callback when Escape is pressed.',
		name: 'useEscapeKey',
		signature: 'useEscapeKey(enabled, onEscape)',
		md: 'Calls `onEscape` when Escape is pressed anywhere on the page, while `enabled` is true. Use it for overlays that should close on Escape regardless of focus (`Modal`, `Drawer` and `CommandPalette` do). For dropdowns that also close on outside clicks use [`useDismissable`](/hooks/usedismissable).',
		api: {
			Parameters: [
				['enabled', 'boolean', '', 'The listener is attached only while this is true.'],
				['onEscape', '() => void', '', 'Called on Escape.'],
			],
		},
		example: 'useescapekey-1.jsx',
		usedBy: ['Modal', 'Drawer', 'CommandPalette'],
	},
	{
		id: 'usekeyboardshortcuts',
		summary: 'Global shortcuts such as mod+k.',
		name: 'useKeyboardShortcuts',
		signature: "useKeyboardShortcuts({ 'mod+k': handler, '/': handler }, enabled = true)",
		md: 'Global keyboard shortcuts. A combo is modifiers joined with `+` and a key: `mod+k`, `shift+?`, `g`. `mod` is Cmd on macOS and Ctrl elsewhere; the other modifiers are `ctrl`, `alt`, `shift` and `meta`. Combos match exactly, and a shortcut without a modifier is ignored while the user types in a field. A matching shortcut calls `preventDefault`. [`CommandPalette`](/components/application/commandpalette) is usually opened this way.',
		api: {
			Parameters: [
				[
					'shortcuts',
					'{ [combo: string]: (event) => void }',
					'',
					'Handlers by combo. The latest object is always used, so inline handlers are fine.',
				],
				['enabled', 'boolean', 'true', 'Pause the shortcuts.'],
			],
		},
		example: { from: './examples/utilities/usekeyboardshortcuts-1.jsx' },
		usedBy: ['CommandPalette'],
		see: [['useKeyboardShortcuts component page', '/components/utilities/usekeyboardshortcuts']],
	},
	{
		id: 'useflipalign',
		summary: 'Flip a panel to the other side when it would overflow.',
		name: 'useFlipAlign',
		signature: 'const side = useFlipAlign(open, panelRef, preferred)',
		md: 'For a panel anchored to one edge of its trigger. Returns the side to use, flipping from the preferred one when the panel would run off the screen (8px is kept clear of the viewport edge). Handy when building your own dropdown; the library panels use `FloatingPanel` instead.',
		api: {
			Parameters: [
				['open', 'boolean', '', 'Measured each time this becomes true.'],
				['panelRef', 'RefObject<HTMLElement>', '', 'Ref of the panel to measure.'],
				[
					'preferred',
					"'start' | 'end'",
					'',
					'The side you would like: "start" aligns the left edges, "end" the right edges.',
				],
			],
			Returns: [
				['side', "'start' | 'end'", '', 'The side to use: `preferred`, or the opposite one when it would not fit.'],
			],
		},
		code: `import { useRef, useState } from 'react'
import { useFlipAlign } from 'xedonium'

function Menu() {
	const [open, setOpen] = useState(false)
	const panelRef = useRef(null)
	const side = useFlipAlign(open, panelRef, 'end')

	return (
		<div className="relative">
			<button onClick={() => setOpen(o => !o)}>Open</button>
			{open && (
				<div ref={panelRef} className={\`absolute top-full \${side === 'end' ? 'right-0' : 'left-0'}\`}>
					Panel
				</div>
			)}
		</div>
	)
}`,
	},
	{
		id: 'useleavewarning',
		summary: 'Warn before the tab is closed with unsaved changes.',
		name: 'useLeaveWarning',
		signature: 'useLeaveWarning(when)',
		md: 'While `when` is true, closing or reloading the tab shows the browser\'s "Leave site?" prompt. Browsers ignore custom text and show their own message. It does not intercept in-app navigation; for that, use your router.',
		api: { Parameters: [['when', 'boolean', '', 'Warn only while there are unsaved changes.']] },
		code: `import { useState } from 'react'
import { Field, useLeaveWarning } from 'xedonium'

function Form() {
	const [name, setName] = useState('')
	useLeaveWarning(name !== '')
	return <Field label="Name" value={name} onChange={setName} />
}`,
	},
	{
		id: 'usedocumenttitle',
		summary: 'Set document.title from a page component.',
		name: 'useDocumentTitle',
		signature: "useDocumentTitle(title, suffix = '')",
		md: 'Sets `document.title` to "title · suffix", or just the suffix when there is no title. Call it from each page component.',
		api: {
			Parameters: [
				['title', 'string', '', 'Page title; may be empty.'],
				['suffix', 'string', "''", 'Site name appended after a "·".'],
			],
		},
		code: `import { useDocumentTitle } from 'xedonium'

function SettingsPage() {
	useDocumentTitle('Settings', 'My App') // "Settings · My App"
	return <h1>Settings</h1>
}`,
	},
]

export const theme = [
	{
		id: 'themeprovider',
		summary: 'Light and dark theme for the whole app.',
		name: 'ThemeProvider',
		signature: '<ThemeProvider storageKey="my-app-theme" favicon allowSystem>…</ThemeProvider>',
		md: 'Wrap the app once. It follows the operating system theme until the user toggles, or with `allowSystem` offers "follow the device" as a third, default choice; it remembers the choice in `localStorage` (under `storageKey`), mirrors the active theme to `<html data-theme="light|dark">`, and can set a theme-colored favicon. Tailwind\'s `dark:` variant is wired to the same attribute by the preset. See also [Foundations: Theme](/foundations/theme).',
		api: {
			Props: [
				['storageKey', 'string', "'xedonium-theme-override'", "Where the user's choice is stored."],
				[
					'favicon',
					'boolean',
					'false',
					'Set the fan favicon for the active theme (adds a <link rel="icon"> if the page has none).',
				],
				['faviconTitle', 'string', "''", 'Title embedded in the favicon SVG.'],
				[
					'allowSystem',
					'boolean',
					'false',
					'Offer a third `system` mode that follows the device theme and is the default. `toggleTheme` and `ThemeToggle` then cycle system, light, dark.',
				],
				['children', 'ReactNode', '', 'Your app.'],
			],
		},
		code: `import { ThemeProvider } from 'xedonium'

createRoot(document.getElementById('root')).render(
	<ThemeProvider storageKey="my-app-theme" favicon faviconTitle="My App">
		<App />
	</ThemeProvider>
)`,
		usedBy: ['AppBar', 'PageLayout'],
	},
	{
		id: 'usetheme',
		summary: 'Read and toggle the active theme.',
		name: 'useTheme',
		signature: 'const { activeTheme, themeMode, setThemeMode, allowSystem, toggleTheme } = useTheme()',
		md: 'Reads the theme from the nearest `ThemeProvider`. `toggleTheme` switches between light and dark (or cycles system, light, dark with `allowSystem`) and stores the choice; `setThemeMode` picks a mode directly. Outside a provider it returns `{ activeTheme: "dark", themeMode: "dark", allowSystem: false }` with no-op functions.',
		api: {
			Returns: [
				[
					'activeTheme',
					"'light' | 'dark'",
					'',
					'The theme in effect (the choice, or the device theme in `system` mode).',
				],
				['themeMode', "'light' | 'dark' | 'system'", "'system'", "The user's choice; `system` follows the device."],
				[
					'setThemeMode',
					"(mode: 'light' | 'dark' | 'system') => void",
					'',
					'Choose a mode. `system` clears the stored choice.',
				],
				['allowSystem', 'boolean', 'false', 'Whether the `system` mode is offered.'],
				['toggleTheme', '() => void', '', 'Switch to the other theme, or to the next mode with `allowSystem`.'],
			],
		},
		example: 'usetheme-1.jsx',
		usedBy: ['ThemeToggle'],
	},
	{
		id: 'useapptheme',
		summary: 'The hook behind ThemeProvider, without a context.',
		name: 'useAppTheme',
		signature:
			'const { activeTheme, themeMode, setThemeMode, toggleTheme } = useAppTheme({ storageKey, favicon = true, faviconTitle, allowSystem })',
		md: 'The hook behind `ThemeProvider`. Use it directly when you want the same behavior without a context provider, for example in a single top-level component. Note that `favicon` defaults to `true` here (it is `false` on `ThemeProvider`).',
		api: {
			Parameters: [
				['storageKey', 'string', "'xedonium-theme-override'", "Where the user's choice is stored."],
				['favicon', 'boolean', 'true', 'Set the fan favicon for the active theme.'],
				['faviconTitle', 'string', "''", 'Title embedded in the favicon SVG.'],
				['allowSystem', 'boolean', 'false', 'Offer a `system` mode that follows the device theme and is the default.'],
			],
			Returns: [
				['activeTheme', "'light' | 'dark'", '', 'The theme in effect.'],
				['themeMode', "'light' | 'dark' | 'system'", "'system'", "The user's choice."],
				['setThemeMode', "(mode: 'light' | 'dark' | 'system') => void", '', 'Choose a mode.'],
				['allowSystem', 'boolean', 'false', 'Echoes the option.'],
				['toggleTheme', '() => void', '', 'Switch to the other theme, or to the next mode with `allowSystem`.'],
			],
		},
		code: `import { ThemeContext, useAppTheme } from 'xedonium'

function Root({ children }) {
	const theme = useAppTheme({ storageKey: 'my-app-theme' })
	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}`,
	},
	{
		id: 'themetoggle',
		summary: 'Icon button that switches the theme.',
		name: 'ThemeToggle',
		signature: '<ThemeToggle variant="button" />',
		md: 'Icon button that calls `toggleTheme` from [`useTheme`](/theme/usetheme), with a tooltip naming the theme it switches to. With `allowSystem` on the `ThemeProvider` it cycles device, light, dark and shows a monitor icon while following the device. The default `button` variant is bordered like `Button`; `toolbar` is borderless. `AppBar` and `PageLayout` can render one through their `themeToggle` prop.',
		api: { Props: [['variant', "'button' | 'toolbar'", "'button'", 'Bordered button, or borderless toolbar style.']] },
		example: 'themetoggle-1.jsx',
		see: [
			['AppBar', '/components/navigation/appbar'],
			['PageLayout', '/components/layout/pagelayout-and-pageheader'],
		],
	},
	{
		id: 'buildfaviconhref',
		summary: 'A theme-colored fan favicon as a data URL.',
		name: 'buildFaviconHref',
		signature: "buildFaviconHref(theme, title = '')",
		md: 'Returns a `data:image/svg+xml` URL of the fan icon colored for `light` or `dark`; use it as the `href` of a `<link rel="icon">` or an `<img src>`. It draws the same fan as [`FanFavicon`](/components/feedback/loaders), and the colors come from `THEME_FAVICON_COLORS`.',
		api: {
			Parameters: [
				['theme', "'light' | 'dark'", '', 'Which color set to use.'],
				['title', 'string', "''", 'Embedded in the SVG as its <title>.'],
			],
			Returns: [['href', 'string', '', 'A data URL.']],
		},
		example: 'buildfaviconhref-1.jsx',
		usedBy: ['FanFavicon'],
	},
	{
		id: 'theme-constants',
		summary: 'The default storage key and favicon colors.',
		name: 'Theme constants',
		signature: "import { DEFAULT_THEME_STORAGE_KEY, THEME_FAVICON_COLORS } from 'xedonium'",
		md: '`DEFAULT_THEME_STORAGE_KEY` is `"xedonium-theme-override"`, the `localStorage` key used when you do not pass `storageKey`. `THEME_FAVICON_COLORS` holds the fan icon colors per theme (`outer`, `bladeA`, `bladeB`, `hubOuter`, `hubInner`, `ring`, `ringOpacity`) if you want to draw your own variant.',
		code: `import { THEME_FAVICON_COLORS } from 'xedonium'

THEME_FAVICON_COLORS.dark.outer // '#3a3a3a'`,
	},
]

export const guideSections = [
	{
		slug: 'hooks',
		label: 'Hooks',
		path: '/hooks',
		description:
			'React hooks exported alongside the components. Components that rely on one link to it from their own page.',
		items: hooks,
	},
	{
		slug: 'theme',
		label: 'Theme',
		path: '/theme',
		description: 'Light and dark theming: the provider, the hooks behind it and the favicon helpers.',
		items: theme,
	},
]

export const guidePath = (section, entry) => `${section.path}/${entry.id}`

export const findGuide = (sectionSlug, id) => {
	const section = guideSections.find(s => s.slug === sectionSlug)
	const entry = section?.items.find(item => item.id === id)
	return entry ? { section, entry } : null
}

/** Hooks and theme pieces whose "used by" list names one of these components (for the "Related" line on a component page) */
export const relatedGuides = names =>
	guideSections.flatMap(section =>
		section.items
			.filter(entry => entry.usedBy?.some(name => names.includes(name)))
			.map(entry => ({ id: entry.id, name: entry.name, path: guidePath(section, entry) }))
	)
