// Every per-module subpath (`xedonium/Button`, `xedonium/hooks/useMediaQuery`, `xedonium/icons/Search`) exports its
// value both as the default and under the same name the root barrel uses, so `import { Button } from 'xedonium/Button'`
// works too. Island frameworks such as Astro load a hydrated component's whole module, so these paths are the way to
// keep a client chunk small (#131).
import * as lib from '../src/index'

const groups = {
	components: import.meta.glob(['../src/components/*.tsx', '!../src/components/menuItemParts.tsx'], { eager: true }),
	hooks: import.meta.glob('../src/hooks/*.ts', { eager: true }),
	icons: import.meta.glob('../src/components/icons/*.tsx', { eager: true }),
}

// The names a value has in the root barrel (icons get an `Icon` suffix there; a few have an alias too)
const barrelNames = value => Object.keys(lib).filter(name => lib[name] === value)

describe.each(Object.entries(groups))('%s subpaths', (_, modules) => {
	const entries = Object.entries(modules).map(([file, mod]) => [file.split('/').pop(), mod])

	it('found modules', () => {
		expect(entries.length).toBeGreaterThan(0)
	})

	it.each(entries)('%s has a named export matching its default', (_, mod) => {
		expect(mod.default).toBeDefined()
		const named = Object.keys(mod).filter(name => name !== 'default' && mod[name] === mod.default)
		expect(named).toHaveLength(1)
		// internal modules (FloatingPanel) are not in the barrel; the rest must use a barrel name
		const inBarrel = barrelNames(mod.default)
		if (inBarrel.length) expect(inBarrel).toContain(named[0])
	})
})
