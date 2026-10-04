import { useState } from 'react'

const RATIOS = { square: 'aspect-square', video: 'aspect-video', photo: 'aspect-[4/3]' }

/** Image with optional fixed `ratio` (square | video | photo), lazy loading and a fallback box if it fails. */
const Image = ({ src, alt, ratio, fit = 'cover', fallback = 'Image unavailable', className = '', ...rest }) => {
	const [failed, setFailed] = useState(false)
	const box = `${ratio ? RATIOS[ratio] : ''} ${className}`

	if (failed) {
		return (
			<div
				role="img"
				aria-label={alt}
				className={`flex items-center justify-center border border-app-border bg-app-bg p-4 text-xs text-app-muted ${box}`}
			>
				{fallback}
			</div>
		)
	}
	return (
		<img
			src={src}
			alt={alt}
			loading="lazy"
			onError={() => setFailed(true)}
			className={`block w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${box}`}
			{...rest}
		/>
	)
}

export default Image
