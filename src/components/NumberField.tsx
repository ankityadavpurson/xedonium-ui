import {
	useId,
	useState,
	type ChangeEvent,
	type ComponentPropsWithoutRef,
	type KeyboardEvent,
	type ReactNode,
} from 'react'
import Label from './Label'
import MinusIcon from './icons/Minus'
import PlusIcon from './icons/Plus'
import inputClass from './inputClass'

export interface NumberFieldProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'onChange' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'type'
> {
	label?: ReactNode
	/** The number, or null when empty (controlled). */
	value?: number | null
	/** Initial number when uncontrolled. */
	defaultValue?: number | null
	/** Receives the number, or null when the field is emptied. */
	onChange?: (value: number | null) => void
	min?: number
	max?: number
	/** Amount added by the buttons and the arrow keys (Shift takes ten steps). */
	step?: number
	/** Round to this many decimals (default: as many as `step` has). */
	precision?: number
	/** Show the minus and plus buttons (default true). */
	showControls?: boolean
	/** Hint under the field while there is no `error`. */
	helperText?: ReactNode
	error?: ReactNode
}

const decimalsOf = (n: number) => {
	const [, fraction = ''] = String(n).split('.')
	return fraction.length
}

const clamp = (n: number, min?: number, max?: number) => Math.min(Math.max(n, min ?? -Infinity), max ?? Infinity)

const controlClass =
	'flex w-9 shrink-0 items-center justify-center border border-app-border bg-app-bg text-app-text outline-none transition hover:border-app-strong focus-visible:ring-2 focus-visible:ring-app-strong disabled:cursor-not-allowed disabled:opacity-50'

/**
 * Number input with minus / plus buttons. `onChange` receives a number (or null when emptied), never a string. Arrow
 * Up / Down step by `step` (Shift: ten steps), Home / End jump to `min` / `max`. Values are clamped to `min` / `max`
 * and rounded to `precision` when you leave the field or use the buttons, so typing stays free in between.
 */
const NumberField = ({
	label,
	value,
	defaultValue = null,
	onChange,
	min,
	max,
	step = 1,
	precision,
	showControls = true,
	helperText,
	error,
	disabled = false,
	className = '',
	onBlur,
	onKeyDown,
	...rest
}: NumberFieldProps) => {
	const id = useId()
	const hintId = `${id}-hint`
	const [inner, setInner] = useState<number | null>(defaultValue)
	const [draft, setDraft] = useState<string | null>(null)
	const current = value !== undefined ? value : inner
	const digits = precision ?? decimalsOf(step)
	const hint = error ?? helperText

	const round = (n: number) => Number(n.toFixed(Math.max(digits, 0)))
	const commit = (next: number | null) => {
		if (value === undefined) setInner(next)
		onChange?.(next)
	}
	const stepBy = (amount: number) => {
		setDraft(null)
		const from = current ?? (min !== undefined && min > 0 ? min - amount : 0)
		commit(clamp(round(from + amount), min, max))
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const text = event.target.value
		setDraft(text)
		if (text.trim() === '') commit(null)
		else if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(text.trim())) commit(Number(text))
	}

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		setDraft(null)
		if (current !== null) {
			const fixed = clamp(round(current), min, max)
			if (fixed !== current) commit(fixed)
		}
		onBlur?.(event)
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		onKeyDown?.(event)
		if (event.defaultPrevented || disabled) return
		const big = event.shiftKey ? 10 : 1
		if (event.key === 'ArrowUp') stepBy(step * big)
		else if (event.key === 'ArrowDown') stepBy(-step * big)
		else if (event.key === 'Home' && min !== undefined) {
			setDraft(null)
			commit(min)
		} else if (event.key === 'End' && max !== undefined) {
			setDraft(null)
			commit(max)
		} else return
		event.preventDefault()
	}

	const canDecrease = !disabled && (current === null || min === undefined || current > min)
	const canIncrease = !disabled && (current === null || max === undefined || current < max)

	return (
		<div className="flex flex-col gap-1">
			{label && <Label htmlFor={id}>{label}</Label>}
			<div className="flex">
				{showControls && (
					<button
						type="button"
						tabIndex={-1}
						aria-label="Decrease"
						disabled={!canDecrease}
						onClick={() => stepBy(-step)}
						className={`${controlClass} -mr-px`}
					>
						<MinusIcon />
					</button>
				)}
				<input
					id={id}
					type="text"
					inputMode={digits > 0 || (min !== undefined && min < 0) ? 'decimal' : 'numeric'}
					role="spinbutton"
					aria-valuenow={current ?? undefined}
					aria-valuemin={min}
					aria-valuemax={max}
					aria-invalid={!!error}
					aria-describedby={hint ? hintId : undefined}
					disabled={disabled}
					value={draft ?? (current === null ? '' : String(current))}
					onChange={handleChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className={`${inputClass(!!error)} min-w-0 text-center tabular-nums ${className}`}
					{...rest}
				/>
				{showControls && (
					<button
						type="button"
						tabIndex={-1}
						aria-label="Increase"
						disabled={!canIncrease}
						onClick={() => stepBy(step)}
						className={`${controlClass} -ml-px`}
					>
						<PlusIcon />
					</button>
				)}
			</div>
			{hint && (
				<span id={hintId} className={`text-xs ${error ? 'text-red-700 dark:text-red-400' : 'text-app-muted'}`}>
					{hint}
				</span>
			)}
		</div>
	)
}

export default NumberField
