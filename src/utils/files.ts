// Helpers for FileExplorer: sizes, ordering and the language of a file name.

/** `1536` -> `1.5 KB`. */
export const readableSize = (bytes?: number) => {
	if (!bytes) return '0 B'
	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
	return `${(bytes / 1024 ** power).toFixed(power ? 1 : 0)} ${units[power]}`
}

interface Named {
	name: string
	type: 'file' | 'folder'
}

/** Folders first, then files; each group by name (numbers sort as numbers: `file2` before `file10`). */
export const sortNodes = <Node extends Named>(nodes: Node[]): Node[] =>
	[...nodes].sort((a, b) => {
		if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
		return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true })
	})

/** The extension of a file name as a language hint for CodeDisplay (`App.tsx` -> `tsx`), or undefined when there is none. */
export const languageOf = (name: string) => {
	const dot = name.lastIndexOf('.')
	return dot > 0 && dot < name.length - 1 ? name.slice(dot + 1).toLowerCase() : undefined
}

interface Described extends Named {
	size?: number
	children?: unknown[]
	itemCount?: number
}

/** A short line about an entry: `12.3 KB` for a file, `4 items · 12.3 KB` for a folder (the size only when known). */
export const describeNode = (node: Described) => {
	if (node.type === 'file') return readableSize(node.size)
	const count = node.itemCount ?? node.children?.length ?? 0
	const items = `${count} ${count === 1 ? 'item' : 'items'}`
	return node.size === undefined ? items : `${items} · ${readableSize(node.size)}`
}
