import { useState } from 'react'

const SIZES = { sm: 'h-6 w-6 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-14 w-14 text-base' }

const initialsOf = name =>
	(name ?? '')
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map(part => part[0].toUpperCase())
		.join('')

/** Round avatar: image when `src` loads, otherwise initials from `name`. size: sm | md | lg. */
const Avatar = ({ src, name, size = 'md', className = '' }) => {
	const [failed, setFailed] = useState(false)
	const showImage = src && !failed
	return (
		<span
			role="img"
			aria-label={name}
			className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-app-border bg-app-bg font-semibold uppercase tracking-wider text-app-soft ${SIZES[size]} ${className}`}
		>
			{showImage ? (
				<img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
			) : (
				initialsOf(name) || '?'
			)}
		</span>
	)
}

export default Avatar
