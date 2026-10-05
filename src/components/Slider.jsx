import { useId } from 'react'

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
				<div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-app-muted">
					<label htmlFor={id}>{label}</label>
					{showValue && <span className="text-app-text">{value}</span>}
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
