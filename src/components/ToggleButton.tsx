import { createContext, useContext } from 'react'
import Button, { type ButtonProps } from './Button'

export interface ToggleGroupContextValue {
	isSelected: (value: string) => boolean
	toggle: (value: string) => void
}

/** Lets the buttons inside a ToggleButtonGroup read and change the group's value. */
export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

export interface ToggleButtonProps extends Omit<ButtonProps, 'value' | 'onChange' | 'variant'> {
	/** Identifies the button inside a ToggleButtonGroup. */
	value?: string
	/** Pressed state when used on its own (inside a group the group decides). */
	selected?: boolean
	/** Receives the new pressed state when used on its own. */
	onChange?: (selected: boolean) => void
}

/**
 * A button that stays pressed: `selected` + `onChange` on its own, or give it a `value` inside a ToggleButtonGroup.
 * The pressed state is exposed as `aria-pressed`, and shown as a filled button.
 */
const ToggleButton = ({ value, selected = false, onChange, onClick, children, ...rest }: ToggleButtonProps) => {
	const group = useContext(ToggleGroupContext)
	const pressed = group && value !== undefined ? group.isSelected(value) : selected

	return (
		<Button
			variant={pressed ? 'default' : 'secondary'}
			aria-pressed={pressed}
			onClick={event => {
				onClick?.(event)
				if (group && value !== undefined) group.toggle(value)
				else onChange?.(!pressed)
			}}
			{...rest}
		>
			{children}
		</Button>
	)
}

export default ToggleButton
