import { useId, type ReactNode } from 'react'
import { startOfDay } from '../utils/date'
import DatePicker from './DatePicker'
import Label from './Label'
import TimePicker from './TimePicker'

export interface DateTimePickerProps {
	label?: ReactNode
	/** The date and time, or null. */
	value?: Date | null
	/** Receives a new Date with the picked date and time. */
	onChange?: (date: Date) => void
	/** Earliest and latest allowed date and time. */
	min?: Date | null
	max?: Date | null
	/** Minute granularity of the time list in seconds (default 900 = 15 min). */
	step?: number
	/** 12-hour clock with AM / PM. */
	hour12?: boolean
	error?: ReactNode
	datePlaceholder?: string
	timePlaceholder?: string
	locale?: string
	weekStartsOn?: number
}

const pad = (n: number) => String(n).padStart(2, '0')
const toTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`

/**
 * A date and a time picker side by side, with a single `Date` value (a replacement for `<input type="datetime-local">`).
 * Picking a date keeps the chosen time (or uses 00:00); picking a time keeps the chosen date (or uses today).
 * `min` / `max` limit the date, and the time as well on the boundary day.
 */
const DateTimePicker = ({
	label,
	value,
	onChange,
	min,
	max,
	step,
	hour12,
	error,
	datePlaceholder = 'Select date',
	timePlaceholder = 'Select time',
	locale,
	weekStartsOn,
}: DateTimePickerProps) => {
	const id = useId()
	const labelId = `${id}-label`
	const errorId = `${id}-error`
	const day = value ? startOfDay(value) : null

	// The time limits only apply on the day of the min / max
	const timeMin = min && day && day.getTime() === startOfDay(min).getTime() ? toTime(min) : undefined
	const timeMax = max && day && day.getTime() === startOfDay(max).getTime() ? toTime(max) : undefined

	const emit = (date: Date, hours: number, minutes: number) =>
		onChange?.(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes))

	return (
		<div
			role="group"
			aria-labelledby={label ? labelId : undefined}
			aria-describedby={error ? errorId : undefined}
			className="flex flex-col gap-1"
		>
			{label && <Label id={labelId}>{label}</Label>}
			<div className="flex flex-wrap items-start gap-2">
				<div className="min-w-[10rem] flex-1">
					<DatePicker
						label={<span className="sr-only">Date</span>}
						value={value}
						min={min}
						max={max}
						placeholder={datePlaceholder}
						locale={locale}
						weekStartsOn={weekStartsOn}
						onChange={date => emit(date, value?.getHours() ?? 0, value?.getMinutes() ?? 0)}
					/>
				</div>
				<div className="w-36">
					<TimePicker
						label={<span className="sr-only">Time</span>}
						value={value ? toTime(value) : ''}
						min={timeMin}
						max={timeMax}
						step={step}
						hour12={hour12}
						placeholder={timePlaceholder}
						onChange={time => {
							const [hours, minutes] = time.split(':').map(Number)
							emit(day ?? startOfDay(new Date()), hours, minutes)
						}}
					/>
				</div>
			</div>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default DateTimePicker
