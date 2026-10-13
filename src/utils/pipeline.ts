// Layout for a job dependency graph (PipelineGraph): which column and row every node sits in, and which edges join them.
// Pure and DOM-free. Column = longest path from a root; row = branch. A node's first dependent stays on its row and the
// others open new rows below, so a fan-out becomes parallel lanes.

export interface PipelineLayoutInput {
	id: string
	needs?: string[]
}

export interface PipelinePlacement {
	id: string
	col: number
	row: number
}

export interface PipelineEdge {
	from: string
	to: string
}

export interface PipelineLayout {
	nodes: PipelinePlacement[]
	edges: PipelineEdge[]
	cols: number
	rows: number
}

/**
 * Places `nodes` (`{ id, needs? }`) on a grid. An unknown id in `needs`, a node needing itself and a repeated dependency
 * are ignored, the first of two nodes with the same id wins, and a cycle never hangs: the dependency that would close
 * the loop is dropped (no edge for it).
 */
export const layoutPipeline = (nodes: PipelineLayoutInput[]): PipelineLayout => {
	const order: string[] = []
	const needs = new Map<string, string[]>()
	nodes.forEach(node => {
		if (!needs.has(node.id)) {
			order.push(node.id)
			needs.set(node.id, node.needs ?? [])
		}
	})
	needs.forEach((list, id) =>
		needs.set(
			id,
			[...new Set(list)].filter(dep => dep !== id && needs.has(dep))
		)
	)

	// Depth-first walk that drops any dependency back into the path being walked (a cycle)
	const depth = new Map<string, number>()
	const kept = new Map<string, string[]>()
	const visiting = new Set<string>()
	const walk = (id: string): number => {
		const known = depth.get(id)
		if (known !== undefined) return known
		visiting.add(id)
		const deps = (needs.get(id) ?? []).filter(dep => !visiting.has(dep))
		const result = deps.reduce((max, dep) => Math.max(max, walk(dep) + 1), 0)
		visiting.delete(id)
		kept.set(id, deps)
		depth.set(id, result)
		return result
	}
	order.forEach(walk)

	// Left to right, so a parent is always placed before its dependents
	const sorted = [...order].sort((a, b) => depth.get(a)! - depth.get(b)! || order.indexOf(a) - order.indexOf(b))
	const rowOf = new Map<string, number>()
	const taken = new Set<string>() // parents whose first dependent has been placed
	const occupied = new Set<string>()
	let rows = 0
	sorted.forEach(id => {
		const col = depth.get(id)!
		const parent = (kept.get(id) ?? []).find(dep => !taken.has(dep))
		let row = parent === undefined ? rows : rowOf.get(parent)!
		if (parent !== undefined) taken.add(parent)
		if (occupied.has(`${col}:${row}`)) row = rows
		occupied.add(`${col}:${row}`)
		rowOf.set(id, row)
		rows = Math.max(rows, row + 1)
	})

	return {
		nodes: order.map(id => ({ id, col: depth.get(id)!, row: rowOf.get(id)! })),
		edges: order.flatMap(id => (kept.get(id) ?? []).map(dep => ({ from: dep, to: id }))),
		cols: order.length ? Math.max(...order.map(id => depth.get(id)!)) + 1 : 0,
		rows,
	}
}
