export default {
	slug: 'application',
	label: 'Application',
	description: 'Building blocks for full app screens.',
	components: [
		{
			slug: 'navbar',
			name: 'Navbar',
			blocks: [
				{
					md: 'Plain horizontal nav (no sticky positioning or theme toggle; use `AppBar` for that). Supports `linkComponent` /\n`linkProp` for routers.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'sidebar',
			name: 'Sidebar',
			blocks: [
				{
					md: '`items: [{ key, label, icon?, href?, onClick?, badge?, children? }]`. `collapsed` shows icons only.\n\nAn item with `section: true` is a caption such as "Main Menu" (a divider when collapsed). Labels cut off by the width show a tooltip. `bordered={false}` removes the separators, `density` is `dense`, `default` or `comfortable`, and `headerClassName` / `listClassName` replace the header and list padding.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'appshell',
			name: 'AppShell',
			blocks: [
				{
					md: 'Header on top, `sidebar` on the left, scrolling main area. Below the `md` breakpoint the sidebar moves into a drawer\nbehind a menu button. `sidebar` can be a function `(close) => node` to close the drawer on selection. The shell fills\nthe viewport height; size it with `className` when embedding.\n\n`sidebarCollapsedBelow="lg"` shows the sidebar as an icon rail between `md` and `lg`: use the function form, `(close, { inDrawer, collapsed })`, and pass `collapsed` to `Sidebar`. `menuButtonVariant` and `menuButtonProps` customise the mobile menu button. Put an `AppBar` with `embedded` in `header` to avoid a double frame.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'dashboard-and-statcard',
			name: 'Dashboard and StatCard',
			blocks: [
				{
					md: '`StatCard` can also be a link or a button: `href` (with `linkComponent` / `linkProp` for a router) or `onClick` makes the whole tile clickable. `icon` sits top right, `status` adds a small chip coloured by `statusTone`, `disabled` marks a restricted tile, and `loading` shows a placeholder for the value.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'commandpalette',
			name: 'CommandPalette',
			blocks: [
				{
					md: 'Open it from a shortcut with [`useKeyboardShortcuts`](/hooks/usekeyboardshortcuts). Arrow keys move, Enter runs, Escape closes.\n\nFor server-side search pass `onQueryChange`, `loading` and the fetched `commands` (each can have a `group`); the palette then does not filter them again unless you set `filter`. `highlight` marks the matched text.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'notfoundpage',
			name: '404 Page',
			blocks: [
				{
					md: '`NotFoundPage` is a ready-made "page not found" screen: a large status code, a title, a short explanation and the way out, a link home and (with `onBack`) a "go back" button. It is not tied to 404: pass `code`, `title` and `description` for a 403, a 500 or a "coming soon" page. `children` render under the buttons (a search box, a list of suggestions). Use `homeHref={null}` to drop the home link, `linkComponent` / `linkProp` for a router link, and `fullScreen` to center it in the whole viewport.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'notificationcenter',
			name: 'NotificationCenter',
			blocks: [
				{
					example: 1,
				},
			],
		},
	],
}
