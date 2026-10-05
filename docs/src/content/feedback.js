export default {
	slug: 'feedback',
	label: 'Feedback',
	description: 'Messages, progress and loading states.',
	components: [
		{
			slug: 'alert',
			name: 'Alert',
			blocks: [
				{
					md: '`tone`: `info`, `success`, `warning`, `danger`. `onClose` makes it dismissible.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'progress',
			name: 'Progress',
			blocks: [
				{
					md: 'Omit `value` for an indeterminate bar.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'skeleton',
			name: 'Skeleton',
			blocks: [
				{
					example: 1,
				},
			],
		},
		{
			slug: 'loaders',
			name: 'Loaders',
			blocks: [
				{
					md: '`LoadingScreen` is a full-screen loader. `FanFavicon` and `RackServer` are the animated pieces.',
				},
				{
					example: 1,
				},
			],
		},
	],
}
