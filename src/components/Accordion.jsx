import { useId, useRef, useState } from 'react'

const Chevron = ({ open }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		className={`h-4 w-4 shrink-0 text-app-muted transition-transform ${open ? 'rotate-180' : ''}`}
	>
		<path strokeLinecap="square" strokeLinejoin="miter" d="M6 9l6 6 6-6" />
	</svg>
)

/**
 * Stacked, collapsible sections. items: [{ key, title, content, disabled? }]. `multiple` lets several stay open
 * (default: opening one closes the others). Controlled via `value` (array of open keys) + `onChange`, or uncontrolled
 * via `defaultValue`. Keyboard: Up / Down / Home / End move between headers.
 */
const Accordion = ({ items, value, defaultValue = [], onChange, multiple = false, className = '' }) => {
	const baseId = useId()
	const [inner, setInner] = useState(defaultValue)
	const openKeys = value ?? inner
	const headers = useRef({})

	const toggle = key => {
		const isOpen = openKeys.includes(key)
		let next
		if (multiple) next = isOpen ? openKeys.filter(k => k !== key) : [...openKeys, key]
		else next = isOpen ? [] : [key]
		if (value === undefined) setInner(next)
		onChange?.(next)
	}

	const enabled = items.filter(item => !item.disabled)
	const handleKeyDown = (event, key) => {
		const index = enabled.findIndex(item => item.key === key)
		let next
		if (event.key === 'ArrowDown') next = enabled[(index + 1) % enabled.length]
		else if (event.key === 'ArrowUp') next = enabled[(index - 1 + enabled.length) % enabled.length]
		else if (event.key === 'Home') next = enabled[0]
		else if (event.key === 'End') next = enabled[enabled.length - 1]
		if (!next) return
		event.preventDefault()
		headers.current[next.key]?.focus()
	}

	return (
		<div className={`divide-y divide-app-border border border-app-border ${className}`}>
			{items.map(item => {
				const isOpen = openKeys.includes(item.key)
				return (
					<div key={item.key}>
						<h3 className="m-0">
							<button
								ref={el => (headers.current[item.key] = el)}
								id={`${baseId}-header-${item.key}`}
								type="button"
								aria-expanded={isOpen}
								aria-controls={`${baseId}-panel-${item.key}`}
								disabled={item.disabled}
								onClick={() => toggle(item.key)}
								onKeyDown={event => handleKeyDown(event, item.key)}
								className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-app-text outline-none transition hover:bg-app-card focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong disabled:cursor-not-allowed disabled:opacity-50"
							>
								<span className="min-w-0">{item.title}</span>
								<Chevron open={isOpen} />
							</button>
						</h3>
						<div
							id={`${baseId}-panel-${item.key}`}
							role="region"
							aria-labelledby={`${baseId}-header-${item.key}`}
							hidden={!isOpen}
							className="px-4 pb-4 pt-1 text-sm text-app-text"
						>
							{item.content}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Accordion
