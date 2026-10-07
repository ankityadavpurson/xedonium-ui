import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'role'> {
	checked: boolean
	/** Receives the new boolean. */
	onChange?: (checked: boolean) => void
	label?: ReactNode
}

/** On/off toggle (role="switch"). `onChange` receives the new boolean. */
const Switch = ({ checked, onChange, label, disabled = false, className = '', ...rest }: SwitchProps) => (
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
