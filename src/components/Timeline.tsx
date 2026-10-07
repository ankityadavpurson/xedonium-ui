import type { ReactNode } from 'react'

export type TimelineTone = 'default' | 'success' | 'warning' | 'danger'

export interface TimelineItem {
	key: string | number
	title: ReactNode
	description?: ReactNode
	time?: ReactNode
	tone?: TimelineTone
}

export interface TimelineProps {
	items: TimelineItem[]
	className?: string
}

const DOTS: Record<TimelineTone, string> = {
	default: 'bg-app-strong',
	success: 'bg-emerald-500',
	warning: 'bg-amber-400',
	danger: 'bg-red-500',
}

/** Vertical event list. items: [{ key, title, description?, time?, tone? }] with tone default | success | warning | danger. */
const Timeline = ({ items, className = '' }: TimelineProps) => (
	<ol className={`m-0 list-none p-0 ${className}`}>
		{items.map((item, index) => (
			<li key={item.key} className="relative flex gap-4 pb-6 last:pb-0">
				{index < items.length - 1 && (
					<span aria-hidden="true" className="absolute left-[0.3rem] top-4 bottom-0 w-px bg-app-border" />
				)}
				<span aria-hidden="true" className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 ${DOTS[item.tone ?? 'default']}`} />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-baseline justify-between gap-x-3">
						<span className="text-sm font-semibold text-app-text">{item.title}</span>
						{item.time && <time className="text-xs text-app-muted">{item.time}</time>}
					</div>
					{item.description && <p className="m-0 mt-0.5 text-sm text-app-muted">{item.description}</p>}
				</div>
			</li>
		))}
	</ol>
)

export default Timeline
