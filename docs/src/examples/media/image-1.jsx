import { Image } from 'xedonium'

export default function Demo() {
	return (
		<div className="max-w-xs">
			<Image src="/missing.png" alt="Example" ratio="video" fallback="No image" />
		</div>
	)
}
