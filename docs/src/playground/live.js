import * as React from 'react'
import * as Xedonium from 'xedonium'

// Everything a snippet can use without importing it: React hooks plus every export of the library
export const scope = {
	React,
	Fragment: React.Fragment,
	useState: React.useState,
	useEffect: React.useEffect,
	useLayoutEffect: React.useLayoutEffect,
	useMemo: React.useMemo,
	useRef: React.useRef,
	useCallback: React.useCallback,
	useId: React.useId,
	...Xedonium,
}

// One import statement at the start of the text. It is only ever matched from the start, so an `import` inside a string
// or template literal further down is never mistaken for one.
const LEADING_IMPORT = /^\s*import\b[\s\S]*?\bfrom\s+['"][^'"]+['"];?/

/**
 * Turns a snippet written like a normal module (imports + `export default function Demo`) into the form react-live
 * runs in `noInline` mode: imports are dropped (their names are already in `scope`), `export default` is removed and
 * a final `render(<Demo />)` mounts the component. The editor always shows the original text.
 * Only the leading imports and the last `export default` count: code samples held in strings (a CodeDisplay demo shows
 * a whole module) can contain both and must stay as they are.
 */
export const toLiveCode = source => {
	let body = source
	for (let match = LEADING_IMPORT.exec(body); match; match = LEADING_IMPORT.exec(body)) {
		body = body.slice(match[0].length)
	}
	const exported = [...body.matchAll(/export\s+default\s+(?:function\s+(\w+))?/g)].pop()
	if (exported) {
		const keep = exported[1] ? `function ${exported[1]}` : ''
		body = body.slice(0, exported.index) + keep + body.slice(exported.index + exported[0].length)
	}
	const name = exported?.[1] ?? [...body.matchAll(/function\s+(Demo|App)\b/g)].pop()?.[1] ?? 'Demo'
	return `${body}\n\nrender(<${name} />)`
}
