import { useId } from 'react'

/** Range input. `onChange` receives a number. */
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
				className="w-full cursor-pointer accent-[rgb(var(--color-app-strong))]"
				{...rest}
			/>
		</div>
	)
}

export default Slider
