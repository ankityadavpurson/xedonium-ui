import { useEffect, useRef } from 'react'

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

// "mod+shift+k" -> Ctrl (Cmd on Mac) + Shift + K, matched exactly. Modifiers: mod, ctrl, alt, shift, meta.
const matches = (combo, event) => {
	const parts = combo.toLowerCase().split('+')
	const key = parts.pop()
	const wants = new Set(parts)
	const mac = isMac()
	const ctrl = wants.has('ctrl') || (wants.has('mod') && !mac)
	const meta = wants.has('meta') || (wants.has('mod') && mac)
	return (
		event.key.toLowerCase() === key &&
		event.ctrlKey === ctrl &&
		event.metaKey === meta &&
		event.altKey === wants.has('alt') &&
		event.shiftKey === wants.has('shift')
	)
}

const isTyping = target =>
	target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

/**
 * Global shortcuts: `useKeyboardShortcuts({ 'mod+k': openPalette, '/': focusSearch })`.
 * Shortcuts without a modifier are ignored while typing in a field. Pass `enabled = false` to pause.
 */
const useKeyboardShortcuts = (shortcuts, enabled = true) => {
	const ref = useRef(shortcuts)
	useEffect(() => {
		ref.current = shortcuts
	})

	useEffect(() => {
		if (!enabled) return undefined
		const handleKeyDown = event => {
			for (const [combo, handler] of Object.entries(ref.current)) {
				if (!matches(combo, event)) continue
				const hasModifier = /\b(mod|ctrl|alt|meta)\+/i.test(combo)
				if (!hasModifier && isTyping(event.target)) continue
				event.preventDefault()
				handler(event)
				return
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [enabled])
}

export default useKeyboardShortcuts
