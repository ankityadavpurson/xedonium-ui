import { useEffect, useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import FloatingPanel from './FloatingPanel'
import Label from './Label'
import inputClass from './inputClass'

/**
 * Select with a search box: type to filter the options, then pick one. options: [{ value, label, disabled? }].
 * `onChange` receives the value string. Filtering is a case-insensitive "contains" on the label; pass `filter`
 * (query, option) => boolean to customise it, or `onSearch(query)` to be told about typing (e.g. to fetch options
 * from a server and feed them back via `options`, with `filter={() => true}`). Keyboard: Up / Down / Home / End
 * move, Enter picks, Escape closes.
 */
const SearchSelect = ({
	label,
	value,
	onChange,
	options,
	placeholder = 'Search…',
	emptyText = 'No matches',
	filter,
	onSearch,
	error,
	disabled = false,
	name,
	className = '',
	...rest
}) => {
	const id = useId()
	const labelId = `${id}-label`
	const listId = `${id}-list`
	const errorId = `${id}-error`
	const rootRef = useRef(null)
	const inputRef = useRef(null)
	const panelRef = useRef(null)
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(-1)

	const selected = options.find(o => o.value === value)
	const matches = options.filter(o =>
		filter ? filter(query, o) : String(o.label).toLowerCase().includes(query.trim().toLowerCase())
	)
	const enabledIndexes = matches.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0)

	const close = () => {
		setOpen(false)
		setQuery('')
		onSearch?.('')
	}

	useDismissable(open, [rootRef, panelRef], reason => {
		close()
		if (reason === 'escape') inputRef.current?.focus()
	})

	useEffect(() => {
		if (open) panelRef.current?.querySelector('[data-active="true"]')?.scrollIntoView?.({ block: 'nearest' })
	}, [open, active])

	const search = text => {
		setQuery(text)
		onSearch?.(text)
		setOpen(true)
		setActive(-1)
	}

	const openList = () => {
		if (disabled || open) return
		const index = matches.findIndex(o => o.value === value && !o.disabled)
		setActive(index >= 0 ? index : (enabledIndexes[0] ?? -1))
		setOpen(true)
	}

	const choose = index => {
		const option = matches[index]
		if (!option || option.disabled) return
		onChange?.(option.value)
		close()
	}

	const move = step => {
		if (!open) return openList()
		if (!enabledIndexes.length) return undefined
		const position = enabledIndexes.indexOf(active)
		const next = position < 0 && step > 0 ? 0 : position + step
		setActive(enabledIndexes[Math.min(Math.max(next, 0), enabledIndexes.length - 1)])
		return undefined
	}

	const handleKeyDown = event => {
		if (disabled) return
		const { key } = event
		if (key === 'ArrowDown') move(1)
		else if (key === 'ArrowUp') move(-1)
		else if (key === 'Home' && open) setActive(enabledIndexes[0] ?? -1)
		else if (key === 'End' && open) setActive(enabledIndexes[enabledIndexes.length - 1] ?? -1)
		else if (key === 'Enter' && open) choose(active >= 0 ? active : (enabledIndexes[0] ?? -1))
		else if (key === 'Tab') close()
		else return
		if (key !== 'Tab') event.preventDefault()
	}

	return (
		<div ref={rootRef} className="relative flex flex-col gap-1">
			{label && (
				<Label id={labelId} htmlFor={id}>
					{label}
				</Label>
			)}
			<input
				ref={inputRef}
				id={id}
				type="text"
				role="combobox"
				autoComplete="off"
				disabled={disabled}
				aria-autocomplete="list"
				aria-expanded={open}
				aria-controls={open ? listId : undefined}
				aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				placeholder={selected && !open ? undefined : placeholder}
				value={open ? query : (selected?.label ?? '')}
				onChange={event => search(event.target.value)}
				onFocus={openList}
				onClick={openList}
				onKeyDown={handleKeyDown}
				className={`${inputClass(!!error)} ${className}`}
				{...rest}
			/>
			{name && <input type="hidden" name={name} value={value ?? ''} />}
			<FloatingPanel
				open={open}
				anchorRef={inputRef}
				panelRef={panelRef}
				placement="bottom-start"
				matchWidth
				gap={2}
				className="max-h-60 max-w-[calc(100vw-1rem)] overflow-y-auto border border-app-border bg-app-card shadow-xl"
			>
				<ul id={listId} role="listbox" aria-labelledby={label ? labelId : undefined} className="m-0 list-none p-0">
					{matches.map((option, index) => {
						const isActive = index === active
						const isSelected = option.value === value
						return (
							<li
								key={option.value}
								id={`${id}-opt-${index}`}
								role="option"
								aria-selected={isSelected}
								aria-disabled={option.disabled || undefined}
								data-active={isActive}
								onMouseDown={event => event.preventDefault()}
								onMouseMove={() => !option.disabled && setActive(index)}
								onClick={() => choose(index)}
								className={`px-3 py-2 text-sm ${
									option.disabled
										? 'cursor-not-allowed text-app-muted opacity-50'
										: isActive
											? 'cursor-pointer bg-app-strong text-app-bg'
											: 'cursor-pointer text-app-text'
								} ${isSelected ? 'font-semibold' : ''}`}
							>
								{option.label}
							</li>
						)
					})}
				</ul>
				{matches.length === 0 && <div className="px-3 py-2 text-sm text-app-muted">{emptyText}</div>}
			</FloatingPanel>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default SearchSelect
