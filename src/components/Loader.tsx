import type { ReactNode } from 'react'
import type { Size } from '../types'
import FanFavicon from './FanFavicon'
import HelperText from './HelperText'

export type LoaderVariant = 'fan' | 'spinner' | 'dots' | 'shimmer' | 'inline' | 'stacked' | 'card'
export type IconMotion = 'spin' | 'pulse' | 'bounce' | 'none'

export interface LoaderProps {
	variant?: LoaderVariant
	size?: Size
	/** Loading text (screen readers only for `spinner`). */
	label?: string
	/** Helper line under the label (`card` only). */
	description?: string
	/** Custom mark instead of the built-in fan or ring: an emoji, an image URL or path, or an element such as an inline `<svg>`. Ignored by `dots` and `shimmer`. */
	icon?: ReactNode
	/** How the custom icon animates. */
	iconMotion?: IconMotion
	className?: string
}

const FAN: Record<Size, number> = { sm: 32, md: 64, lg: 96 }
const RING: Record<Size, number> = { sm: 16, md: 32, lg: 48 }
const TEXT: Record<Size, string> = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

// Circular progress: a ring track with a quarter-circle arc spinning around it
const Spinner = ({ size }: { size: number }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2.5"
		className="shrink-0 animate-spin"
	>
		<circle cx="12" cy="12" r="9" className="stroke-app-border" />
		<path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="butt" className="stroke-app-strong" />
	</svg>
)

const MOTION: Record<IconMotion, string> = {
	spin: 'animate-spin',
	pulse: 'animate-pulse',
	bounce: 'animate-bounce',
	none: '',
}

// A string is an image when it is a URL or path (http(s), data:, /, ./, ../) or ends in an image extension;
// anything else is shown as text, which is what makes an emoji work
const IMAGE_SRC = /^(https?:|data:image\/|blob:|\/|\.{1,2}\/)|\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i

// Custom mark: an emoji, an image URL, or an element such as an inline <svg>, sized to the loader and animated
const CustomMark = ({ icon, size, motion }: { icon: ReactNode; size: number; motion: IconMotion }) => {
	const box = `inline-flex shrink-0 items-center justify-center ${MOTION[motion] ?? MOTION.spin}`
	if (typeof icon === 'string' && IMAGE_SRC.test(icon)) {
		return <img src={icon} alt="" width={size} height={size} className={`${box} object-contain`} />
	}
	if (typeof icon === 'string') {
		return (
			<span
				aria-hidden="true"
				className={box}
				style={{ width: size, height: size, fontSize: size * 0.8, lineHeight: 1 }}
			>
				{icon}
			</span>
		)
	}
	return (
		<span aria-hidden="true" className={`${box} [&>svg]:h-full [&>svg]:w-full`} style={{ width: size, height: size }}>
			{icon}
		</span>
	)
}

const Dots = () => (
	<span aria-hidden="true" className="inline-flex">
		<span className="xd-dot">.</span>
		<span className="xd-dot">.</span>
		<span className="xd-dot">.</span>
	</span>
)

/**
 * Loading indicator in seven styles. `variant`:
 * - `fan` (default): the spinning FanFavicon with the label under it.
 * - `spinner`: circular progress ring.
 * - `dots`: the label followed by three pulsing dots.
 * - `shimmer`: the label with a light sweeping across it.
 * - `inline`: spinner beside the label.
 * - `stacked`: spinner above a centered label.
 * - `card`: bordered panel with spinner, label as the title and an optional `description` line.
 * `icon` swaps the built-in spinner or fan for your own mark: an emoji (`"🚀"`), an image URL or path
 * (`"/logo.png"`, `"data:image/svg+xml,..."`) or an element such as an inline `<svg>`. `iconMotion` animates it
 * (`spin` default, `pulse`, `bounce`, `none`). `dots` and `shimmer` have no mark, so they ignore `icon`.
 * `size` is sm | md | lg. The loader is a polite live region (`role="status"`); only `spinner` has no visible text,
 * so its `label` is read to screen readers only.
 */
const Loader = ({
	variant = 'fan',
	size = 'md',
	label = 'Loading',
	description,
	icon,
	iconMotion = 'spin',
	className = '',
}: LoaderProps) => {
	const text = TEXT[size]
	const ring = RING[size]
	const hasIcon = icon !== undefined && icon !== null && icon !== ''
	// The mark of every variant that has one: your icon when given, the built-in ring otherwise
	const mark = hasIcon ? <CustomMark icon={icon} size={ring} motion={iconMotion} /> : <Spinner size={ring} />

	let content: ReactNode
	switch (variant) {
		case 'spinner':
			content = (
				<>
					{mark}
					<span className="sr-only">{label}</span>
				</>
			)
			break
		case 'dots':
			content = (
				<span className={`${text} whitespace-nowrap font-semibold text-app-text`}>
					{label}
					<Dots />
				</span>
			)
			break
		case 'shimmer':
			content = <span className={`${text} xd-shimmer font-semibold`}>{label}</span>
			break
		case 'inline':
			content = (
				<span className="inline-flex items-center gap-2">
					{mark}
					<span className={`${text} text-app-text`}>{label}</span>
				</span>
			)
			break
		case 'stacked':
			content = (
				<span className="flex flex-col items-center gap-3 text-center">
					{mark}
					<span className={`${text} text-app-text`}>{label}</span>
				</span>
			)
			break
		case 'card':
			content = (
				<span className="flex w-full max-w-xs items-center gap-4 border border-app-border bg-app-card p-4">
					{mark}
					<span className="flex min-w-0 flex-col gap-0.5">
						<span className={`${text} font-semibold text-app-text`}>{label}</span>
						{description && <HelperText as="span">{description}</HelperText>}
					</span>
				</span>
			)
			break
		default:
			content = (
				<span className="flex flex-col items-center gap-3 text-center">
					{hasIcon ? <CustomMark icon={icon} size={FAN[size]} motion={iconMotion} /> : <FanFavicon size={FAN[size]} />}
					<span className={`${text} text-app-text`}>{label}</span>
				</span>
			)
	}

	return (
		<div role="status" className={`inline-flex items-center justify-center ${className}`}>
			{content}
		</div>
	)
}

export default Loader
