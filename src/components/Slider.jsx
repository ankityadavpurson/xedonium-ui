import { useId } from 'react'
import Label from './Label'

/** Range input with a square thumb and a filled track (styled in styles.css). `onChange` receives a number. */
const Slider = ({
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	showValue = true,
	className = '',
	...rest
}) => {
	const id = useId()
	const span = max - min
	const fill = span > 0 ? Math.min(100, Math.max(0, ((value - min) / span) * 100)) : 0
	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{(label || showValue) && (
				<div className="flex items-center justify-between gap-2">
					{label ? <Label htmlFor={id}>{label}</Label> : <span />}
					{showValue && <span className="text-xs font-semibold uppercase tracking-widest text-app-text">{value}</span>}
				</div>
			)}
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={e => onChange?.(Number(e.target.value))}
				style={{ '--xd-fill': `${fill}%` }}
				className="xd-slider w-full"
				{...rest}
			/>
		</div>
	)
}

export default Slider
