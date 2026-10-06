// Which Playground section shows a given component? Pure functions (no Vite-only APIs) so the docs check script can
// import them too.

const pattern = (name, flags) => new RegExp(`<${name}[\\s>/]|\\b${name}\\(`, flags)

const normalise = text => text.toLowerCase().replace(/[^a-z0-9]/g, '')

const mostUsed = (sections, name) =>
	sections.reduce(
		(best, section) =>
			(section.source.match(pattern(name, 'g'))?.length ?? 0) > (best.source.match(pattern(name, 'g'))?.length ?? 0)
				? section
				: best,
		sections[0]
	)

/**
 * Best section for a docs page. `names` are the components the page documents (e.g. ['Modal', 'ConfirmDialog']) and
 * `sections` is [{ tab, slug, title, source }] in display order. A section whose title names the component wins;
 * otherwise the one that uses it most often (ties go to the earlier section). Undefined if no section uses it.
 */
export const pickSection = (names, sections) => {
	const candidates = []
	for (const name of names) {
		const using = sections.filter(section => pattern(name).test(section.source))
		if (!using.length) continue
		const titled = using.find(section => normalise(section.title).includes(normalise(name)))
		candidates.push({ section: titled ?? mostUsed(using, name), titled: !!titled })
	}
	return (candidates.find(c => c.titled) ?? candidates[0])?.section
}
