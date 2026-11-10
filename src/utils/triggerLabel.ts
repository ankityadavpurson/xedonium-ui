import type { ReactNode } from 'react'

/**
 * `aria-label` for a trigger button that also has a `label` prop.
 * A button that shows real text must have that text in its accessible name (WCAG 2.5.3, Label in Name), so speech
 * users can say what they see. The label is kept when it contains the visible text, and dropped when it does not:
 * the button is then named by its own text. Icons, elements and symbol-only text ("⋮") always keep the label.
 */
const triggerLabel = (trigger: ReactNode, label?: string) => {
	if (typeof trigger !== 'string' && typeof trigger !== 'number') return label
	const text = String(trigger).trim().toLowerCase()
	if (!/[\p{L}\p{N}]/u.test(text)) return label
	return label?.toLowerCase().includes(text) ? label : undefined
}

export default triggerLabel
