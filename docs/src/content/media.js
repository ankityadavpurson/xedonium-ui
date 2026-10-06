export default {
	slug: 'media',
	label: 'Media',
	description: 'Images, avatars, video and carousels.',
	components: [
		{
			slug: 'avatar',
			name: 'Avatar',
			blocks: [
				{
					md: 'Shows the image at `src` (any image URL) if it loads, otherwise initials from `name`. `size`: `sm`, `md`, `lg`.',
				},
				{
					example: 1,
				},
				{
					md: '**Images, custom content and links.** Pass `children` (an icon or your own `<img>`) to show it instead of the initials, and `href` to make the avatar a link to a profile or page. `target`, `rel` and `onClick` go to the link, and `linkComponent` / `linkProp` swap in a router link like `AppBar`. The order is: image, then `children`, then initials. `name` is the accessible name, for the link too.',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'video',
			name: 'Video',
			blocks: [
				{
					md: 'Player with themed controls: play, seek, time, mute and fullscreen. Extra props go to the `<video>` element; pass\n`<track>` children for captions.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'carousel',
			name: 'Carousel',
			blocks: [
				{
					md: 'Each child is a slide. Controlled via `index` + `onIndexChange` or uncontrolled via `defaultIndex`. `autoPlay` (ms)\npauses on hover and focus; `loop={false}` stops at the ends. Arrow keys work while it has focus.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'image',
			name: 'Image',
			blocks: [
				{
					md: '`ratio`: `square`, `video`, `photo`. Falls back to a labelled box if loading fails.',
				},
				{
					example: 1,
				},
			],
		},
	],
}
