import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createRef, useState } from 'react'
import Backdrop from '../../src/components/Backdrop'
import FloatingActionButton from '../../src/components/FloatingActionButton'
import Menu from '../../src/components/Menu'
import NumberField from '../../src/components/NumberField'
import Rating from '../../src/components/Rating'
import SpeedDial from '../../src/components/SpeedDial'
import ToggleButton from '../../src/components/ToggleButton'
import ToggleButtonGroup from '../../src/components/ToggleButtonGroup'
import TransferList from '../../src/components/TransferList'

describe('FloatingActionButton', () => {
	it('is a square icon button sized by `size`', () => {
		render(
			<FloatingActionButton aria-label="Add" size="lg">
				<svg data-testid="i" />
			</FloatingActionButton>
		)
		const button = screen.getByRole('button', { name: 'Add' })
		expect(button).toHaveClass('h-16', 'w-16', 'shadow-xl')
		expect(button).toHaveClass('[&>svg]:h-6')
		expect(button).not.toHaveClass('fixed')
	})

	it('is extended when it has a label', () => {
		render(
			<FloatingActionButton label="Create" variant="success">
				<svg />
			</FloatingActionButton>
		)
		const button = screen.getByRole('button', { name: 'Create' })
		expect(button).toHaveClass('h-12', '!px-5')
		expect(button).not.toHaveClass('w-14')
		expect(button.className).toContain('bg-emerald-600')
	})

	it('takes a variant name or any CSS color through `color`, with readable text', () => {
		const { rerender } = render(<FloatingActionButton aria-label="a" color="danger" />)
		const button = screen.getByRole('button')
		expect(button.className).toContain('text-red-700')
		expect(button.style.backgroundColor).toBe('')
		rerender(<FloatingActionButton aria-label="a" color="#2563eb" />)
		expect(button.style.backgroundColor).toBe('#2563eb')
		expect(button.style.borderColor).toBe('#2563eb')
		expect(button.style.color).toBe('#ffffff')
		rerender(<FloatingActionButton aria-label="a" color="#facc15" style={{ opacity: 0.5 }} />)
		expect(button.style.color).toBe('#000000')
		expect(button.style.opacity).toBe('0.5')
	})

	it('is square by default and round with shape="circle"', () => {
		const { rerender } = render(<FloatingActionButton aria-label="a" />)
		expect(screen.getByRole('button')).not.toHaveClass('rounded-full')
		rerender(<FloatingActionButton aria-label="a" shape="circle" label="Go" />)
		expect(screen.getByRole('button')).toHaveClass('rounded-full')
	})

	it('can be fixed to a corner and passes props through', () => {
		const onClick = vi.fn()
		render(<FloatingActionButton position="top-left" aria-label="Go" onClick={onClick} data-x="1" />)
		const button = screen.getByRole('button')
		expect(button).toHaveClass('fixed', 'top-5', 'left-5')
		expect(button).toHaveAttribute('data-x', '1')
		fireEvent.click(button)
		expect(onClick).toHaveBeenCalled()
	})
})

describe('Backdrop', () => {
	it('renders nothing while closed and its children while open', () => {
		const { rerender } = render(<Backdrop open={false}>hello</Backdrop>)
		expect(screen.queryByText('hello')).toBeNull()
		rerender(<Backdrop open>hello</Backdrop>)
		expect(screen.getByText('hello')).toBeInTheDocument()
	})

	it('closes on a click on the dimmed area and on Escape, but not on a click on its children', () => {
		const onClose = vi.fn()
		render(
			<Backdrop open onClose={onClose} data-testid="layer">
				<button>inside</button>
			</Backdrop>
		)
		fireEvent.click(screen.getByText('inside'))
		expect(onClose).not.toHaveBeenCalled()
		fireEvent.click(screen.getByTestId('layer'))
		expect(onClose).toHaveBeenCalledTimes(1)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledTimes(2)
	})

	it('does nothing on click or Escape without onClose, and forwards onClick', () => {
		const onClick = vi.fn()
		render(<Backdrop open onClick={onClick} data-testid="layer" />)
		fireEvent.click(screen.getByTestId('layer'))
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClick).toHaveBeenCalledTimes(1)
		expect(screen.getByTestId('layer')).toBeInTheDocument()
	})

	it('can be invisible, and cover just its parent instead of the viewport', () => {
		const { container } = render(
			<div>
				<Backdrop open invisible fullScreen={false} data-testid="layer" />
			</div>
		)
		const layer = screen.getByTestId('layer')
		expect(container.contains(layer)).toBe(true)
		expect(layer).toHaveClass('absolute')
		expect(layer.className).not.toContain('bg-black')
	})

	it('is portalled into the body and dims by default', () => {
		const { container } = render(<Backdrop open data-testid="layer" />)
		const layer = screen.getByTestId('layer')
		expect(container.contains(layer)).toBe(false)
		expect(layer).toHaveClass('fixed', 'bg-black/50')
	})
})

describe('ToggleButton', () => {
	it('toggles on its own through selected and onChange', () => {
		const onChange = vi.fn()
		const { rerender } = render(<ToggleButton onChange={onChange}>Pin</ToggleButton>)
		const button = screen.getByRole('button', { name: 'Pin' })
		expect(button).toHaveAttribute('aria-pressed', 'false')
		fireEvent.click(button)
		expect(onChange).toHaveBeenLastCalledWith(true)
		rerender(
			<ToggleButton selected onChange={onChange}>
				Pin
			</ToggleButton>
		)
		expect(button).toHaveAttribute('aria-pressed', 'true')
		fireEvent.click(button)
		expect(onChange).toHaveBeenLastCalledWith(false)
	})

	it('calls onClick too and works without onChange', () => {
		const onClick = vi.fn()
		render(<ToggleButton onClick={onClick}>Go</ToggleButton>)
		fireEvent.click(screen.getByRole('button'))
		expect(onClick).toHaveBeenCalled()
	})
})

describe('ToggleButtonGroup', () => {
	const group = props => (
		<ToggleButtonGroup aria-label="Format" {...props}>
			<ToggleButton value="bold">Bold</ToggleButton>
			<ToggleButton value="italic">Italic</ToggleButton>
			<ToggleButton value="off" disabled>
				Off
			</ToggleButton>
		</ToggleButtonGroup>
	)

	it('keeps several pressed (an array) when not exclusive, uncontrolled', () => {
		const onChange = vi.fn()
		render(group({ defaultValue: ['bold'], onChange }))
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
		fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
		expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic'])
		fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
		expect(onChange).toHaveBeenLastCalledWith(['italic'])
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false')
		expect(screen.getByRole('group', { name: 'Format' })).toBeInTheDocument()
	})

	it('keeps one pressed (a string or null) when exclusive', () => {
		const onChange = vi.fn()
		render(group({ exclusive: true, onChange }))
		fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
		expect(onChange).toHaveBeenLastCalledWith('bold')
		fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
		expect(onChange).toHaveBeenLastCalledWith('italic')
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false')
		fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
		expect(onChange).toHaveBeenLastCalledWith(null)
		expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'false')
	})

	it('is controlled when given a value, and starts from defaultValue when exclusive', () => {
		const onChange = vi.fn()
		const { rerender } = render(group({ value: [], onChange }))
		fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
		expect(onChange).toHaveBeenLastCalledWith(['bold'])
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false')
		rerender(group({ value: ['bold'], onChange }))
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
		rerender(group({ exclusive: true, value: 'italic', onChange }))
		expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true')
		rerender(group({ exclusive: true, defaultValue: 'bold' }))
		expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
	})

	it('does not change when a disabled button is clicked', () => {
		const onChange = vi.fn()
		render(group({ onChange }))
		fireEvent.click(screen.getByRole('button', { name: 'Off' }))
		expect(onChange).not.toHaveBeenCalled()
	})
})

describe('NumberField', () => {
	const Controlled = props => {
		const [value, setValue] = useState(props.start ?? 5)
		return <NumberField label="Count" value={value} onChange={setValue} {...props} />
	}

	it('steps with the buttons and clamps to min and max', () => {
		render(<Controlled min={4} max={6} />)
		const input = screen.getByRole('spinbutton', { name: 'Count' })
		expect(input).toHaveAttribute('aria-valuemin', '4')
		fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
		expect(input).toHaveValue('6')
		expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
		fireEvent.click(screen.getByRole('button', { name: 'Decrease' }))
		fireEvent.click(screen.getByRole('button', { name: 'Decrease' }))
		expect(input).toHaveValue('4')
		expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
	})

	it('steps with the arrow keys (Shift takes ten steps) and jumps with Home and End', () => {
		render(<Controlled min={0} max={100} />)
		const input = screen.getByRole('spinbutton')
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		expect(input).toHaveValue('6')
		fireEvent.keyDown(input, { key: 'ArrowUp', shiftKey: true })
		expect(input).toHaveValue('16')
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		expect(input).toHaveValue('15')
		fireEvent.keyDown(input, { key: 'End' })
		expect(input).toHaveValue('100')
		fireEvent.keyDown(input, { key: 'Home' })
		expect(input).toHaveValue('0')
		fireEvent.keyDown(input, { key: 'a' })
		expect(input).toHaveValue('0')
	})

	it('ignores Home and End without a min or max, and honours a key handler that prevents default', () => {
		const onKeyDown = vi.fn(event => event.key === 'ArrowUp' && event.preventDefault())
		render(<Controlled onKeyDown={onKeyDown} />)
		const input = screen.getByRole('spinbutton')
		fireEvent.keyDown(input, { key: 'Home' })
		fireEvent.keyDown(input, { key: 'End' })
		expect(input).toHaveValue('5')
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		expect(input).toHaveValue('5')
		expect(onKeyDown).toHaveBeenCalled()
	})

	it('reports numbers while typing and null when emptied, and clamps on blur', () => {
		const onChange = vi.fn()
		render(<NumberField label="N" value={5} onChange={onChange} min={0} max={10} />)
		const input = screen.getByRole('spinbutton')
		fireEvent.change(input, { target: { value: '7' } })
		expect(onChange).toHaveBeenLastCalledWith(7)
		fireEvent.change(input, { target: { value: '-' } })
		expect(onChange).toHaveBeenCalledTimes(1)
		fireEvent.change(input, { target: { value: '' } })
		expect(onChange).toHaveBeenLastCalledWith(null)
		fireEvent.change(input, { target: { value: '2.5' } })
		expect(onChange).toHaveBeenLastCalledWith(2.5)
	})

	it('clamps and rounds to the step precision when the field is left', () => {
		const onBlur = vi.fn()
		const Wrapper = () => {
			const [value, setValue] = useState(0)
			return <NumberField label="N" value={value} onChange={setValue} max={10} step={0.5} onBlur={onBlur} />
		}
		render(<Wrapper />)
		const input = screen.getByRole('spinbutton')
		fireEvent.change(input, { target: { value: '12.34' } })
		fireEvent.blur(input)
		expect(input).toHaveValue('10')
		expect(onBlur).toHaveBeenCalled()
		fireEvent.change(input, { target: { value: '3.14159' } })
		fireEvent.blur(input)
		expect(input).toHaveValue('3.1')
	})

	it('rounds stepped values to avoid float noise and respects `precision`', () => {
		render(<Controlled start={0.1} step={0.2} />)
		const input = screen.getByRole('spinbutton')
		fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
		expect(input).toHaveValue('0.3')
		render(<Controlled start={1} step={1} precision={2} label="P" />)
	})

	it('starts from the minimum when empty, and works uncontrolled', () => {
		const onChange = vi.fn()
		render(<NumberField label="N" min={3} onChange={onChange} />)
		const input = screen.getByRole('spinbutton')
		expect(input).toHaveValue('')
		fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
		expect(input).toHaveValue('3')
		expect(onChange).toHaveBeenLastCalledWith(3)
		fireEvent.click(screen.getByRole('button', { name: 'Decrease' }))
		expect(onChange).toHaveBeenLastCalledWith(3)
	})

	it('takes a defaultValue, and an empty field steps from 0 without a min', () => {
		render(<NumberField label="A" defaultValue={8} />)
		expect(screen.getByRole('spinbutton', { name: 'A' })).toHaveValue('8')
		render(<NumberField label="B" />)
		fireEvent.click(screen.getAllByRole('button', { name: 'Decrease' })[1])
		expect(screen.getByRole('spinbutton', { name: 'B' })).toHaveValue('-1')
	})

	it('shows helper text and errors, hides the buttons and can be disabled', () => {
		const { rerender } = render(<NumberField label="N" value={1} helperText="Pick one" />)
		expect(screen.getByText('Pick one')).toBeInTheDocument()
		expect(screen.getByRole('spinbutton')).toHaveAccessibleDescription('Pick one')
		rerender(<NumberField label="N" value={1} helperText="Pick one" error="Too low" />)
		expect(screen.queryByText('Pick one')).toBeNull()
		expect(screen.getByText('Too low')).toBeInTheDocument()
		expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true')
		rerender(<NumberField label="N" value={1} showControls={false} />)
		expect(screen.queryByRole('button')).toBeNull()
		rerender(<NumberField label="N" value={1} disabled />)
		const input = screen.getByRole('spinbutton')
		expect(input).toBeDisabled()
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		expect(input).toHaveValue('1')
	})

	it('uses a decimal keyboard when decimals or negatives are possible', () => {
		const { rerender } = render(<NumberField label="N" value={1} />)
		expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'numeric')
		rerender(<NumberField label="N" value={1} step={0.5} />)
		expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal')
		rerender(<NumberField label="N" value={1} min={-5} />)
		expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal')
	})
})

describe('Rating', () => {
	it('sets the rating on click and clears it when the same star is clicked again', () => {
		const onChange = vi.fn()
		render(<Rating label="Stars" onChange={onChange} />)
		const stars = screen.getAllByTestId('rating-icon')
		expect(stars).toHaveLength(5)
		fireEvent.click(stars[2])
		expect(onChange).toHaveBeenLastCalledWith(3)
		expect(screen.getByRole('slider', { name: 'Stars' })).toHaveAttribute('aria-valuenow', '3')
		fireEvent.click(stars[2])
		expect(onChange).toHaveBeenLastCalledWith(0)
	})

	it('is controlled by value', () => {
		const onChange = vi.fn()
		render(<Rating value={2} onChange={onChange} />)
		fireEvent.click(screen.getAllByTestId('rating-icon')[3])
		expect(onChange).toHaveBeenLastCalledWith(4)
		expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '2')
		expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '2 out of 5')
	})

	it('moves with the keyboard within 0 and max', () => {
		const onChange = vi.fn()
		render(<Rating defaultValue={4} max={5} onChange={onChange} />)
		const slider = screen.getByRole('slider')
		fireEvent.keyDown(slider, { key: 'ArrowRight' })
		expect(onChange).toHaveBeenLastCalledWith(5)
		fireEvent.keyDown(slider, { key: 'ArrowUp' })
		expect(onChange).toHaveBeenLastCalledWith(5)
		fireEvent.keyDown(slider, { key: 'ArrowLeft' })
		expect(onChange).toHaveBeenLastCalledWith(4)
		fireEvent.keyDown(slider, { key: 'ArrowDown' })
		fireEvent.keyDown(slider, { key: 'Home' })
		expect(onChange).toHaveBeenLastCalledWith(0)
		fireEvent.keyDown(slider, { key: 'ArrowLeft' })
		expect(onChange).toHaveBeenLastCalledWith(0)
		fireEvent.keyDown(slider, { key: 'End' })
		expect(onChange).toHaveBeenLastCalledWith(5)
		const calls = onChange.mock.calls.length
		fireEvent.keyDown(slider, { key: 'x' })
		expect(onChange).toHaveBeenCalledTimes(calls)
	})

	it('allows halves with precision 0.5, from the half of the star the pointer is over', () => {
		const onChange = vi.fn()
		render(<Rating precision={0.5} onChange={onChange} />)
		const star = screen.getAllByTestId('rating-icon')[1]
		star.getBoundingClientRect = () => ({ left: 100, width: 20, top: 0, height: 20, right: 120, bottom: 20 })
		fireEvent.mouseMove(star, { clientX: 105 })
		fireEvent.click(star, { clientX: 105 })
		expect(onChange).toHaveBeenLastCalledWith(1.5)
		fireEvent.click(star, { clientX: 115 })
		expect(onChange).toHaveBeenLastCalledWith(2)
		fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' })
		expect(onChange).toHaveBeenLastCalledWith(2.5)
	})

	it('previews the hovered value and goes back on leave', () => {
		render(<Rating value={1} />)
		const stars = screen.getAllByTestId('rating-icon')
		fireEvent.mouseMove(stars[3])
		const fills = () => stars.map(s => s.lastChild.style.width)
		expect(fills()).toEqual(['100%', '100%', '100%', '100%', '0%'])
		fireEvent.mouseLeave(screen.getByRole('slider'))
		expect(fills()).toEqual(['100%', '0%', '0%', '0%', '0%'])
	})

	it('fills part of a star for fractional values', () => {
		render(<Rating value={2.5} readOnly />)
		const stars = screen.getAllByTestId('rating-icon')
		expect(stars[2].lastChild.style.width).toBe('50%')
	})

	it('colors the filled icons with a theme color or any CSS color', () => {
		const { rerender } = render(<Rating value={2} />)
		const fill = () => screen.getAllByTestId('rating-icon')[0].lastChild
		expect(fill()).toHaveClass('text-app-strong')
		rerender(<Rating value={2} color="warning" />)
		expect(fill()).toHaveClass('text-amber-400')
		rerender(<Rating value={2} color="danger" />)
		expect(fill()).toHaveClass('text-red-500')
		rerender(<Rating value={2} color="#2563eb" />)
		expect(fill().className).not.toContain('text-app-strong')
		expect(fill().style.color).toBe('#2563eb')
	})

	it('shows a read-only score as an image that cannot change', () => {
		const onChange = vi.fn()
		render(<Rating value={4.5} readOnly onChange={onChange} label="Average" />)
		const rating = screen.getByRole('img', { name: 'Average: 4.5 out of 5' })
		expect(rating).not.toHaveAttribute('tabindex')
		fireEvent.click(screen.getAllByTestId('rating-icon')[0])
		fireEvent.keyDown(rating, { key: 'ArrowRight' })
		expect(onChange).not.toHaveBeenCalled()
	})

	it('can be disabled, resized, given more icons and a custom icon', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Rating value={1} disabled onChange={onChange} />)
		const slider = screen.getByRole('slider')
		expect(slider).toHaveAttribute('aria-disabled', 'true')
		fireEvent.click(screen.getAllByTestId('rating-icon')[2])
		fireEvent.keyDown(slider, { key: 'ArrowRight' })
		expect(onChange).not.toHaveBeenCalled()
		rerender(<Rating max={10} size="sm" icon={<i data-testid="custom" />} />)
		expect(screen.getAllByTestId('rating-icon')).toHaveLength(10)
		expect(screen.getAllByTestId('custom')).toHaveLength(20)
	})
})

describe('TransferList', () => {
	const items = [
		{ key: 'a', label: 'Alpha' },
		{ key: 'b', label: 'Beta' },
		{ key: 'c', label: 'Gamma' },
		{ key: 'd', label: 'Delta (locked)', disabled: true },
	]
	const tick = name => fireEvent.click(screen.getByRole('checkbox', { name }))

	it('moves ticked items to the right and back, keeping the original order', () => {
		const onChange = vi.fn()
		render(<TransferList items={items} onChange={onChange} />)
		const [left, right] = screen.getAllByRole('listbox')
		expect(within(left).getAllByRole('option')).toHaveLength(4)
		expect(screen.getByRole('button', { name: 'Move selected to the right' })).toBeDisabled()
		tick('Gamma')
		tick('Alpha')
		fireEvent.click(screen.getByRole('button', { name: 'Move selected to the right' }))
		expect(onChange).toHaveBeenLastCalledWith(['a', 'c'])
		expect(
			within(right)
				.getAllByRole('option')
				.map(o => o.textContent)
		).toEqual(['Alpha', 'Gamma'])
		tick('Alpha')
		fireEvent.click(screen.getByRole('button', { name: 'Move selected to the left' }))
		expect(onChange).toHaveBeenLastCalledWith(['c'])
	})

	it('moves everything that can move, but not disabled items', () => {
		const onChange = vi.fn()
		render(<TransferList items={items} onChange={onChange} />)
		fireEvent.click(screen.getByRole('button', { name: 'Move all to the right' }))
		expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c'])
		expect(screen.getByRole('button', { name: 'Move all to the right' })).toBeDisabled()
		fireEvent.click(screen.getByRole('button', { name: 'Move all to the left' }))
		expect(onChange).toHaveBeenLastCalledWith([])
		expect(screen.getByRole('button', { name: 'Move all to the left' })).toBeDisabled()
	})

	it('ticks a whole list from its header and shows the counts', () => {
		render(<TransferList items={items} titles={['Left side', 'Right side']} defaultValue={['b']} />)
		expect(screen.getByText('Left side')).toBeInTheDocument()
		expect(screen.getByText('0/3 selected')).toBeInTheDocument()
		const header = screen.getByRole('checkbox', { name: 'Select all in Left side' })
		fireEvent.click(header)
		expect(screen.getByText('2/3 selected')).toBeInTheDocument()
		expect(screen.getByRole('checkbox', { name: 'Delta (locked)' })).not.toBeChecked()
		fireEvent.click(header)
		expect(screen.getByText('0/3 selected')).toBeInTheDocument()
		tick('Alpha')
		expect(header).toHaveProperty('indeterminate', true)
	})

	it('is controlled by value and says when a list is empty', () => {
		const onChange = vi.fn()
		render(<TransferList items={items.slice(0, 2)} value={['a', 'b']} onChange={onChange} />)
		expect(screen.getByText('Nothing here')).toBeInTheDocument()
		tick('Alpha')
		fireEvent.click(screen.getByRole('button', { name: 'Move selected to the left' }))
		expect(onChange).toHaveBeenLastCalledWith(['b'])
		expect(screen.getAllByRole('option')).toHaveLength(2)
	})

	it('has no select-all for a list with only disabled items', () => {
		render(<TransferList items={[{ key: 'x', label: 'Locked', disabled: true }]} />)
		expect(screen.getByRole('checkbox', { name: 'Select all in Choices' })).toBeDisabled()
		expect(screen.getByRole('group', { name: 'Transfer list' })).toBeInTheDocument()
	})
})

describe('SpeedDial', () => {
	const actions = (onClick = vi.fn()) => [
		{ key: 'copy', icon: <svg />, label: 'Copy', onClick },
		{ key: 'save', icon: <svg />, label: 'Save', disabled: true },
	]

	it('opens and closes on click, and runs an action then closes', () => {
		const onClick = vi.fn()
		render(<SpeedDial actions={actions(onClick)} />)
		const main = screen.getByRole('button', { name: 'Actions' })
		expect(main).toHaveAttribute('aria-expanded', 'false')
		expect(screen.queryByRole('menuitem')).toBeNull()
		fireEvent.click(main)
		expect(main).toHaveAttribute('aria-expanded', 'true')
		expect(screen.getAllByRole('menuitem')).toHaveLength(2)
		expect(screen.getByRole('menuitem', { name: 'Save' })).toBeDisabled()
		fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }))
		expect(onClick).toHaveBeenCalled()
		expect(screen.queryByRole('menuitem')).toBeNull()
		fireEvent.click(main)
		fireEvent.click(main)
		expect(screen.queryByRole('menuitem')).toBeNull()
	})

	it('opens on hover and closes when the pointer leaves', () => {
		const { container } = render(<SpeedDial actions={actions()} />)
		fireEvent.mouseEnter(container.firstChild)
		expect(screen.getAllByRole('menuitem')).toHaveLength(2)
		fireEvent.mouseLeave(container.firstChild)
		expect(screen.queryByRole('menuitem')).toBeNull()
	})

	it('closes on Escape (returning focus) and on an outside click', () => {
		render(<SpeedDial actions={actions()} defaultOpen />)
		expect(screen.getAllByRole('menuitem')).toHaveLength(2)
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('menuitem')).toBeNull()
		expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('menuitem')).toBeNull()
	})

	it('can be controlled and reports changes', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(<SpeedDial actions={actions()} open={false} onOpenChange={onOpenChange} />)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(onOpenChange).toHaveBeenLastCalledWith(true)
		expect(screen.queryByRole('menuitem')).toBeNull()
		rerender(<SpeedDial actions={actions()} open onOpenChange={onOpenChange} />)
		expect(screen.getAllByRole('menuitem')).toHaveLength(2)
	})

	it('lays the actions out by direction, with labels beside them when asked', () => {
		const { rerender } = render(<SpeedDial actions={actions()} defaultOpen direction="right" showLabels />)
		expect(screen.getByRole('menu')).toHaveClass('left-full')
		expect(screen.getByText('Copy', { selector: 'span' })).toBeInTheDocument()
		rerender(<SpeedDial actions={actions()} defaultOpen direction="down" />)
		expect(screen.getByRole('menu')).toHaveClass('top-full')
		rerender(<SpeedDial actions={actions()} defaultOpen direction="left" />)
		expect(screen.getByRole('menu')).toHaveClass('right-full')
		rerender(<SpeedDial actions={actions()} defaultOpen />)
		expect(screen.getByRole('menu')).toHaveClass('bottom-full')
	})

	it('makes the main button and the actions round with shape="circle"', () => {
		render(<SpeedDial actions={actions()} shape="circle" defaultOpen />)
		expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass('rounded-full')
		expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveClass('rounded-full')
	})

	it('colors the main button, not the actions', () => {
		render(<SpeedDial actions={actions()} color="#e11d48" defaultOpen />)
		expect(screen.getByRole('button', { name: 'Actions' }).style.backgroundColor).toBe('#e11d48')
		expect(screen.getByRole('menuitem', { name: 'Copy' }).style.backgroundColor).toBe('')
	})

	it('swaps the icon while open, fixes itself to a corner, and can be hidden', () => {
		const { container, rerender } = render(
			<SpeedDial
				actions={actions()}
				icon={<i data-testid="closed" />}
				openIcon={<i data-testid="opened" />}
				position="bottom-left"
			/>
		)
		expect(screen.getByTestId('closed')).toBeInTheDocument()
		expect(container.firstChild).toHaveClass('fixed', 'bottom-5', 'left-5')
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(screen.getByTestId('opened')).toBeInTheDocument()
		rerender(<SpeedDial actions={actions()} hidden />)
		expect(container.firstChild).toBeNull()
	})
})

describe('Menu', () => {
	const open = () => fireEvent.click(screen.getByRole('button', { name: 'File' }))
	const basic = (extra = {}) => (
		<Menu
			label="File"
			trigger="File"
			items={[
				{ key: 'new', label: 'New', shortcut: 'Ctrl+N', icon: <svg data-testid="icon" />, onClick: extra.onNew },
				{ key: 'off', label: 'Off', disabled: true },
				{ key: 'd', divider: true },
				{ key: 'del', label: 'Delete', tone: 'danger', onClick: extra.onDelete },
			]}
			{...extra.props}
		/>
	)
	const nested = (spies = {}) => (
		<Menu
			label="File"
			trigger="File"
			items={[
				{
					key: 'recent',
					label: 'Recent',
					children: [
						{ key: 'a', label: 'Report', onClick: spies.onReport },
						{
							key: 'older',
							label: 'Older',
							children: [{ key: 'b', label: 'Notes', onClick: spies.onNotes }],
						},
					],
				},
				{ key: 'save', label: 'Save', onClick: spies.onSave },
			]}
		/>
	)

	it('opens from the trigger, lists its items, and closes when the trigger is clicked again', () => {
		render(basic())
		const trigger = screen.getByRole('button', { name: 'File' })
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
		expect(screen.queryByRole('menu')).toBeNull()
		open()
		expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument()
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(screen.getAllByRole('menuitem')).toHaveLength(3)
		expect(screen.getByRole('separator')).toBeInTheDocument()
		expect(screen.getByText('Ctrl+N')).toBeInTheDocument()
		expect(screen.getByRole('menuitem', { name: 'Off' })).toBeDisabled()
		open()
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('runs an item, closes, and returns focus to the trigger', () => {
		const onNew = vi.fn()
		render(basic({ onNew }))
		open()
		expect(screen.getByRole('menuitem', { name: /New/ })).toHaveFocus()
		fireEvent.click(screen.getByRole('menuitem', { name: /New/ }))
		expect(onNew).toHaveBeenCalled()
		expect(screen.queryByRole('menu')).toBeNull()
		expect(screen.getByRole('button', { name: 'File' })).toHaveFocus()
	})

	it('moves with the arrow keys, wrapping, and with Home and End', () => {
		render(basic())
		open()
		const menu = screen.getByRole('menu')
		const [first, last] = [
			screen.getByRole('menuitem', { name: /New/ }),
			screen.getByRole('menuitem', { name: 'Delete' }),
		]
		fireEvent.keyDown(menu, { key: 'ArrowDown' })
		expect(last).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'ArrowDown' })
		expect(first).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'ArrowUp' })
		expect(last).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'Home' })
		expect(first).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'End' })
		expect(last).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'ArrowRight' })
		fireEvent.keyDown(menu, { key: 'ArrowLeft' })
		expect(screen.getByRole('menu')).toBeInTheDocument()
		fireEvent.keyDown(menu, { key: 'x' })
		expect(last).toHaveFocus()
	})

	it('closes on Escape (focus back on the trigger), Tab, and an outside click', () => {
		render(basic())
		open()
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
		expect(screen.queryByRole('menu')).toBeNull()
		expect(screen.getByRole('button', { name: 'File' })).toHaveFocus()
		open()
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' })
		expect(screen.queryByRole('menu')).toBeNull()
		open()
		fireEvent.mouseDown(screen.getByRole('menu'))
		expect(screen.getByRole('menu')).toBeInTheDocument()
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('opens a submenu on hover and on click, and closes it when another item is hovered', () => {
		render(nested())
		open()
		const recent = screen.getByRole('menuitem', { name: 'Recent' })
		expect(recent).toHaveAttribute('aria-haspopup', 'menu')
		expect(recent).toHaveAttribute('aria-expanded', 'false')
		fireEvent.mouseEnter(recent)
		expect(screen.getAllByRole('menu')).toHaveLength(2)
		expect(recent).toHaveAttribute('aria-expanded', 'true')
		expect(screen.getByRole('menu', { name: 'Recent' })).toBeInTheDocument()
		fireEvent.mouseEnter(screen.getByRole('menuitem', { name: 'Save' }))
		expect(screen.getAllByRole('menu')).toHaveLength(1)
		fireEvent.click(recent)
		expect(screen.getAllByRole('menu')).toHaveLength(2)
	})

	it('nests to any depth, and a click in a submenu runs the item and closes everything', () => {
		const onNotes = vi.fn()
		render(nested({ onNotes }))
		open()
		fireEvent.mouseEnter(screen.getByRole('menuitem', { name: 'Recent' }))
		fireEvent.mouseEnter(screen.getByRole('menuitem', { name: 'Older' }))
		expect(screen.getAllByRole('menu')).toHaveLength(3)
		fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Notes' }))
		expect(screen.getAllByRole('menu')).toHaveLength(3)
		fireEvent.click(screen.getByRole('menuitem', { name: 'Notes' }))
		expect(onNotes).toHaveBeenCalled()
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('opens a submenu with ArrowRight (focusing its first item) and closes just that level with ArrowLeft or Escape', () => {
		render(nested())
		open()
		const recent = screen.getByRole('menuitem', { name: 'Recent' })
		recent.focus()
		fireEvent.keyDown(screen.getAllByRole('menu')[0], { key: 'ArrowRight' })
		expect(screen.getAllByRole('menu')).toHaveLength(2)
		expect(screen.getByRole('menuitem', { name: 'Report' })).toHaveFocus()
		fireEvent.keyDown(screen.getAllByRole('menu')[1], { key: 'ArrowLeft' })
		expect(screen.getAllByRole('menu')).toHaveLength(1)
		expect(recent).toHaveFocus()
		fireEvent.keyDown(screen.getAllByRole('menu')[0], { key: 'ArrowRight' })
		fireEvent.keyDown(screen.getAllByRole('menu')[1], { key: 'Escape' })
		expect(screen.getAllByRole('menu')).toHaveLength(1)
		expect(recent).toHaveFocus()
		fireEvent.keyDown(screen.getAllByRole('menu')[0], { key: 'Escape' })
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('opens a submenu from the keyboard with Enter, and focuses its first item', () => {
		render(nested())
		open()
		const recent = screen.getByRole('menuitem', { name: 'Recent' })
		fireEvent.click(recent, { detail: 0 })
		expect(screen.getByRole('menuitem', { name: 'Report' })).toHaveFocus()
	})

	it('ignores ArrowRight on an item without a submenu', () => {
		render(nested())
		open()
		screen.getByRole('menuitem', { name: 'Save' }).focus()
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowRight' })
		expect(screen.getAllByRole('menu')).toHaveLength(1)
	})

	it('does not react to hovering a disabled item', () => {
		render(basic())
		open()
		const disabled = screen.getByRole('menuitem', { name: 'Off' })
		fireEvent.mouseEnter(disabled)
		expect(disabled).not.toHaveFocus()
	})

	it('can be controlled and anchored to your own element without a trigger', () => {
		const anchor = createRef()
		const onOpenChange = vi.fn()
		const Wrapper = ({ isOpen }) => (
			<>
				<span ref={anchor}>anchor</span>
				<Menu
					label="Account"
					anchorRef={anchor}
					open={isOpen}
					onOpenChange={onOpenChange}
					items={[{ key: 'x', label: 'Profile' }]}
				/>
			</>
		)
		const { rerender } = render(<Wrapper isOpen={false} />)
		expect(screen.queryByRole('menu')).toBeNull()
		rerender(<Wrapper isOpen />)
		expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument()
		fireEvent.mouseDown(screen.getByText('anchor'))
		expect(onOpenChange).not.toHaveBeenCalled()
		fireEvent.mouseDown(document.body)
		expect(onOpenChange).toHaveBeenLastCalledWith(false)
		fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }))
		expect(onOpenChange).toHaveBeenCalledTimes(2)
	})

	it('starts open with defaultOpen and takes a placement', () => {
		render(basic({ props: { defaultOpen: true, placement: 'bottom-end', variant: 'flat' } }))
		expect(screen.getByRole('menu')).toBeInTheDocument()
	})
})

it('leaves no stray timers or portals behind', () => {
	act(() => {})
	expect(document.querySelectorAll('[role="menu"]')).toHaveLength(0)
})
