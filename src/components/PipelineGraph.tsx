import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type MouseEvent,
	type PointerEvent as ReactPointerEvent,
	type ReactNode,
} from 'react'
import { layoutPipeline } from '../utils/pipeline'
import BanIcon from './icons/Ban'
import CheckCircleIcon from './icons/CheckCircle'
import ClockIcon from './icons/Clock'
import MinusIcon from './icons/Minus'
import XCircleIcon from './icons/XCircle'

export type PipelineStatus = 'queued' | 'running' | 'success' | 'failed' | 'skipped' | 'cancelled'

export interface PipelineNode {
	id: string
	label: ReactNode
	status: PipelineStatus
	/** Shown under the label, e.g. '2m 25s'. */
	duration?: ReactNode
	/** Ids of the nodes this one waits for. Unknown ids are ignored. */
	needs?: string[]
	/** Replaces the status icon (the status still sets the border and the accessible name). */
	icon?: ReactNode
	/** A second line under the label, above the duration. */
	description?: ReactNode
	/** Content at the right edge of the node, e.g. a badge or an avatar. */
	trailing?: ReactNode
	/** Extra classes for this node's button, e.g. to recolor its border or background. */
	className?: string
	/** Accessible name; by default the label (when it is text, else the id), the status and the duration. */
	ariaLabel?: string
	/** Tooltip (default: the status). */
	title?: string
	/** Not clickable, and skipped by the keyboard. */
	disabled?: boolean
}

/** What `renderNode` receives besides the node. */
export interface PipelineNodeState {
	selected: boolean
	/** The default status icon (or the node's own `icon`), so a custom node can keep it. */
	icon: ReactNode
}

export interface PipelineGraphProps {
	nodes: PipelineNode[]
	onNodeClick?: (node: PipelineNode) => void
	/** Id of the highlighted node. */
	selectedId?: string | null
	/** Replaces the inside of a node (the status icon, label and duration). */
	renderNode?: (node: PipelineNode, state: PipelineNodeState) => ReactNode
	nodeWidth?: number
	nodeHeight?: number
	/** Space between columns / rows, in px. */
	gapX?: number
	gapY?: number
	/** Shown when there are no nodes (nothing is rendered by default). */
	emptyText?: ReactNode
	/** Accessible name of the graph (default 'Pipeline'). */
	'aria-label'?: string
	className?: string
}

const STATUS_TEXT: Record<PipelineStatus, string> = {
	queued: 'queued',
	running: 'running',
	success: 'success',
	failed: 'failed',
	skipped: 'skipped',
	cancelled: 'cancelled',
}

const BORDER: Record<PipelineStatus, string> = {
	queued: 'border-app-border',
	running: 'border-app-strong',
	success: 'border-app-border',
	failed: 'border-red-500',
	skipped: 'border-app-border border-dashed',
	cancelled: 'border-app-border border-dashed',
}

const ICON_TONE: Record<PipelineStatus, string> = {
	queued: 'text-app-muted',
	running: 'text-app-strong',
	success: 'text-emerald-600 dark:text-emerald-400',
	failed: 'text-red-500',
	skipped: 'text-app-muted',
	cancelled: 'text-app-muted',
}

const DRAG_THRESHOLD = 4
const PADDING = 8
/** Side of the square dots where a connector meets a node, in px. */
const PORT = 6

const Spinner = () => (
	<svg
		aria-hidden="true"
		focusable="false"
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2.5"
		className="h-4 w-4 animate-spin"
	>
		<circle cx="12" cy="12" r="9" className="stroke-app-border" />
		<path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="butt" className="stroke-current" />
	</svg>
)

const StatusIcon = ({ status }: { status: PipelineStatus }) => {
	const className = 'h-4 w-4'
	switch (status) {
		case 'running':
			return <Spinner />
		case 'success':
			return <CheckCircleIcon className={className} />
		case 'failed':
			return <XCircleIcon className={className} />
		case 'skipped':
			return <MinusIcon className={className} />
		case 'cancelled':
			return <BanIcon className={className} />
		default:
			return <ClockIcon className={className} />
	}
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Job dependency graph, left to right like the workflow view on GitHub Actions. `nodes`: `{ id, label, status, duration?,
 * needs? }` with status queued | running | success | failed | skipped | cancelled. The column is the longest path from a
 * root; the first dependent of a node stays on its row and the others open new rows. Nodes are buttons (`onNodeClick`,
 * `selectedId`); `renderNode` swaps the node content. When the graph is larger than its container (give it a width or
 * height with `className`) drag, or touch-drag, to pan; a drag does not click a node.
 */
const PipelineGraph = ({
	nodes,
	onNodeClick,
	selectedId,
	renderNode,
	nodeWidth = 176,
	nodeHeight = 52,
	gapX = 48,
	gapY = 16,
	emptyText,
	'aria-label': ariaLabel = 'Pipeline',
	className = '',
}: PipelineGraphProps) => {
	const layout = useMemo(() => layoutPipeline(nodes), [nodes])
	const byId = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes])
	const place = useMemo(() => new Map(layout.nodes.map(p => [p.id, p])), [layout])

	const width = layout.cols * nodeWidth + Math.max(0, layout.cols - 1) * gapX + PADDING * 2
	const height = layout.rows * nodeHeight + Math.max(0, layout.rows - 1) * gapY + PADDING * 2
	const left = (col: number) => PADDING + col * (nodeWidth + gapX)
	const top = (row: number) => PADDING + row * (nodeHeight + gapY)

	const frame = useRef<HTMLDivElement>(null)
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const [view, setView] = useState({ width: 0, height: 0 })
	const [dragging, setDragging] = useState(false)
	const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 })
	const suppressClick = useRef(false)

	// How far the content can move: it can only be dragged by the part that does not fit
	const minX = Math.min(0, view.width - width)
	const minY = Math.min(0, view.height - height)
	const pannable = minX < 0 || minY < 0

	useEffect(() => {
		const element = frame.current
		if (!element) return
		const measure = () => setView({ width: element.clientWidth, height: element.clientHeight })
		measure()
		if (typeof ResizeObserver === 'undefined') return
		const observer = new ResizeObserver(measure)
		observer.observe(element)
		return () => observer.disconnect()
	}, [])

	// Keep the content inside its frame when either of them changes size
	useEffect(() => {
		setOffset(current => {
			const x = clamp(current.x, minX, 0)
			const y = clamp(current.y, minY, 0)
			return x === current.x && y === current.y ? current : { x, y }
		})
	}, [minX, minY])

	const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (!pannable || (event.pointerType === 'mouse' && event.button !== 0)) return
		drag.current = {
			active: true,
			moved: false,
			startX: event.clientX,
			startY: event.clientY,
			originX: offset.x,
			originY: offset.y,
		}
		suppressClick.current = false
	}

	const move = useCallback(
		(event: PointerEvent) => {
			const state = drag.current
			if (!state.active) return
			const dx = event.clientX - state.startX
			const dy = event.clientY - state.startY
			if (!state.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
			if (!state.moved) {
				state.moved = true
				setDragging(true)
			}
			setOffset({ x: clamp(state.originX + dx, minX, 0), y: clamp(state.originY + dy, minY, 0) })
		},
		[minX, minY]
	)

	const end = useCallback(() => {
		if (!drag.current.active) return
		suppressClick.current = drag.current.moved
		drag.current.active = false
		setDragging(false)
	}, [])

	useEffect(() => {
		window.addEventListener('pointermove', move)
		window.addEventListener('pointerup', end)
		window.addEventListener('pointercancel', end)
		return () => {
			window.removeEventListener('pointermove', move)
			window.removeEventListener('pointerup', end)
			window.removeEventListener('pointercancel', end)
		}
	}, [move, end])

	// A drag ends with a click on whatever is under the pointer: swallow that one
	const onClickCapture = (event: MouseEvent) => {
		if (!suppressClick.current) return
		suppressClick.current = false
		event.stopPropagation()
		event.preventDefault()
	}

	// Tabbing to a node scrolls it into view
	const reveal = (col: number, row: number) => {
		if (!pannable) return
		// the part of the node that sticks out of the frame on each axis
		const out = (start: number, size: number, shift: number, room: number) => {
			const at = start + shift
			return at < 0 ? -at : at + size > room ? room - (at + size) : 0
		}
		setOffset(current => ({
			x: clamp(current.x + out(left(col), nodeWidth, current.x, view.width), minX, 0),
			y: clamp(current.y + out(top(row), nodeHeight, current.y, view.height), minY, 0),
		}))
	}

	if (!nodes.length) return emptyText ? <p className="m-0 text-sm text-app-muted">{emptyText}</p> : null

	return (
		<div
			ref={frame}
			role="region"
			aria-label={ariaLabel}
			onPointerDown={onPointerDown}
			onClickCapture={onClickCapture}
			style={{ touchAction: pannable ? 'none' : undefined }}
			className={`relative max-w-full select-none overflow-hidden ${pannable ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''} ${className}`}
		>
			<div
				data-testid="pipeline-canvas"
				className="relative"
				style={{ width, height, transform: `translate(${offset.x}px, ${offset.y}px)` }}
			>
				<svg
					aria-hidden="true"
					focusable="false"
					width={width}
					height={height}
					className="absolute left-0 top-0"
					fill="none"
				>
					{layout.edges.map(({ from, to }) => {
						const a = place.get(from)!
						const b = place.get(to)!
						const x1 = left(a.col) + nodeWidth
						const y1 = top(a.row) + nodeHeight / 2
						const x2 = left(b.col)
						const y2 = top(b.row) + nodeHeight / 2
						const mid = x2 - gapX / 2
						return (
							<g key={`${from}->${to}`}>
								<path d={`M${x1} ${y1}H${mid}V${y2}H${x2}`} strokeWidth="1.5" className="stroke-app-border" />
								<rect
									x={x1 - PORT / 2}
									y={y1 - PORT / 2}
									width={PORT}
									height={PORT}
									strokeWidth="1.5"
									className="fill-app-card stroke-app-border"
								/>
								<rect
									x={x2 - PORT / 2}
									y={y2 - PORT / 2}
									width={PORT}
									height={PORT}
									strokeWidth="1.5"
									className="fill-app-card stroke-app-border"
								/>
							</g>
						)
					})}
				</svg>
				{layout.nodes.map(({ id, col, row }) => {
					const node = byId.get(id)!
					const selected = id === selectedId
					const text = typeof node.label === 'string' ? node.label : id
					const icon = node.icon ?? (
						<span className={`shrink-0 ${ICON_TONE[node.status]}`}>
							<StatusIcon status={node.status} />
						</span>
					)
					return (
						<button
							key={id}
							type="button"
							draggable={false}
							onClick={() => onNodeClick?.(node)}
							onFocus={() => reveal(col, row)}
							aria-current={selected ? 'true' : undefined}
							disabled={node.disabled}
							aria-label={
								node.ariaLabel ??
								`${text}, ${STATUS_TEXT[node.status]}${
									typeof node.duration === 'string' || typeof node.duration === 'number' ? `, ${node.duration}` : ''
								}`
							}
							title={node.title ?? STATUS_TEXT[node.status]}
							style={{ left: left(col), top: top(row), width: nodeWidth, height: nodeHeight }}
							className={`absolute m-0 flex items-center gap-2 border bg-app-card px-3 text-left text-app-text outline-none transition hover:bg-app-bg focus-visible:ring-2 focus-visible:ring-app-strong ${
								BORDER[node.status]
							} ${selected ? 'ring-2 ring-app-strong' : ''} ${node.disabled ? 'cursor-not-allowed opacity-60' : ''} ${
								node.className ?? ''
							}`}
						>
							{renderNode ? (
								renderNode(node, { selected, icon })
							) : (
								<>
									{icon}
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-semibold">{node.label}</span>
										{node.description != null && (
											<span className="block truncate text-xs text-app-soft">{node.description}</span>
										)}
										{node.duration != null && (
											<span className="block truncate text-xs text-app-muted">{node.duration}</span>
										)}
									</span>
									{node.trailing != null && <span className="shrink-0">{node.trailing}</span>}
								</>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default PipelineGraph
