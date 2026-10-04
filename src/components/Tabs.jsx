import { useId, useRef, useState } from 'react'

/**
 * Tabs with arrow / Home / End keyboard navigation.
 * items: [{ key, label, content?, disabled? }]. Controlled via `value` + `onChange`, or uncontrolled via `defaultValue`.
 */
const Tabs = ({ items, value, defaultValue, onChange, className = '' }) => {
	const baseId = useId()
	const [inner, setInner] = useState(defaultValue ?? items[0]?.key)
	const active = value ?? inner
	const tabRefs = useRef({})

	const select = key => {
		if (value === undefined) setInner(key)
		onChange?.(key)
	}

	const enabled = items.filter(item => !item.disabled)
	const handleKeyDown = event => {
		const index = enabled.findIndex(item => item.key === active)
		let next
		if (event.key === 'ArrowRight') next = enabled[(index + 1) % enabled.length]
		else if (event.key === 'ArrowLeft') next = enabled[(index - 1 + enabled.length) % enabled.length]
		else if (event.key === 'Home') next = enabled[0]
		else if (event.key === 'End') next = enabled[enabled.length - 1]
		if (!next) return
		event.preventDefault()
		select(next.key)
		tabRefs.current[next.key]?.focus()
	}

	const current = items.find(item => item.key === active)

	return (
		<div className={className}>
			<div role="tablist" onKeyDown={handleKeyDown} className="flex overflow-x-auto border-b border-app-border">
				{items.map(item => {
					const selected = item.key === active
					return (
						<button
							key={item.key}
							ref={el => (tabRefs.current[item.key] = el)}
							id={`${baseId}-tab-${item.key}`}
							type="button"
							role="tab"
							aria-selected={selected}
							aria-controls={`${baseId}-panel-${item.key}`}
							tabIndex={selected ? 0 : -1}
							disabled={item.disabled}
							onClick={() => select(item.key)}
							className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition disabled:cursor-not-allowed disabled:opacity-50 ${
								selected
									? 'border-app-strong text-app-text'
									: 'border-transparent text-app-muted hover:text-app-text'
							}`}
						>
							{item.label}
						</button>
					)
				})}
			</div>
			{current?.content !== undefined && (
				<div
					role="tabpanel"
					id={`${baseId}-panel-${current.key}`}
					aria-labelledby={`${baseId}-tab-${current.key}`}
					tabIndex={0}
					className="pt-4"
				>
					{current.content}
				</div>
			)}
		</div>
	)
}

export default Tabs
