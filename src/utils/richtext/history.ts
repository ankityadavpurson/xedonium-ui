// Undo and redo for the rich text editor: a stack of snapshots (the html and where the selection was), kept by the
// editor itself so it behaves the same in every browser and can be tested.

export interface PointPath {
	/** Child indexes from the editor root down to the node. */
	path: number[]
	offset: number
}

export interface SelectionPath {
	start: PointPath
	end: PointPath
}

export interface Snapshot {
	html: string
	selection: SelectionPath | null
}

const pathOf = (root: Node, node: Node): number[] => {
	const path: number[] = []
	for (let current: Node | null = node; current && current !== root; current = current.parentNode) {
		path.unshift(Array.prototype.indexOf.call(current.parentNode?.childNodes ?? [], current))
	}
	return path
}

const nodeAt = (root: Node, path: number[]): Node | null => {
	let node: Node | null = root
	for (const index of path) node = node?.childNodes[index] ?? null
	return node
}

/** Where the selection is, as paths that stay valid when the html is written back. `null` when it is outside `root`. */
export const captureSelection = (root: HTMLElement): SelectionPath | null => {
	const selection = window.getSelection?.()
	if (!selection || selection.rangeCount === 0) return null
	const range = selection.getRangeAt(0)
	if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null
	return {
		start: { path: pathOf(root, range.startContainer), offset: range.startOffset },
		end: { path: pathOf(root, range.endContainer), offset: range.endOffset },
	}
}

/** Puts the selection back where `captureSelection` found it. Returns whether it could. */
export const restoreSelection = (root: HTMLElement, saved: SelectionPath | null): boolean => {
	const selection = window.getSelection?.()
	if (!saved || !selection) return false
	const start = nodeAt(root, saved.start.path)
	const end = nodeAt(root, saved.end.path)
	if (!start || !end) return false
	const limit = (node: Node, offset: number) =>
		Math.min(offset, node.nodeType === 3 ? (node as Text).length : node.childNodes.length)
	const range = document.createRange()
	range.setStart(start, limit(start, saved.start.offset))
	range.setEnd(end, limit(end, saved.end.offset))
	selection.removeAllRanges()
	selection.addRange(range)
	return true
}

export interface History {
	/** Remember a new state. `coalesce` replaces the last state instead of adding one, when it came soon enough after it (typing). */
	record: (snapshot: Snapshot, coalesce?: boolean) => void
	undo: () => Snapshot | null
	redo: () => Snapshot | null
	canUndo: () => boolean
	canRedo: () => boolean
	/** Forget everything and start from `snapshot`. */
	reset: (snapshot: Snapshot) => void
}

export interface HistoryOptions {
	/** Most states kept (default `100`). */
	limit?: number
	/** Edits closer together than this many milliseconds, when asked to coalesce, share one undo step (default `500`). */
	window?: number
	/** The clock, for tests. */
	now?: () => number
}

export const createHistory = (
	initial: Snapshot,
	{ limit = 100, window: gap = 500, now = Date.now }: HistoryOptions = {}
): History => {
	let states: Snapshot[] = [initial]
	let index = 0
	let lastAt = 0

	return {
		record(snapshot, coalesce = false) {
			const current = states[index]
			if (snapshot.html === current.html) {
				// only the selection moved: keep it with the state, without a new step
				states[index] = { html: current.html, selection: snapshot.selection }
				return
			}
			const time = now()
			const merge = coalesce && index > 0 && index === states.length - 1 && time - lastAt < gap
			states = states.slice(0, index + 1)
			if (merge) states[index] = snapshot
			else {
				states.push(snapshot)
				if (states.length > limit) states.shift()
				index = states.length - 1
			}
			lastAt = coalesce ? time : 0
		},
		undo() {
			if (index === 0) return null
			index--
			lastAt = 0
			return states[index]
		},
		redo() {
			if (index >= states.length - 1) return null
			index++
			lastAt = 0
			return states[index]
		},
		canUndo: () => index > 0,
		canRedo: () => index < states.length - 1,
		reset(snapshot) {
			states = [snapshot]
			index = 0
			lastAt = 0
		},
	}
}
