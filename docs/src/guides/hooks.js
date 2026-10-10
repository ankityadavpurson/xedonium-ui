// Content of the "Hooks & theme" page. Each entry is its own page (/hooks/<id> or /theme/<id>).
//   id, name, summary, signature (code), md (Markdown), api ({ Group: [[name, type, default, description], ...] }),
//   example (file in examples/hooks, or { from: './examples/...' } to reuse one), code (shown when there is no live
//   example), usedBy (component names whose docs page should link back here), see ([[label, path]] extra links)

import { sortByName } from '../content/sortByName'

export const hooks = [
	{
		id: 'usedebouncedvalue',
		summary: 'Wait until a value has stopped changing.',
		name: 'useDebouncedValue',
		signature: 'const debouncedValue = useDebouncedValue(value, delay = 300, { leading, maxWait })',
		md: 'Returns the latest value after it has remained unchanged for `delay` milliseconds. A change to the value or delay cancels the pending update. Useful for debouncing search input before filtering or fetching.\n\n`leading` also takes the first change after a quiet period at once and debounces the rest (a button that should react immediately, then settle). `maxWait` caps how long the update can be held back while the value keeps changing, so a live stream still updates every so often. A `delay` of `0` returns the value as it is.',
		api: {
			Parameters: [
				['value', 'Value', '', 'The value to debounce.'],
				['delay', 'number', '300', 'Wait time in milliseconds.'],
				['options.leading', 'boolean', 'false', 'Update at once on the first change after a quiet period.'],
				['options.maxWait', 'number', '', 'Longest time in ms an update may be held back.'],
			],
			Returns: [['debouncedValue', 'Value', '', 'The last value that remained unchanged for the delay.']],
		},
		example: { from: './examples/hooks/usedebouncedvalue-1.jsx' },
		usedBy: ['LogViewer'],
	},
	{
		id: 'usenetworkstatus',
		summary: 'Whether the browser is online, offline or without internet.',
		name: 'useNetworkStatus',
		signature:
			'const { status, online, latency, lastChecked, connection, check } = useNetworkStatus({ probeUrl, interval, timeout, enabled })',
		md: 'Follows the browser\'s `online` and `offline` events and the Network Information API, and, with your `probeUrl`, really tries to reach the internet: a small `HEAD` request on start, when the browser comes back online, every `interval` ms and on `check()`. That is what tells "connected to Wi-Fi" from "has internet": `status` is `online`, `offline`, `unreachable` (a network without internet access, a captive portal) or `checking`.\n\n**Always give it your own `probeUrl`.** It is required: use a health endpoint you own and control (it only needs to answer; the response is not read, so cross-origin endpoints work). Do not rely on a third-party address, which can change, throttle you, be blocked by your users\' networks or content-security policy, or track them. Without a working probe only the browser\'s flag is used, and that cannot tell Wi-Fi from internet. [NetworkConnection](/components/application/networkconnection) shows the result as a panel, a badge or a banner.',
		api: {
			Parameters: [
				[
					'probeUrl',
					'string',
					'required',
					'Your own URL, checked to prove the internet is reachable (for example your API health endpoint). Do not use a third-party address.',
				],
				['interval', 'number', '0', 'Check again every this many ms (0: only on start, online and check()).'],
				['timeout', 'number', '5000', 'Give up on a check after this many ms.'],
				['enabled', 'boolean', 'true', 'Set false to stop listening and checking.'],
			],
			Returns: [
				['status', "'online' | 'offline' | 'unreachable' | 'checking'", '', 'The combined result.'],
				['online', 'boolean', '', "The browser's own online flag."],
				['latency', 'number', '', 'Round trip of the last successful check, in ms.'],
				['lastChecked', 'Date', '', 'When the last check finished.'],
				[
					'connection',
					'{ effectiveType?, downlink?, rtt?, saveData? }',
					'',
					'What the browser reports about the connection.',
				],
				['check', '() => Promise<void>', '', 'Run a check now (needs a probeUrl).'],
			],
		},
		example: { from: './examples/hooks/usenetworkstatus-1.jsx' },
		usedBy: ['NetworkConnection'],
	},
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
		md: 'For a panel anchored to one edge of its trigger. Returns the side to use, flipping from the preferred one when the panel would run off the screen (8px is kept clear of the viewport edge) and the other side fits better. When the panel is a child of a `relative` wrapper the other side is lined up with the opposite edge of that wrapper; it is measured once, each time `open` becomes true. Handy when building your own dropdown; the library panels use `FloatingPanel` instead.',
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
		example: 'useflipalign-1.jsx',
	},
	{
		id: 'useleavewarning',
		summary: 'Warn before the tab is closed or the back button is used with unsaved changes.',
		name: 'useLeaveWarning',
		signature: 'useLeaveWarning(when, { backButton = false, message, onBack })',
		md: 'While `when` is true, closing or reloading the tab shows the browser\'s "Leave site?" prompt. Browsers ignore custom text there and show their own message. Add `backButton` to ask when the browser back button is pressed too: browsers cannot cancel that button, so the hook keeps one extra history entry while `when` is true, puts it back each time the reader chooses to stay, and removes it when `when` turns false. By default the question is a confirm box (`message`); pass `onBack(leave)` to ask in your own dialog and call `leave()` to go back after all.\n\nLinks inside your app are not intercepted: use [useUnsavedChanges](/hooks/useunsavedchanges) for those. With a router, prefer the router\'s own blocker over `backButton`, since both read the same history.',
		api: {
			Parameters: [
				['when', 'boolean', '', 'Warn only while there are unsaved changes.'],
				['options.backButton', 'boolean', 'false', 'Also ask when the browser back button is pressed.'],
				[
					'options.message',
					'string',
					"'Leave this page? Changes you made may not be saved.'",
					'Question in the confirm box.',
				],
				['options.onBack', '(leave: () => void) => void', '', 'Ask in your own dialog; call `leave()` to go back.'],
			],
		},
		example: 'useleavewarning-1.jsx',
	},
	{
		id: 'useunsavedchanges',
		summary: 'Ask before leaving a page with a form that is not saved.',
		name: 'useUnsavedChanges',
		signature: 'const { blocked, proceed, stay } = useUnsavedChanges({ when, links = true })',
		md: 'Protects a form with changes that were not saved or submitted. While `when` is true, closing or reloading the tab shows the browser\'s own "Leave site?" prompt, and a click on a link to another page of your app is held back: `blocked` turns true, you show your own "Discard changes?" dialog, and call `proceed()` to go on to that link or `stay()` to drop the click. It works with plain links and router links alike. Set `when` back to false as soon as the form is saved or submitted.\n\nIt does not see navigation that is not a link click (the browser back button, `navigate()` in code): use your router\'s own blocker for those. For the browser prompt alone, [useLeaveWarning](/hooks/useleavewarning) is enough.',
		api: {
			Parameters: [
				['when', 'boolean', '', 'True while the form has unsaved changes.'],
				['links', 'boolean', 'true', 'Also hold back clicks on links to other pages, so you can ask first.'],
			],
			Returns: [
				['blocked', 'boolean', '', 'A link click is waiting for an answer: show your dialog.'],
				['proceed', '() => void', '', 'Leave: follows the link that was clicked, without asking again.'],
				['stay', '() => void', '', 'Stay: drops the held-back click.'],
			],
		},
		example: { from: './examples/hooks/useunsavedchanges-1.jsx' },
	},
	{
		id: 'usescrollprogress',
		summary: 'How far the page or a scrolling element has been scrolled.',
		name: 'useScrollProgress',
		signature: 'const { progress, scrollTop, scrollable } = useScrollProgress(target)',
		md: 'Measures how far the page, or one scrolling element, has been scrolled. It updates while scrolling and when the size changes, and only re-renders when the numbers really change. Pass an element or a ref as `target`; leave it out for the page. A ref is read after the first render, so it can point at an element the same component renders. [ScrollProgress](/components/navigation/scrollprogress) and [BackToTop](/components/navigation/backtotop) are built on it.',
		api: {
			Parameters: [
				['target', 'HTMLElement | RefObject<HTMLElement>', 'the page', 'What to measure: an element or a ref to one.'],
			],
			Returns: [
				['progress', 'number', '', 'From 0 (top) to 1 (the end); 0 when there is nothing to scroll.'],
				['scrollTop', 'number', '', 'Pixels scrolled from the top.'],
				['scrollable', 'boolean', '', 'The target is taller than its view.'],
			],
		},
		example: 'usescrollprogress-1.jsx',
		usedBy: ['BackToTop', 'ScrollProgress'],
	},
	{
		id: 'usemediaquery',
		summary: 'Track whether a CSS media query matches.',
		name: 'useMediaQuery',
		signature: "const matches = useMediaQuery('(min-width: 1024px)')",
		md: 'Returns `true` while the media query matches and updates when it changes (resizing the window, rotating the device, switching the system theme or a motion preference). It is `false` on the server and where `matchMedia` does not exist. Use it to render something different, not for styling that CSS can do with a breakpoint.',
		api: {
			Parameters: [['query', 'string', '', 'A CSS media query, for example `(min-width: 768px)`.']],
			Returns: [['matches', 'boolean', '', 'Whether the query matches right now.']],
		},
		example: 'usemediaquery-1.jsx',
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
		example: 'usedocumenttitle-1.jsx',
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
		items: sortByName(hooks),
	},
	{
		slug: 'theme',
		label: 'Theme',
		path: '/theme',
		description: 'Light and dark theming: the provider, the hooks behind it and the favicon helpers.',
		items: sortByName(theme),
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
