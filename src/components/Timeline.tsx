import type { ReactNode } from 'react'

export type TimelineTone = 'default' | 'success' | 'warning' | 'danger'

export interface TimelineItem {
	key: string | number
	title: ReactNode
	description?: ReactNode
	time?: ReactNode
	tone?: TimelineTone
	/** The branch (lane) this event sits on. Events without one sit on the main lane. */
	branch?: string
	/** On the first event of a branch: the branch it splits off from (default: the main lane). */
	forkFrom?: string
	/** Branch id(s) that join this event's branch here; each of them ends on this row. */
	mergeFrom?: string | string[]
}

export interface TimelineBranch {
	id: string
	/** Shown beside the first event of the branch. */
	label?: ReactNode
}

export type TimelineOrientation = 'vertical' | 'horizontal'

export interface TimelineProps {
	items: TimelineItem[]
	/** `vertical` (default) stacks events top to bottom; `horizontal` runs them left to right, with the branch lanes as rows. */
	orientation?: TimelineOrientation
	/** Orders the lanes (the first one is the main lane, the rest follow outwards from it) and labels them. */
	branches?: TimelineBranch[]
	className?: string
}

const DOTS: Record<TimelineTone, string> = {
	default: 'bg-app-strong',
	success: 'bg-emerald-500',
	warning: 'bg-amber-400',
	danger: 'bg-red-500',
}

// one color per lane, used for its line and for the dots that have no tone of their own
const LANES = ['bg-app-strong', 'bg-sky-500', 'bg-violet-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500']

const MAIN = 'main'
const LANE_WIDTH = 20
// odd, so a 1px line can run through the exact middle of a dot
const DOT = 11
// where the lines that run through the dots' centers sit along the timeline: vertically the dots are 6px below the
// top of a row, horizontally they start at the left edge of a column
const CENTER = { vertical: 11, horizontal: 5 }
// space between the graph and the text
const GAP = 16

const asList = (value?: string | string[]) => (value === undefined ? [] : Array.isArray(value) ? value : [value])

/**
 * Event list, vertical by default or horizontal with `orientation`. items: [{ key, title, description?, time?, tone? }] with tone default | success | warning | danger.
 * Give events a `branch` for a branched, git-graph style timeline: the lanes are laid out left to right (order and labels
 * from `branches`), the first event of a branch splits off the `forkFrom` lane (default: the main one), and an event with
 * `mergeFrom` joins those branches back in, ending them on its row (its column when horizontal).
 */
const Timeline = ({ items, branches, orientation = 'vertical', className = '' }: TimelineProps) => {
	const horizontal = orientation === 'horizontal'
	const center = CENTER[orientation]
	const laneOf = (item: TimelineItem) => item.branch ?? MAIN
	const order: string[] = []
	const add = (id: string) => {
		if (!order.includes(id)) order.push(id)
	}
	branches?.forEach(branch => add(branch.id))
	if (items.some(item => item.branch === undefined)) add(MAIN)
	items.forEach(item => add(laneOf(item)))
	const lanes = order.length
	const laneIndex = (id: string | undefined) => Math.max(0, order.indexOf(id ?? MAIN))
	const labels = new Map(branches?.map(branch => [branch.id, branch.label]))

	// the rows each lane is alive for, and where each branch splits off
	const start = order.map(() => Infinity)
	const end = order.map(() => -Infinity)
	const forkRow = new Map<number, number>()
	items.forEach((item, row) => {
		const lane = laneIndex(laneOf(item))
		if (start[lane] === Infinity) {
			start[lane] = row
			if (lane !== 0) forkRow.set(lane, laneIndex(item.forkFrom))
		}
		end[lane] = Math.max(end[lane], row)
		asList(item.mergeFrom).forEach(id => {
			const merged = laneIndex(id)
			if (merged !== lane && row >= start[merged]) end[merged] = Math.max(end[merged], row)
		})
	})
	forkRow.forEach((parent, lane) => {
		if (parent === lane) return
		start[parent] = Math.min(start[parent], start[lane])
		end[parent] = Math.max(end[parent], start[lane])
	})

	const branched = lanes > 1
	const gutter = (lanes - 1) * LANE_WIDTH + DOT
	const x = (lane: number) => lane * LANE_WIDTH + DOT / 2
	const lineColor = (lane: number) => (branched ? LANES[lane % LANES.length] : 'bg-app-border')

	return (
		<ol className={`m-0 list-none p-0 ${horizontal ? 'flex overflow-x-auto' : ''} ${className}`}>
			{items.map((item, row) => {
				const lane = laneIndex(laneOf(item))
				const firstOfLane = start[lane] === row
				const label = firstOfLane ? labels.get(laneOf(item)) : undefined
				const parent = forkRow.get(lane)
				const merges = asList(item.mergeFrom)
					.map(id => laneIndex(id))
					.filter(merged => merged !== lane && start[merged] <= row && end[merged] === row)
				// a line between two lanes, across the timeline
				const connector = (from: number, color: string) => {
					const near = x(Math.min(from, lane)) - 0.5
					const length = Math.abs(x(lane) - x(from)) + 1
					return (
						<span
							key={from}
							className={`absolute ${horizontal ? 'w-px' : 'h-px'} ${color}`}
							style={
								horizontal ? { top: near, height: length, left: center } : { left: near, width: length, top: center }
							}
						/>
					)
				}
				return (
					<li
						key={item.key}
						className={`relative ${horizontal ? 'min-w-[11rem] flex-1 pr-6 last:pr-0' : 'pb-6 last:pb-0'}`}
					>
						<span
							aria-hidden="true"
							className={`absolute ${horizontal ? 'inset-x-0 top-0' : 'inset-y-0 left-0'}`}
							style={horizontal ? { height: gutter } : { width: gutter }}
						>
							{order.map((_, l) => {
								if (row < start[l] || row > end[l] || start[l] === end[l]) return null
								const from = row === start[l] ? center : 0
								const to = row === end[l] ? `calc(100% - ${center + 1}px)` : 0
								return (
									<span
										key={l}
										className={`absolute ${horizontal ? 'h-px' : 'w-px'} ${lineColor(l)}`}
										style={
											horizontal
												? { top: x(l) - 0.5, left: from, right: to }
												: { left: x(l) - 0.5, top: from, bottom: to }
										}
									/>
								)
							})}
							{parent !== undefined && firstOfLane && parent !== lane && connector(parent, lineColor(lane))}
							{merges.map(merged => connector(merged, lineColor(merged)))}
							<span
								className={`absolute h-[11px] w-[11px] ${item.tone ? DOTS[item.tone] : branched ? LANES[lane % LANES.length] : DOTS.default}`}
								style={horizontal ? { top: lane * LANE_WIDTH, left: 0 } : { left: lane * LANE_WIDTH, top: 6 }}
							/>
						</span>
						<div className="min-w-0" style={horizontal ? { paddingTop: gutter + GAP } : { paddingLeft: gutter + GAP }}>
							<div className="flex flex-wrap items-baseline justify-between gap-x-3">
								<span className="text-sm font-semibold text-app-text">
									{item.title}
									{label && (
										<span className="ml-2 border border-app-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-app-soft">
											{label}
										</span>
									)}
								</span>
								{item.time && <time className="text-xs text-app-muted">{item.time}</time>}
							</div>
							{item.description && <p className="m-0 mt-0.5 text-sm text-app-muted">{item.description}</p>}
						</div>
					</li>
				)
			})}
		</ol>
	)
}

export default Timeline
