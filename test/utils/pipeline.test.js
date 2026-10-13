import { layoutPipeline } from '../../src/utils/pipeline'

const at = (layout, id) => layout.nodes.find(node => node.id === id)
const cellsOf = layout => layout.nodes.map(({ col, row }) => `${col}:${row}`)

describe('layoutPipeline', () => {
	it('returns nothing for no nodes', () => {
		expect(layoutPipeline([])).toEqual({ nodes: [], edges: [], cols: 0, rows: 0 })
	})

	it('puts a chain on one row, one column per step', () => {
		const layout = layoutPipeline([{ id: 'a' }, { id: 'b', needs: ['a'] }, { id: 'c', needs: ['b'] }])
		expect(layout.nodes).toEqual([
			{ id: 'a', col: 0, row: 0 },
			{ id: 'b', col: 1, row: 0 },
			{ id: 'c', col: 2, row: 0 },
		])
		expect(layout.edges).toEqual([
			{ from: 'a', to: 'b' },
			{ from: 'b', to: 'c' },
		])
		expect([layout.cols, layout.rows]).toEqual([3, 1])
	})

	it('fans out: the first dependent keeps the row, the others open new ones', () => {
		const layout = layoutPipeline([
			{ id: 'changes' },
			{ id: 'verify-post', needs: ['changes'] },
			{ id: 'verify-admin', needs: ['changes'] },
			{ id: 'build-post', needs: ['verify-post'] },
			{ id: 'build-admin', needs: ['verify-admin'] },
		])
		expect(at(layout, 'verify-post')).toMatchObject({ col: 1, row: 0 })
		expect(at(layout, 'verify-admin')).toMatchObject({ col: 1, row: 1 })
		expect(at(layout, 'build-post')).toMatchObject({ col: 2, row: 0 })
		expect(at(layout, 'build-admin')).toMatchObject({ col: 2, row: 1 })
		expect(layout.rows).toBe(2)
	})

	it('fans in: the column is the longest path, the row follows the first free parent', () => {
		const layout = layoutPipeline([
			{ id: 'a' },
			{ id: 'b', needs: ['a'] },
			{ id: 'c' },
			{ id: 'join', needs: ['c', 'b'] },
		])
		expect(at(layout, 'join').col).toBe(2)
		expect(at(layout, 'join').row).toBe(at(layout, 'c').row)
		expect(layout.edges).toEqual(
			expect.arrayContaining([
				{ from: 'c', to: 'join' },
				{ from: 'b', to: 'join' },
			])
		)
	})

	it('never puts two nodes in the same cell', () => {
		const layout = layoutPipeline([
			{ id: 'r' },
			{ id: 'a', needs: ['r'] },
			{ id: 'b', needs: ['r'] },
			{ id: 'c', needs: ['r'] },
			{ id: 'x', needs: ['a', 'b', 'c'] },
			{ id: 'y', needs: ['a', 'b', 'c'] },
			{ id: 'z', needs: ['a', 'b', 'c'] },
		])
		expect(new Set(cellsOf(layout)).size).toBe(layout.nodes.length)
	})

	it('ignores unknown ids, self references and repeated dependencies', () => {
		const layout = layoutPipeline([
			{ id: 'a', needs: ['nope', 'a'] },
			{ id: 'b', needs: ['a', 'a', 'ghost'] },
		])
		expect(layout.nodes).toEqual([
			{ id: 'a', col: 0, row: 0 },
			{ id: 'b', col: 1, row: 0 },
		])
		expect(layout.edges).toEqual([{ from: 'a', to: 'b' }])
	})

	it('keeps the first of two nodes with the same id', () => {
		const layout = layoutPipeline([{ id: 'a' }, { id: 'a', needs: ['b'] }, { id: 'b' }])
		expect(layout.nodes.map(node => node.id)).toEqual(['a', 'b'])
		expect(layout.edges).toEqual([])
	})

	it('does not hang on cycles and drops the edge that closes the loop', () => {
		const layout = layoutPipeline([
			{ id: 'a', needs: ['c'] },
			{ id: 'b', needs: ['a'] },
			{ id: 'c', needs: ['b'] },
		])
		expect(layout.nodes).toHaveLength(3)
		expect(layout.edges).toHaveLength(2)
		expect(new Set(cellsOf(layout)).size).toBe(3)
		expect(
			layoutPipeline([
				{ id: 'a', needs: ['b'] },
				{ id: 'b', needs: ['a'] },
			]).nodes
		).toHaveLength(2)
	})
})
