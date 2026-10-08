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
					md: 'Shows the image at `src` (any image URL) if it loads, otherwise initials from `name`. `size`: `sm`, `md`, `lg`. `shape`: `circle` (default), `rounded`, `square`.',
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
					md: 'Player with themed controls: play, seek, time, mute with a volume slider, playback speed and fullscreen, using the play, pause, volume and fullscreen icons with tooltips. The controls wrap onto a second row on narrow screens, so fullscreen is never cut off, and iPhone Safari (which can only fullscreen the video itself) is handled too. Pass `speeds` to change the rates offered. For several resolutions pass `sources` (`[{ label: "1080p", src }, { label: "4K", src }]`) instead of `src`: a quality menu appears and switching keeps your position and whether it was playing; `defaultQuality` picks the starting one. The controls float over the bottom of the video and fade out after `hideDelay` ms (default 2.5 s) without mouse, touch or keyboard activity while it plays, like YouTube; they stay while paused, hovered or focused, and `autoHide={false}` keeps them always visible. A spinner shows over the video when playback stalls to load more data (after a short delay, so brief hiccups do not flash it), and the seek bar shows how much is loaded. Extra props go to the `<video>` element; pass\n`<track>` children for captions.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'sound',
			name: 'Sound',
			blocks: [
				{
					md: "Audio player built from the library's own `Button`, `Slider` and `Select`: play / pause, a seek bar with a time popover and a loaded (buffered) band, a spinner while it waits for data, mute with a volume slider whose speaker icon follows the level, and playback speed. `title` and `artist` label the track, `art` shows cover art beside it, and `speeds` sets the rates offered. Extra props go to the `<audio>` element, and `<source>` children offer several formats.",
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
					md: 'Each child is a slide. Controlled via `index` + `onIndexChange` or uncontrolled via `defaultIndex`. `autoPlay` (ms)\npauses on hover and focus; `loop={false}` stops at the ends. Arrow keys work while it has focus. The previous and next buttons are icon buttons with tooltips, centred on the slides; the dots below jump to a slide.',
				},
				{
					example: 1,
				},
				{
					md: 'Slides can be anything: here each one is an `Image` with a caption laid over it.',
				},
				{
					example: 2,
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
