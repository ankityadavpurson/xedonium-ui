import { Video } from 'xedonium'

// Big Buck Bunny (Blender Foundation, CC BY 3.0) in six resolutions up to 4K, from Wikimedia Commons
const BASE =
	'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm'

const sources = [
	{ label: '4K', src: `${BASE}.2160p.vp9.webm` },
	{ label: '1440p', src: `${BASE}.1440p.vp9.webm` },
	{ label: '1080p', src: `${BASE}.1080p.vp9.webm` },
	{ label: '720p', src: `${BASE}.720p.vp9.webm` },
	{ label: '480p', src: `${BASE}.480p.vp9.webm` },
	{ label: '360p', src: `${BASE}.360p.vp9.webm` },
]

export default function Demo() {
	return (
		<div className="max-w-2xl">
			<Video title="Big Buck Bunny" sources={sources} defaultQuality="720p" />
		</div>
	)
}
