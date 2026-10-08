// Alphabetical by `name`, ignoring case, so the nav and the category pages list things in a predictable order
export const sortByName = list =>
	[...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
