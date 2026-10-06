import { Image, Sound, Video } from 'xedonium'

const BASE =
	'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-start gap-3">
			<div className="w-60">
				<Image src="https://picsum.photos/seed/xed/400/300" alt="Sample" ratio="photo" />
			</div>
			<div className="w-60">
				<Image src="/missing.png" alt="Broken" ratio="photo" />
			</div>
			<div className="w-96">
				<Video
					title="Big Buck Bunny"
					sources={[
						{ label: '1080p', src: `${BASE}.1080p.vp9.webm` },
						{ label: '720p', src: `${BASE}.720p.vp9.webm` },
						{ label: '480p', src: `${BASE}.480p.vp9.webm` },
					]}
					defaultQuality="480p"
				/>
			</div>
			<div className="w-80">
				<Sound
					title="Moonlight Sonata"
					artist="Beethoven"
					src="https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c8/Example.ogg/Example.ogg.mp3"
				/>
			</div>
		</div>
	)
}
