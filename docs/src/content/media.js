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
					md: 'Shows the image if it loads, otherwise initials. `size`: `sm`, `md`, `lg`.',
				},
				{
					example: 1,
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
