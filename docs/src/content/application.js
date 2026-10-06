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
					md: '`items: [{ key, label, icon?, href?, onClick?, badge?, children? }]`. `collapsed` shows icons only.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'appshell',
			name: 'AppShell',
			blocks: [
				{
					md: 'Header on top, `sidebar` on the left, scrolling main area. Below the `md` breakpoint the sidebar moves into a drawer\nbehind a menu button. `sidebar` can be a function `(close) => node` to close the drawer on selection. The shell fills\nthe viewport height; size it with `className` when embedding.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'dashboard-and-statcard',
			name: 'Dashboard and StatCard',
			blocks: [
				{
					example: 1,
				},
			],
		},
		{
			slug: 'commandpalette',
			name: 'CommandPalette',
			blocks: [
				{
					md: 'Open it from a shortcut with [`useKeyboardShortcuts`](/hooks/usekeyboardshortcuts). Arrow keys move, Enter runs, Escape closes.',
				},
				{
					example: 1,
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
