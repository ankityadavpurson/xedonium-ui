import { useState } from 'react'
import ButtonGroup, { type ButtonGroupProps } from './ButtonGroup'
import { ToggleGroupContext } from './ToggleButton'

export type ToggleValue = string | string[] | null

export interface ToggleButtonGroupProps extends Omit<ButtonGroupProps, 'onChange' | 'defaultValue'> {
	/** Pressed value(s): a string (or null) with `exclusive`, an array of strings otherwise. Controlled. */
	value?: ToggleValue
	/** Initial value when uncontrolled. */
	defaultValue?: ToggleValue
	/** Receives the new value: a string or null with `exclusive`, an array otherwise. */
	onChange?: (value: ToggleValue) => void
	/** Allow one pressed button at most, like radio buttons that can also be cleared. */
	exclusive?: boolean
}

const asArray = (value: ToggleValue | undefined): string[] =>
	value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]

/**
 * A row of ToggleButtons that share a value. By default any number can be pressed (`value` is an array of their
 * `value`s); with `exclusive` at most one can (`value` is a string, or null when none is). Controlled with
 * `value` + `onChange`, or uncontrolled with `defaultValue`. Layout props are those of ButtonGroup.
 */
const ToggleButtonGroup = ({
	value,
	defaultValue,
	onChange,
	exclusive = false,
	children,
	...rest
}: ToggleButtonGroupProps) => {
	const [inner, setInner] = useState<ToggleValue>(defaultValue ?? (exclusive ? null : []))
	const current = asArray(value !== undefined ? value : inner)

	const context = {
		isSelected: (item: string) => current.includes(item),
		toggle: (item: string) => {
			let next: ToggleValue
			if (exclusive) next = current.includes(item) ? null : item
			else next = current.includes(item) ? current.filter(v => v !== item) : [...current, item]
			if (value === undefined) setInner(next)
			onChange?.(next)
		},
	}

	return (
		<ToggleGroupContext.Provider value={context}>
			<ButtonGroup {...rest}>{children}</ButtonGroup>
		</ToggleGroupContext.Provider>
	)
}

export default ToggleButtonGroup
