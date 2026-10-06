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

const IMPORT = /^import\b[\s\S]*?\bfrom\s+['"][^'"]+['"];?[ \t]*\r?\n?/gm

/**
 * Turns a snippet written like a normal module (imports + `export default function Demo`) into the form react-live
 * runs in `noInline` mode: imports are dropped (their names are already in `scope`), `export default` is removed and
 * a final `render(<Demo />)` mounts the component. The editor always shows the original text.
 */
export const toLiveCode = source => {
	const exported = /export\s+default\s+function\s+(\w+)/.exec(source)
	const name = exported?.[1] ?? /function\s+(Demo|App)\b/.exec(source)?.[1] ?? 'Demo'
	const body = source.replace(IMPORT, '').replace(/export\s+default\s+/, '')
	return `${body}\n\nrender(<${name} />)`
}
