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
