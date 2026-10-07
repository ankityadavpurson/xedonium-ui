export interface SkeletonProps {
	/** Render a paragraph of this many text lines instead of one block. */
	lines?: number
	/** Round placeholder (e.g. avatars). */
	circle?: boolean
	/** Size the placeholder with classes. */
	className?: string
}

/** Loading placeholder. Size it with classes (`h-4 w-40`); `lines` renders a paragraph of text lines. */
const Skeleton = ({ lines, circle = false, className = 'h-4 w-full' }: SkeletonProps) => {
	if (lines) {
		return (
			<div aria-hidden="true" className="flex flex-col gap-2">
				{Array.from({ length: lines }, (_, i) => (
					<div key={i} className={`h-3 animate-pulse bg-app-border ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
				))}
			</div>
		)
	}
	return (
		<div aria-hidden="true" className={`animate-pulse bg-app-border ${circle ? 'rounded-full' : ''} ${className}`} />
	)
}

export default Skeleton
