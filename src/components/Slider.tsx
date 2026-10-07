import {
	useEffect,
	useId,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ReactNode,
} from 'react'
import FloatingPanel from './FloatingPanel'
import Label from './Label'

export interface SliderProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'onChange' | 'value' | 'min' | 'max' | 'step'
> {
	label?: ReactNode
	value: number
	/** Receives a number. */
	onChange?: (value: number) => void
	min?: number
	max?: number
	/** A number, or `any` for no snapping. */
	step?: number | 'any'
	/** Show the value beside the label (default true). */
	showValue?: boolean
	/** Formats the value shown in a popover over the thumb while dragging or using the keyboard. */
	valueLabel?: (value: number) => ReactNode
	orientation?: 'horizontal' | 'vertical'
	/** Height in px when vertical. */
	length?: number
	/** Same units as `value`; draws a lighter band up to that point (e.g. the loaded part of a video). */
	buffered?: number
}

/**
 * Range input with a square thumb and a filled track (styled in styles.css). `onChange` receives a number.
 * `valueLabel(value)` formats the value shown in a small popover above the thumb while the slider is being dragged or
 * used from the keyboard (e.g. a time for a seek bar). `orientation="vertical"` stands it upright (minimum at the
 * bottom), `length` px tall: it is the same horizontal slider turned a quarter circle, so it looks identical in every
 * browser. `buffered` (same units as `value`) draws a lighter band from the thumb up to that point, like the
 * "loaded" part of a video seek bar.
 */
const Slider = ({
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	showValue = true,
	valueLabel,
	orientation = 'horizontal',
	length = 112,
	buffered,
	className = '',
	...rest
}: SliderProps) => {
	const id = useId()
	const anchorRef = useRef<HTMLSpanElement>(null)
	const [dragging, setDragging] = useState(false)
	const [focused, setFocused] = useState(false)
	const vertical = orientation === 'vertical'
	const span = max - min
	const percent = (amount: number) => (span > 0 ? Math.min(100, Math.max(0, ((amount - min) / span) * 100)) : 0)
	const fill = percent(value)
	const bufferFill = buffered === undefined ? undefined : Math.max(fill, percent(buffered))

	useEffect(() => {
		if (!dragging) return undefined
		const stop = () => setDragging(false)
		window.addEventListener('pointerup', stop)
		window.addEventListener('pointercancel', stop)
		return () => {
			window.removeEventListener('pointerup', stop)
			window.removeEventListener('pointercancel', stop)
		}
	}, [dragging])

	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{(label || showValue) && (
				<div className="flex items-center justify-between gap-2">
					{label ? <Label htmlFor={id}>{label}</Label> : <span />}
					{showValue && <span className="text-xs font-semibold uppercase tracking-widest text-app-text">{value}</span>}
				</div>
			)}
			<div className="relative" style={vertical ? { height: length, width: 18 } : undefined}>
				<input
					id={id}
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={e => onChange?.(Number(e.target.value))}
					onPointerDown={() => setDragging(true)}
					onFocus={event => setFocused(event.target.matches(':focus-visible'))}
					onBlur={() => setFocused(false)}
					style={
						{
							'--xd-fill': `${fill}%`,
							...(bufferFill !== undefined && { '--xd-buffer': `${bufferFill}%` }),
							...(vertical && {
								position: 'absolute',
								left: '50%',
								top: '50%',
								width: length,
								transform: 'translate(-50%, -50%) rotate(-90deg)',
							}),
						} as CSSProperties
					}
					aria-orientation={vertical ? 'vertical' : undefined}
					className={vertical ? 'xd-slider' : 'xd-slider w-full'}
					{...rest}
				/>
				{valueLabel && (
					// zero-size anchor that follows the thumb (the thumb is 14px wide, so its centre drifts 7px across the track)
					<span
						ref={anchorRef}
						aria-hidden="true"
						className={`pointer-events-none absolute ${vertical ? 'left-0 h-0 w-full' : 'top-0 h-full w-0'}`}
						style={
							vertical
								? { bottom: `calc(${fill}% + ${7 - fill * 0.14}px)` }
								: { left: `calc(${fill}% + ${7 - fill * 0.14}px)` }
						}
					/>
				)}
			</div>
			{valueLabel && (
				<FloatingPanel
					open={dragging || focused}
					anchorRef={anchorRef}
					placement={vertical ? 'right' : 'top'}
					gap={2}
					aria-hidden="true"
					className="pointer-events-none border border-app-border bg-app-card px-2 py-1 text-xs font-semibold tabular-nums text-app-text shadow-xl"
				>
					{valueLabel(value)}
				</FloatingPanel>
			)}
		</div>
	)
}

export default Slider
