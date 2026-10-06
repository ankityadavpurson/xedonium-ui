import { useEffect, useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import FloatingPanel from './FloatingPanel'
import Label from './Label'
import inputClass from './inputClass'

// Borderless trigger: transparent until hovered, ring only for keyboard focus
const flatClass = (invalid = false) =>
	`w-full bg-transparent border px-3 py-2 text-sm text-app-text outline-none transition hover:bg-app-card focus-visible:ring-2 focus-visible:ring-app-strong disabled:cursor-not-allowed disabled:opacity-50 ${
		invalid ? 'border-red-500' : 'border-transparent'
	}`

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
		<path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
	</svg>
)

const CheckMark = () => (
	<svg
		aria-hidden="true"
		focusable="false"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		className="h-4 w-4 shrink-0"
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
	</svg>
)

/**
 * Labelled select with a themed listbox (portalled, so it is never clipped). Keyboard: Up / Down / Home / End move,
 * Enter or Space picks, Escape closes, typing jumps to a matching option.
 * options: [{ value, label, disabled? }]. `onChange` receives the value string. `name` adds a hidden input for forms.
 * `variant="flat"` drops the border and fill (like a flat Button) for use in toolbars and over media; the focus ring
 * then shows for keyboard focus only.
 */
const Select = ({
	label,
	value,
	onChange,
	options,
	placeholder,
	error,
	disabled = false,
	name,
	variant = 'default',
	className = '',
	...rest
}) => {
	const id = useId()
	const labelId = `${id}-label`
	const listId = `${id}-list`
	const errorId = `${id}-error`
	const rootRef = useRef(null)
	const buttonRef = useRef(null)
	const panelRef = useRef(null)
	const typed = useRef({ text: '', timer: null })
	const [open, setOpen] = useState(false)
	const [active, setActive] = useState(-1)

	const selectedIndex = options.findIndex(o => o.value === value)
	const selected = options[selectedIndex]
	const enabledIndexes = options.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0)

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') buttonRef.current?.focus()
	})

	useEffect(() => {
		if (open) panelRef.current?.querySelector('[data-active="true"]')?.scrollIntoView?.({ block: 'nearest' })
	}, [open, active])

	const openList = () => {
		if (disabled) return
		setActive(selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : (enabledIndexes[0] ?? -1))
		setOpen(true)
	}

	const choose = index => {
		const option = options[index]
		if (!option || option.disabled) return
		onChange?.(option.value)
		setOpen(false)
		buttonRef.current?.focus()
	}

	const move = step => {
		if (!enabledIndexes.length) return
		const position = enabledIndexes.indexOf(active)
		const next = enabledIndexes[Math.min(Math.max(position + step, 0), enabledIndexes.length - 1)]
		setActive(next)
	}

	const typeahead = key => {
		const state = typed.current
		clearTimeout(state.timer)
		state.text += key.toLowerCase()
		state.timer = setTimeout(() => (state.text = ''), 600)
		const start = enabledIndexes.indexOf(active)
		const ordered = [...enabledIndexes.slice(start + 1), ...enabledIndexes.slice(0, start + 1)]
		const match = ordered.find(i => String(options[i].label).toLowerCase().startsWith(state.text))
		if (match === undefined) return
		if (open) setActive(match)
		else onChange?.(options[match].value)
	}

	const handleKeyDown = event => {
		if (disabled) return
		const { key } = event
		if (!open) {
			if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
				event.preventDefault()
				openList()
			} else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) typeahead(key)
			return
		}
		if (key === 'ArrowDown') move(1)
		else if (key === 'ArrowUp') move(-1)
		else if (key === 'Home') setActive(enabledIndexes[0] ?? -1)
		else if (key === 'End') setActive(enabledIndexes[enabledIndexes.length - 1] ?? -1)
		else if (key === 'Enter' || key === ' ') choose(active)
		else if (key === 'Tab') setOpen(false)
		else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) typeahead(key)
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
			<button
				ref={buttonRef}
				id={id}
				type="button"
				role="combobox"
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={open ? listId : undefined}
				aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
				aria-labelledby={label ? `${labelId} ${id}` : undefined}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onClick={() => (open ? setOpen(false) : openList())}
				onKeyDown={handleKeyDown}
				className={`${variant === 'flat' ? flatClass(!!error) : inputClass(!!error)} flex items-center justify-between gap-2 text-left ${className}`}
				{...rest}
			>
				<span className={`min-w-0 flex-1 truncate ${selected ? '' : 'text-app-muted'}`}>
					{selected ? selected.label : (placeholder ?? ' ')}
				</span>
				<Chevron open={open} />
			</button>
			{name && <input type="hidden" name={name} value={value ?? ''} />}
			<FloatingPanel
				open={open}
				anchorRef={buttonRef}
				panelRef={panelRef}
				placement="bottom-start"
				matchWidth
				gap={2}
				className="max-h-60 max-w-[calc(100vw-1rem)] overflow-y-auto border border-app-border bg-app-card shadow-xl"
			>
				<ul id={listId} role="listbox" aria-labelledby={label ? labelId : undefined} className="m-0 list-none p-0">
					{options.map((option, index) => {
						const isSelected = index === selectedIndex
						const isActive = index === active
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
								className={`flex items-center justify-between gap-2 px-3 py-2 text-sm ${
									option.disabled
										? 'cursor-not-allowed text-app-muted opacity-50'
										: isActive
											? 'cursor-pointer bg-app-strong text-app-bg'
											: 'cursor-pointer text-app-text'
								} ${isSelected ? 'font-semibold' : ''}`}
							>
								<span className="min-w-0 truncate">{option.label}</span>
								{isSelected && <CheckMark />}
							</li>
						)
					})}
				</ul>
			</FloatingPanel>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default Select
