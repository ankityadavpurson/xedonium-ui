import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'role'> {
	checked: boolean
	/** Receives the new boolean. */
	onChange?: (checked: boolean) => void
	label?: ReactNode
	/** Print | (on) or 0 (off) inside the track, opposite the thumb. */
	showState?: boolean
}

/** On/off toggle (role="switch"). `onChange` receives the new boolean. */
const Switch = ({
	checked,
	onChange,
	label,
	showState = false,
	disabled = false,
	className = '',
	...rest
}: SwitchProps) => (
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		disabled={disabled}
		onClick={() => onChange?.(!checked)}
		className={`inline-flex min-h-8 items-center gap-2 text-sm text-app-text disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
		{...rest}
	>
		<span
			aria-hidden="true"
			className={`relative inline-block h-5 w-9 shrink-0 border transition ${
				checked ? 'border-app-strong bg-app-strong' : 'border-app-border bg-app-bg'
			}`}
		>
			{showState && (
				<span
					className={`absolute top-0 flex h-full w-4 items-center justify-center text-[10px] font-bold leading-none ${
						checked ? 'left-0.5 text-app-bg' : 'right-0.5 text-app-muted'
					}`}
				>
					{checked ? '|' : '0'}
				</span>
			)}
			<span
				className={`absolute top-0.5 h-3.5 w-3.5 transition-all ${
					checked ? 'left-[1.1rem] bg-app-bg' : 'left-0.5 bg-app-muted'
				}`}
			/>
		</span>
		{label}
	</button>
)

export default Switch
