import { useState } from 'react'

const SIZES = { sm: 'h-6 w-6 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-14 w-14 text-base' }

const initialsOf = name =>
	(name ?? '')
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map(part => part[0].toUpperCase())
		.join('')

/**
 * Round avatar. What it shows, in order: the image at `src` (any image URL) if it loads, then `children` (your own
 * content, e.g. an icon or an <img>), then initials from `name`. size: sm | md | lg.
 * Pass `href` to make it a link to a profile or page; `linkComponent` / `linkProp` swap in a router link as in AppBar,
 * and other props (target, rel, onClick...) go to the link. `name` is the accessible name either way.
 */
const Avatar = ({
	src,
	alt = '',
	name,
	size = 'md',
	href,
	linkComponent: Link = 'a',
	linkProp = 'href',
	className = '',
	children,
	...rest
}) => {
	const [failedSrc, setFailedSrc] = useState(null)
	const showImage = src && failedSrc !== src
	const linked = href !== undefined

	const circle = (
		<span
			{...(linked ? {} : { role: 'img', 'aria-label': name, ...rest })}
			className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-app-border bg-app-bg font-semibold uppercase tracking-wider text-app-soft ${SIZES[size]} ${linked ? '' : className}`}
		>
			{showImage ? (
				<img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setFailedSrc(src)} />
			) : (
				(children ?? (initialsOf(name) || '?'))
			)}
		</span>
	)

	if (!linked) return circle

	return (
		<Link
			{...{ [linkProp]: href }}
			aria-label={name}
			className={`inline-flex shrink-0 rounded-full transition hover:opacity-80 ${className}`}
			{...rest}
		>
			{circle}
		</Link>
	)
}

export default Avatar
