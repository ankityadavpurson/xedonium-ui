import { useEffect, useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import FloatingPanel from './FloatingPanel'
import inputClass from './inputClass'
import Label from './Label'

const pad = n => String(n).padStart(2, '0')

const parse = value => {
	const match = /^(\d{1,2}):(\d{2})/.exec(value ?? '')
	if (!match) return null
	const hour = Number(match[1])
	const minute = Number(match[2])
	return hour < 24 && minute < 60 ? { hour, minute } : null
}

const toMinutes = ({ hour, minute }) => hour * 60 + minute

const ClockIcon = () => (
	<svg
		aria-hidden="true"
		focusable="false"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		className="h-4 w-4 shrink-0 text-app-muted"
	>
		<circle cx="12" cy="12" r="9" />
		<path strokeLinecap="square" strokeLinejoin="miter" d="M12 7v5l3 2" />
	</svg>
)

// One scrollable column of options. Up / Down move (and select) within it, Left / Right hop to the neighbour column.
const Column = ({ label, options, selected, onPick, columnRef }) => (
	<div
		ref={columnRef}
		role="listbox"
		aria-label={label}
		className="flex max-h-56 w-14 flex-col overflow-y-auto border-r border-app-border last:border-r-0"
	>
		{options.map(option => {
			const isSelected = option.value === selected
			return (
				<button
					key={option.value}
					type="button"
					role="option"
					aria-selected={isSelected}
					disabled={option.disabled}
					data-selected={isSelected}
					tabIndex={isSelected || (selected === null && option.first) ? 0 : -1}
					onClick={() => onPick(option.value)}
					onKeyDown={event => {
						const list = [...event.currentTarget.parentElement.querySelectorAll('button:not(:disabled)')]
						const index = list.indexOf(event.currentTarget)
						const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
						if (step) {
							event.preventDefault()
							const target = list[Math.min(Math.max(index + step, 0), list.length - 1)]
							target?.focus()
							target?.click()
						} else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
							const columns = [...event.currentTarget.closest('[data-columns]').querySelectorAll('[role=listbox]')]
							const next =
								columns[columns.indexOf(event.currentTarget.parentElement) + (event.key === 'ArrowRight' ? 1 : -1)]
							const focusTarget =
								next?.querySelector('[data-selected="true"]') ?? next?.querySelector('button:not(:disabled)')
							if (focusTarget) {
								event.preventDefault()
								focusTarget.focus()
							}
						}
					}}
					className={`px-3 py-2 text-center text-sm tabular-nums transition disabled:cursor-not-allowed disabled:opacity-30 ${
						isSelected ? 'bg-app-strong font-semibold text-app-bg' : 'text-app-text hover:bg-app-bg'
					}`}
				>
					{option.label}
				</button>
			)
		})}
	</div>
)

/**
 * Time field with a themed hour / minute picker (no native control). `value` / `onChange` use 24-hour "HH:MM" strings.
 * `step` is the minute granularity in seconds (default 900 = 15 min). `min` / `max` ("HH:MM") disable times outside
 * them. `hour12` shows the hours on a 12-hour clock with AM / PM (the value stays 24-hour).
 */
const TimePicker = ({
	label,
	value,
	onChange,
	step = 900,
	min,
	max,
	hour12 = false,
	placeholder = 'Select time',
	error,
	disabled = false,
	className = '',
	...rest
}) => {
	const id = useId()
	const errorId = `${id}-error`
	const rootRef = useRef(null)
	const buttonRef = useRef(null)
	const panelRef = useRef(null)
	const hoursRef = useRef(null)
	const [open, setOpen] = useState(false)

	const time = parse(value)
	const minuteStep = Math.max(1, Math.round(step / 60))
	const minuteOptions = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep)
	const lo = parse(min)
	const hi = parse(max)
	const allowed = (hour, minute) => {
		const total = hour * 60 + minute
		return (!lo || total >= toMinutes(lo)) && (!hi || total <= toMinutes(hi))
	}

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') buttonRef.current?.focus()
	})

	// Focus the selected hour when the panel opens so the keyboard works straight away, and centre the selected
	// hour / minute inside their columns (not the whole page)
	useEffect(() => {
		const panel = panelRef.current
		if (!open || !panel) return
		panel.querySelectorAll('[role=listbox]').forEach(column => {
			const current = column.querySelector('[data-selected="true"]')
			if (current) column.scrollTop = current.offsetTop - column.clientHeight / 2 + current.offsetHeight / 2
		})
		const target =
			hoursRef.current?.querySelector('[data-selected="true"]') ??
			hoursRef.current?.querySelector('button:not(:disabled)')
		target?.focus({ preventScroll: true })
	}, [open])

	const emit = (hour, minute) => onChange?.(`${pad(hour)}:${pad(minute)}`)

	// Picking an hour keeps the minute if it is still allowed, otherwise the nearest allowed one
	const pickHour = hour24 => {
		const minute =
			minuteOptions.find(m => m === time?.minute && allowed(hour24, m)) ??
			minuteOptions.find(m => allowed(hour24, m)) ??
			0
		emit(hour24, minute)
	}
	const pickMinute = minute => emit(time?.hour ?? (lo ? lo.hour : 0), minute)
	const pickPeriod = pm => {
		const hour = time?.hour ?? 0
		emit(pm ? (hour % 12) + 12 : hour % 12, time?.minute ?? 0)
	}

	const isPm = (time?.hour ?? 0) >= 12
	const hours = hour12
		? Array.from({ length: 12 }, (_, i) => {
				const display = i === 0 ? 12 : i
				const hour24 = (i % 12) + (isPm ? 12 : 0)
				return {
					value: hour24,
					label: pad(display),
					first: i === 0,
					disabled: !minuteOptions.some(m => allowed(hour24, m)),
				}
			})
		: Array.from({ length: 24 }, (_, hour) => ({
				value: hour,
				label: pad(hour),
				first: hour === 0,
				disabled: !minuteOptions.some(m => allowed(hour, m)),
			}))
	const minutes = minuteOptions.map((minute, i) => ({
		value: minute,
		label: pad(minute),
		first: i === 0,
		disabled: !allowed(time?.hour ?? (lo ? lo.hour : 0), minute),
	}))

	const display = time
		? hour12
			? `${pad(time.hour % 12 === 0 ? 12 : time.hour % 12)}:${pad(time.minute)} ${isPm ? 'PM' : 'AM'}`
			: `${pad(time.hour)}:${pad(time.minute)}`
		: ''

	return (
		<div ref={rootRef} className="relative flex flex-col gap-1">
			{label && <Label htmlFor={id}>{label}</Label>}
			<button
				ref={buttonRef}
				id={id}
				type="button"
				disabled={disabled}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onClick={() => setOpen(o => !o)}
				className={`${inputClass(!!error)} flex items-center justify-between gap-2 text-left ${className}`}
				{...rest}
			>
				<span className={display ? 'tabular-nums' : 'text-app-muted'}>{display || placeholder}</span>
				<ClockIcon />
			</button>
			<FloatingPanel
				open={open}
				anchorRef={buttonRef}
				panelRef={panelRef}
				placement="bottom-start"
				role="dialog"
				aria-label="Choose time"
				className="border border-app-border bg-app-card shadow-xl"
			>
				<div data-columns className="flex">
					<Column
						label="Hours"
						options={hours}
						selected={time ? time.hour : null}
						onPick={pickHour}
						columnRef={hoursRef}
					/>
					<Column label="Minutes" options={minutes} selected={time ? time.minute : null} onPick={pickMinute} />
					{hour12 && (
						<Column
							label="AM or PM"
							options={[
								{ value: 'AM', label: 'AM', first: true },
								{ value: 'PM', label: 'PM' },
							]}
							selected={time ? (isPm ? 'PM' : 'AM') : null}
							onPick={period => pickPeriod(period === 'PM')}
						/>
					)}
				</div>
			</FloatingPanel>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default TimePicker
