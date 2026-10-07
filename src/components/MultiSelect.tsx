import {
	useEffect,
	useId,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type KeyboardEvent,
	type ReactNode,
} from 'react'
import type { SelectOption } from '../types'
import useDismissable from '../hooks/useDismissable'
import FloatingPanel from './FloatingPanel'
import Label from './Label'
import inputClass from './inputClass'

export interface MultiSelectProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value' | 'name'> {
	label?: ReactNode
	/** Array of selected option values. */
	value?: string[]
	/** Receives the new array. */
	onChange?: (value: string[]) => void
	options: SelectOption[]
	placeholder?: string
	/** Type to filter the options. */
	searchable?: boolean
	/** Show a clear-all button (default true). */
	clearable?: boolean
	/** Shown when the search matches nothing. */
	emptyText?: string
	/** Custom match: `(query, option) => boolean`. */
	filter?: (query: string, option: SelectOption) => boolean
	error?: ReactNode
	/** Adds one hidden input per selected value for forms. */
	name?: string
}

const Chevron = ({ open }: { open: boolean }) => (
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

const Cross = ({ className = 'h-3 w-3' }: { className?: string }) => (
	<svg
		aria-hidden="true"
		focusable="false"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		className={`shrink-0 ${className}`}
	>
		<path strokeLinecap="square" strokeLinejoin="miter" d="M6 6l12 12M18 6L6 18" />
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
		<path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
	</svg>
)

const chipButtonClass =
	'inline-flex items-center text-app-muted outline-none transition hover:text-app-text focus-visible:ring-2 focus-visible:ring-app-strong'

/**
 * Select that allows several values. `value` is an array of option values; `onChange` receives the new array. Chosen
 * options show as chips, each with a remove button; `clearable` adds a clear-all button. With `searchable` you can
 * type to filter the options. The list stays open while picking. Keyboard: Up / Down move (Home / End too when not
 * searchable), Enter toggles the active option, Backspace in the empty input removes the last chip, Escape closes.
 * options: [{ value, label, disabled? }]. `name` adds one hidden input per selected value for forms.
 */
const MultiSelect = ({
	label,
	value = [],
	onChange,
	options,
	placeholder,
	searchable = false,
	clearable = true,
	emptyText = 'No matches',
	filter,
	error,
	disabled = false,
	name,
	className = '',
	...rest
}: MultiSelectProps) => {
	const id = useId()
	const labelId = `${id}-label`
	const listId = `${id}-list`
	const errorId = `${id}-error`
	const rootRef = useRef<HTMLDivElement>(null)
	const controlRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(-1)

	const selectedOptions = options.filter(o => value.includes(o.value))
	const matches = searchable
		? options.filter(o =>
				filter ? filter(query, o) : String(o.label).toLowerCase().includes(query.trim().toLowerCase())
			)
		: options
	const enabledIndexes = matches.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0)

	const close = () => {
		setOpen(false)
		setQuery('')
	}

	useDismissable(open, [rootRef, panelRef], reason => {
		close()
		if (reason === 'escape') inputRef.current?.focus()
	})

	useEffect(() => {
		if (open) panelRef.current?.querySelector('[data-active="true"]')?.scrollIntoView?.({ block: 'nearest' })
	}, [open, active])

	const openList = () => {
		if (disabled || open) return
		const firstSelected = matches.findIndex(o => value.includes(o.value) && !o.disabled)
		setActive(firstSelected >= 0 ? firstSelected : (enabledIndexes[0] ?? -1))
		setOpen(true)
	}

	const toggle = (index: number) => {
		const option = matches[index]
		if (!option || option.disabled) return
		onChange?.(value.includes(option.value) ? value.filter(v => v !== option.value) : [...value, option.value])
		setQuery('')
	}

	const remove = (optionValue: string) => {
		onChange?.(value.filter(v => v !== optionValue))
		inputRef.current?.focus()
	}

	const clearAll = () => {
		onChange?.([])
		inputRef.current?.focus()
	}

	const search = (text: string) => {
		setQuery(text)
		setOpen(true)
		setActive(-1)
	}

	const move = (step: number) => {
		if (!open) return openList()
		if (!enabledIndexes.length) return undefined
		const position = enabledIndexes.indexOf(active)
		const next = position < 0 && step > 0 ? 0 : position + step
		setActive(enabledIndexes[Math.min(Math.max(next, 0), enabledIndexes.length - 1)])
		return undefined
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		if (disabled) return
		const { key } = event
		if (key === 'ArrowDown') move(1)
		else if (key === 'ArrowUp') move(-1)
		else if (key === 'Home' && open && !searchable) setActive(enabledIndexes[0] ?? -1)
		else if (key === 'End' && open && !searchable) setActive(enabledIndexes[enabledIndexes.length - 1] ?? -1)
		else if (key === 'Enter') {
			if (open) toggle(active >= 0 ? active : (enabledIndexes[0] ?? -1))
			else openList()
		} else if (key === ' ' && !searchable) {
			if (open) toggle(active >= 0 ? active : (enabledIndexes[0] ?? -1))
			else openList()
		} else if (key === 'Backspace' && !query && value.length) onChange?.(value.slice(0, -1))
		else if (key === 'Tab') close()
		else return
		if (key !== 'Tab' && key !== 'Backspace') event.preventDefault()
	}

	return (
		<div ref={rootRef} className="relative flex flex-col gap-1">
			{label && (
				<Label id={labelId} htmlFor={id}>
					{label}
				</Label>
			)}
			<div
				ref={controlRef}
				onClick={event => {
					if ((event.target as Element).closest('button')) return
					inputRef.current?.focus()
					if (open && !searchable) close()
					else openList()
				}}
				className={`${inputClass(!!error)} flex flex-wrap items-center gap-1 focus-within:border-app-strong focus-within:ring-2 focus-within:ring-app-strong ${
					disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text'
				} ${className}`}
			>
				{selectedOptions.map(option => (
					<span
						key={option.value}
						className="inline-flex max-w-full items-center gap-1 border border-app-border bg-app-card px-1.5 py-0.5 text-xs text-app-text"
					>
						<span className="min-w-0 truncate">{option.label}</span>
						<button
							type="button"
							disabled={disabled}
							aria-label={`Remove ${option.label}`}
							onClick={() => remove(option.value)}
							className={chipButtonClass}
						>
							<Cross />
						</button>
					</span>
				))}
				<input
					ref={inputRef}
					id={id}
					type="text"
					role="combobox"
					autoComplete="off"
					readOnly={!searchable}
					disabled={disabled}
					aria-haspopup="listbox"
					aria-autocomplete={searchable ? 'list' : undefined}
					aria-expanded={open}
					aria-controls={open ? listId : undefined}
					aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					placeholder={selectedOptions.length ? undefined : placeholder}
					value={query}
					onChange={event => search(event.target.value)}
					onKeyDown={handleKeyDown}
					className="min-w-[4rem] flex-1 cursor-[inherit] bg-transparent text-sm text-app-text outline-none placeholder:text-app-muted"
					{...rest}
				/>
				{clearable && selectedOptions.length > 0 && !disabled && (
					<button type="button" aria-label="Clear all" onClick={clearAll} className={chipButtonClass}>
						<Cross className="h-4 w-4" />
					</button>
				)}
				<button
					type="button"
					tabIndex={-1}
					disabled={disabled}
					aria-label={open ? 'Close options' : 'Open options'}
					onClick={() => {
						inputRef.current?.focus()
						if (open) close()
						else openList()
					}}
					className="inline-flex"
				>
					<Chevron open={open} />
				</button>
			</div>
			{name && value.map(v => <input key={v} type="hidden" name={name} value={v} />)}
			<FloatingPanel
				open={open}
				anchorRef={controlRef}
				panelRef={panelRef}
				placement="bottom-start"
				matchWidth
				gap={2}
				className="max-h-60 max-w-[calc(100vw-1rem)] overflow-y-auto border border-app-border bg-app-card shadow-xl"
			>
				<ul
					id={listId}
					role="listbox"
					aria-multiselectable="true"
					aria-labelledby={label ? labelId : undefined}
					className="m-0 list-none p-0"
				>
					{matches.map((option, index) => {
						const isSelected = value.includes(option.value)
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
								onClick={() => toggle(index)}
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

export default MultiSelect
