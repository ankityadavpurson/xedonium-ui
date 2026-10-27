import { Image } from 'xedonium'

export default function Demo() {
	return (
		<div className="grid max-w-2xl gap-4 sm:grid-cols-2">
			<Image src="/social-preview.png" alt="Xedonium preview, 16:9" ratio="video" />
			<Image src="/social-preview.png" alt="Xedonium preview, square" ratio="square" fit="contain" />
		</div>
	)
}
