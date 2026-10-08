import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import Button from './Button'
import ChevronLeftIcon from './icons/ChevronLeft'
import ChevronRightIcon from './icons/ChevronRight'

export interface TabItem {
	key: string
	label: ReactNode
	content?: ReactNode
	disabled?: boolean
}

export interface TabsProps {
	items: TabItem[]
	/** Active key (controlled). */
	value?: string
	/** Initially active key (uncontrolled). */
	defaultValue?: string
	onChange?: (key: string) => void
	/** `auto` (default) shows scroll buttons at both ends when the tabs do not fit; `never` hides them. */
	scrollButtons?: 'auto' | 'never'
	className?: string
}

const scrollButtonClass = 'inline-flex w-9 shrink-0 items-center justify-center !px-0 !py-0'

/**
 * Tabs with arrow / Home / End keyboard navigation.
 * items: [{ key, label, content?, disabled? }]. Controlled via `value` + `onChange`, or uncontrolled via `defaultValue`.
 * When there are more tabs than fit, scroll buttons appear at both ends (they are disabled at the ends), and the active
 * tab is scrolled into view. `scrollButtons="never"` turns the buttons off.
 */
const Tabs = ({ items, value, defaultValue, onChange, scrollButtons = 'auto', className = '' }: TabsProps) => {
	const baseId = useId()
	const [inner, setInner] = useState(defaultValue ?? items[0]?.key)
	const active = value ?? inner
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
	const listRef = useRef<HTMLDivElement>(null)
	const [reach, setReach] = useState({ overflow: false, start: false, end: false })

	// What can still be scrolled to each side; re-measured on scroll, resize and when the tabs change
	const measure = () => {
		const list = listRef.current
		if (!list) return
		const overflow = list.scrollWidth > list.clientWidth + 1
		setReach({
			overflow,
			start: overflow && list.scrollLeft > 0,
			end: overflow && list.scrollLeft + list.clientWidth < list.scrollWidth - 1,
		})
	}

	// Keep the active tab visible: when it changes, and when sizes change (a web font loading shifts every tab)
	const reveal = () => {
		const list = listRef.current
		const tab = tabRefs.current[active ?? '']
		if (!list || !tab) return
		const left = tab.offsetLeft
		const right = left + tab.offsetWidth
		if (left < list.scrollLeft) list.scrollLeft = left
		else if (right > list.scrollLeft + list.clientWidth) list.scrollLeft = right - list.clientWidth
	}

	useEffect(() => {
		measure()
		reveal()
		const list = listRef.current
		if (!list || typeof ResizeObserver === 'undefined') return undefined
		const observer = new ResizeObserver(() => {
			reveal()
			measure()
		})
		observer.observe(list)
		Object.values(tabRefs.current).forEach(tab => tab && observer.observe(tab))
		return () => observer.disconnect()
		// the tabs and the active one decide what is measured and kept in view
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items, active])

	const scrollBy = (direction: -1 | 1) => {
		const list = listRef.current
		if (!list) return
		const left = direction * Math.max(list.clientWidth * 0.75, 1)
		if (typeof list.scrollBy === 'function') list.scrollBy({ left, behavior: 'smooth' })
		else list.scrollLeft += left
	}

	const select = (key: string) => {
		if (value === undefined) setInner(key)
		onChange?.(key)
	}

	const enabled = items.filter(item => !item.disabled)
	const handleKeyDown = (event: KeyboardEvent) => {
		const index = enabled.findIndex(item => item.key === active)
		let next: TabItem | undefined
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
	const showButtons = scrollButtons === 'auto' && reach.overflow

	return (
		<div className={className}>
			<div className="flex items-stretch shadow-[inset_0_-1px_0_rgb(var(--color-app-border))]">
				{showButtons && (
					<Button
						variant="flat"
						tabIndex={-1}
						aria-label="Scroll tabs left"
						tooltip="Scroll left"
						tooltipPlacement="bottom"
						className={scrollButtonClass}
						disabled={!reach.start}
						onClick={() => scrollBy(-1)}
					>
						<ChevronLeftIcon />
					</Button>
				)}
				<div
					ref={listRef}
					role="tablist"
					onKeyDown={handleKeyDown}
					onScroll={measure}
					className="relative flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{items.map(item => {
						const selected = item.key === active
						return (
							<button
								key={item.key}
								ref={el => {
									tabRefs.current[item.key] = el
								}}
								id={`${baseId}-tab-${item.key}`}
								type="button"
								role="tab"
								aria-selected={selected}
								aria-controls={`${baseId}-panel-${item.key}`}
								tabIndex={selected ? 0 : -1}
								disabled={item.disabled}
								onClick={() => select(item.key)}
								className={`whitespace-nowrap border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition disabled:cursor-not-allowed disabled:opacity-50 ${
									selected ? 'border-app-strong text-app-text' : 'border-transparent text-app-muted hover:text-app-text'
								}`}
							>
								{item.label}
							</button>
						)
					})}
				</div>
				{showButtons && (
					<Button
						variant="flat"
						tabIndex={-1}
						aria-label="Scroll tabs right"
						tooltip="Scroll right"
						tooltipPlacement="bottom"
						className={scrollButtonClass}
						disabled={!reach.end}
						onClick={() => scrollBy(1)}
					>
						<ChevronRightIcon />
					</Button>
				)}
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
