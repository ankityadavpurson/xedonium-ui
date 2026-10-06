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
					md: '**Linear.** `variant="linear"` (the default) draws a bar: `value` is 0-100, `showValue` prints the percentage beside the label and `label` goes above. Without a `value` the bar slides back and forth; `size` does not apply.',
				},
				{
					example: 1,
				},
				{
					md: '**Circular.** `variant="circular"` draws a ring instead of a bar: `size` is `sm`, `md` or `lg`, `showValue` prints the percentage in the middle and `label` goes underneath. Without a `value` the ring spins.',
				},
				{
					example: 2,
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
					md: '`Loader` is the loading indicator, in seven styles chosen with `variant`: the spinning `fan` with its label underneath (the default, built on `FanFavicon`), a circular `spinner`, text loaders (`dots` and `shimmer`) and spinner-with-text layouts (`inline`, `stacked`, `card`). It is a polite live region (`role="status"`): the `spinner`, which shows no text, reads its `label` to screen readers only.',
				},
				{
					example: 1,
				},
				{
					md: '`size` is `sm`, `md` or `lg`.',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'loading-screen',
			name: 'LoadingScreen',
			blocks: [
				{
					md: 'Full-page centered `Loader`: use it while a whole page (or the app) is loading. It takes the same `variant`, `size`, `label` and `description` as [Loader](/components/feedback/loaders) and shows the fan by default.\n\nIt fills the space of its parent, so give it a full-height container; the example below shows it inside a fixed-height box.',
				},
				{
					example: 1,
				},
				{
					md: 'To see it the way your users will, open it as a whole page:',
				},
				{
					custom: 'full-page-preview',
				},
			],
		},
	],
}
