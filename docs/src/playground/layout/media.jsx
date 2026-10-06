import { Image, Video } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-start gap-3">
			<div className="w-60">
				<Image src="https://picsum.photos/seed/xed/400/300" alt="Sample" ratio="photo" />
			</div>
			<div className="w-60">
				<Image src="/missing.png" alt="Broken" ratio="photo" />
			</div>
			<div className="w-80">
				<Video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" title="Flower" />
			</div>
		</div>
	)
}
