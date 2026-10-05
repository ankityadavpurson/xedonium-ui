import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import Calendar from '../../src/components/Calendar'
import DatePicker from '../../src/components/DatePicker'
import DateRangePicker from '../../src/components/DateRangePicker'
import TimePicker from '../../src/components/TimePicker'

const day = (y, m, d) => screen.getByRole('button', { name: new Date(y, m, d).toDateString() })

describe('Calendar', () => {
	const value = new Date(2024, 4, 15)

	it('renders the month of the value with weekday headers', () => {
		render(<Calendar value={value} locale="en-US" />)
		expect(screen.getByText('May 2024')).toBeInTheDocument()
		expect(screen.getAllByRole('columnheader')).toHaveLength(7)
		expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Su')
		expect(day(2024, 4, 15).closest('td')).toHaveAttribute('aria-selected', 'true')
		expect(day(2024, 4, 14).closest('td')).toHaveAttribute('aria-selected', 'false')
	})

	it('picks a day and reports it', () => {
		const onChange = vi.fn()
		render(<Calendar value={value} onChange={onChange} />)
		fireEvent.click(day(2024, 4, 20))
		expect(onChange).toHaveBeenCalledWith(new Date(2024, 4, 20))
		expect(day(2024, 4, 20)).toHaveAttribute('tabindex', '0')
	})

	it('works without onChange and without a value (today)', () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2024, 4, 10, 12))
		render(<Calendar locale="en-US" />)
		expect(screen.getByText('May 2024')).toBeInTheDocument()
		expect(day(2024, 4, 10)).toHaveAttribute('aria-current', 'date')
		fireEvent.click(day(2024, 4, 11))
	})

	it('highlights today even when it is selected', () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2024, 4, 15, 9))
		render(<Calendar value={value} />)
		expect(day(2024, 4, 15)).toHaveAttribute('aria-current', 'date')
	})

	it('navigates months with the header buttons', () => {
		render(<Calendar value={new Date(2024, 0, 31)} locale="en-US" />)
		fireEvent.click(screen.getByLabelText('Next month'))
		expect(screen.getByText('February 2024')).toBeInTheDocument()
		expect(day(2024, 1, 28)).toHaveAttribute('tabindex', '0')
		fireEvent.click(screen.getByLabelText('Previous month'))
		fireEvent.click(screen.getByLabelText('Previous month'))
		expect(screen.getByText('December 2023')).toBeInTheDocument()
	})

	it('moves focus with the keyboard, including across months', () => {
		render(<Calendar value={value} locale="en-US" />)
		const press = key => fireEvent.keyDown(document.activeElement ?? document.body, { key })
		day(2024, 4, 15).focus()
		press('ArrowRight')
		expect(day(2024, 4, 16)).toHaveFocus()
		press('ArrowLeft')
		expect(day(2024, 4, 15)).toHaveFocus()
		press('ArrowDown')
		expect(day(2024, 4, 22)).toHaveFocus()
		press('ArrowUp')
		expect(day(2024, 4, 15)).toHaveFocus()
		press('Home')
		expect(day(2024, 4, 12)).toHaveFocus() // Sunday
		press('End')
		expect(day(2024, 4, 18)).toHaveFocus() // Saturday
		press('PageDown')
		expect(screen.getByText('June 2024')).toBeInTheDocument()
		expect(day(2024, 5, 18)).toHaveFocus()
		press('PageUp')
		expect(screen.getByText('May 2024')).toBeInTheDocument()
		press('Tab') // unhandled
		expect(day(2024, 4, 18)).toHaveFocus()
	})

	it('crosses a month boundary with arrow keys', () => {
		render(<Calendar value={new Date(2024, 4, 31)} locale="en-US" />)
		day(2024, 4, 31).focus()
		fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' })
		expect(screen.getByText('June 2024')).toBeInTheDocument()
		expect(day(2024, 5, 1)).toHaveFocus()
	})

	it('respects weekStartsOn', () => {
		render(<Calendar value={value} weekStartsOn={1} locale="en-US" />)
		expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Mo')
		day(2024, 4, 15).focus()
		fireEvent.keyDown(document.activeElement, { key: 'Home' })
		expect(day(2024, 4, 13)).toHaveFocus() // Monday
	})

	it('disables days outside min/max', () => {
		render(<Calendar value={value} min={new Date(2024, 4, 10)} max={new Date(2024, 4, 20)} />)
		expect(day(2024, 4, 9)).toBeDisabled()
		expect(day(2024, 4, 21)).toBeDisabled()
		expect(day(2024, 4, 10)).not.toBeDisabled()
	})

	it('marks a range, in either order', () => {
		const { rerender } = render(
			<Calendar rangeStart={new Date(2024, 4, 10)} rangeEnd={new Date(2024, 4, 14)} locale="en-US" />
		)
		expect(day(2024, 4, 10).closest('td')).toHaveAttribute('aria-selected', 'true')
		expect(day(2024, 4, 12)).toHaveClass('bg-app-soft/20')
		expect(day(2024, 4, 15)).not.toHaveClass('bg-app-soft/20')
		rerender(<Calendar rangeStart={new Date(2024, 4, 14)} rangeEnd={new Date(2024, 4, 10)} />)
		expect(day(2024, 4, 12)).toHaveClass('bg-app-soft/20')
		rerender(<Calendar rangeStart={new Date(2024, 4, 14)} />)
		expect(day(2024, 4, 12)).not.toHaveClass('bg-app-soft/20')
	})
})

describe('DatePicker', () => {
	it('shows a placeholder, label and error', () => {
		render(<DatePicker label="Birthday" error="Required" placeholder="Pick one" />)
		expect(screen.getByText('Pick one')).toBeInTheDocument()
		const button = screen.getByLabelText('Birthday')
		expect(button).toHaveAttribute('aria-invalid', 'true')
		expect(button).toHaveAccessibleDescription('Required')
	})

	it('shows the formatted value', () => {
		render(<DatePicker value={new Date(2024, 4, 3)} locale="en-US" />)
		expect(screen.getByRole('button')).toHaveTextContent('May 3, 2024')
	})

	it('opens, picks a date, closes and refocuses the trigger', () => {
		const onChange = vi.fn()
		render(<DatePicker label="Date" value={new Date(2024, 4, 3)} onChange={onChange} />)
		const trigger = screen.getByLabelText('Date')
		fireEvent.click(trigger)
		expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument()
		fireEvent.click(day(2024, 4, 20))
		expect(onChange).toHaveBeenCalledWith(new Date(2024, 4, 20))
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(trigger).toHaveFocus()
	})

	it('closes on Escape and outside click and works without onChange', () => {
		render(<DatePicker value={new Date(2024, 4, 3)} />)
		const trigger = screen.getByRole('button')
		fireEvent.click(trigger)
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(trigger).toHaveFocus()
		fireEvent.click(trigger)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(trigger)
		fireEvent.click(day(2024, 4, 4))
		expect(screen.queryByRole('dialog')).toBeNull()
	})
})

describe('DateRangePicker', () => {
	const open = () => fireEvent.click(screen.getAllByRole('button')[0])

	it('shows placeholder and label, error and formatted ranges', () => {
		const { rerender } = render(<DateRangePicker label="Stay" error="Bad" />)
		expect(screen.getByText('Select range')).toBeInTheDocument()
		expect(screen.getByLabelText('Stay')).toHaveAccessibleDescription('Bad')
		rerender(<DateRangePicker value={{ start: new Date(2024, 4, 3), end: new Date(2024, 4, 9) }} locale="en-US" />)
		expect(screen.getByRole('button')).toHaveTextContent('May 3, 2024 – May 9, 2024')
		rerender(<DateRangePicker value={{ start: new Date(2024, 4, 3), end: null }} locale="en-US" />)
		expect(screen.getByRole('button')).toHaveTextContent('May 3, 2024 – …')
	})

	it('picks start then end and closes', () => {
		const onChange = vi.fn()
		render(
			<DateRangePicker
				label="Stay"
				value={{ start: new Date(2024, 4, 1), end: new Date(2024, 4, 2) }}
				onChange={onChange}
			/>
		)
		const trigger = screen.getByLabelText('Stay')
		open()
		fireEvent.click(day(2024, 4, 10))
		expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 4, 10), end: null })
		expect(screen.getByRole('dialog')).toBeInTheDocument()
		fireEvent.click(day(2024, 4, 15))
		expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 4, 10), end: new Date(2024, 4, 15) })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(trigger).toHaveFocus()
	})

	it('accepts the end before the start', () => {
		const onChange = vi.fn()
		render(<DateRangePicker value={{ start: new Date(2024, 4, 1), end: null }} onChange={onChange} />)
		open()
		fireEvent.click(day(2024, 4, 20))
		fireEvent.click(day(2024, 4, 5))
		expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 4, 5), end: new Date(2024, 4, 20) })
	})

	it('toggles closed, resets pending on dismissal, and works without onChange', () => {
		render(<DateRangePicker value={{ start: new Date(2024, 4, 1), end: null }} />)
		const trigger = screen.getByRole('button')
		fireEvent.click(trigger)
		fireEvent.click(screen.getByRole('button', { name: new Date(2024, 4, 3).toDateString() }))
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(trigger).toHaveFocus()
		fireEvent.click(trigger)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(trigger)
		fireEvent.click(trigger)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(trigger)
		fireEvent.click(day(2024, 4, 4))
		fireEvent.click(day(2024, 4, 6))
	})
})

describe('TimePicker', () => {
	const Stateful = ({ initial = '', onChange, ...props }) => {
		const [value, setValue] = useState(initial)
		return (
			<TimePicker
				label="Time"
				value={value}
				onChange={v => {
					setValue(v)
					onChange?.(v)
				}}
				{...props}
			/>
		)
	}
	const column = name => within(screen.getByRole('dialog')).getByRole('listbox', { name })
	const option = (name, label) => within(column(name)).getByRole('option', { name: label })
	const trigger = () => screen.getByLabelText('Time')

	it('shows the placeholder, parses values and formats 24h/12h', () => {
		const { rerender } = render(<TimePicker label="Time" value="" />)
		expect(trigger()).toHaveTextContent('Select time')
		rerender(<TimePicker label="Time" value="14:30" />)
		expect(trigger()).toHaveTextContent('14:30')
		rerender(<TimePicker label="Time" value="14:30" hour12 />)
		expect(trigger()).toHaveTextContent('02:30 PM')
		rerender(<TimePicker label="Time" value="00:05" hour12 />)
		expect(trigger()).toHaveTextContent('12:05 AM')
		rerender(<TimePicker label="Time" value="25:00" placeholder="None" />)
		expect(trigger()).toHaveTextContent('None')
		rerender(<TimePicker value={undefined} />)
	})

	it('renders error, disabled state and passes extra props', () => {
		render(<TimePicker label="Time" error="Bad" disabled data-x="1" className="k" />)
		expect(trigger()).toBeDisabled()
		expect(trigger()).toHaveAttribute('data-x', '1')
		expect(trigger()).toHaveAccessibleDescription('Bad')
	})

	it('picks hours and minutes, keeping the minute when possible', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} />)
		fireEvent.click(trigger())
		fireEvent.click(option('Hours', '09'))
		expect(onChange).toHaveBeenLastCalledWith('09:00')
		fireEvent.click(option('Minutes', '30'))
		expect(onChange).toHaveBeenLastCalledWith('09:30')
		fireEvent.click(option('Hours', '10'))
		expect(onChange).toHaveBeenLastCalledWith('10:30')
		expect(trigger()).toHaveTextContent('10:30')
	})

	it('sets the minute with no hour yet, using the min hour when present', () => {
		const onChange = vi.fn()
		const { unmount } = render(<Stateful onChange={onChange} />)
		fireEvent.click(trigger())
		fireEvent.click(option('Minutes', '45'))
		expect(onChange).toHaveBeenLastCalledWith('00:45')
		unmount()
		render(<Stateful onChange={onChange} min="08:30" />)
		fireEvent.click(trigger())
		fireEvent.click(option('Minutes', '45'))
		expect(onChange).toHaveBeenLastCalledWith('08:45')
	})

	it('honours step, min and max', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} initial="10:00" step={1800} min="09:30" max="11:15" />)
		fireEvent.click(trigger())
		expect(within(column('Minutes')).getAllByRole('option')).toHaveLength(2)
		expect(option('Hours', '08')).toBeDisabled()
		expect(option('Hours', '12')).toBeDisabled()
		fireEvent.click(option('Hours', '11'))
		expect(onChange).toHaveBeenLastCalledWith('11:00')
		expect(option('Minutes', '30')).toBeDisabled()
		fireEvent.click(option('Hours', '09'))
		expect(onChange).toHaveBeenLastCalledWith('09:30') // 09:00 not allowed -> nearest allowed
	})

	it('clamps tiny steps to one minute', () => {
		render(<TimePicker label="Time" value="" step={10} />)
		fireEvent.click(trigger())
		expect(within(column('Minutes')).getAllByRole('option')).toHaveLength(60)
	})

	it('falls back to minute 0 when nothing is allowed', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} min="10:00" max="09:00" />)
		fireEvent.click(trigger())
		expect(option('Hours', '10')).toBeDisabled()
	})

	it('supports the 12-hour clock with AM/PM', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} hour12 initial="09:15" />)
		fireEvent.click(trigger())
		expect(within(column('Hours')).getAllByRole('option')).toHaveLength(12)
		fireEvent.click(option('AM or PM', 'PM'))
		expect(onChange).toHaveBeenLastCalledWith('21:15')
		fireEvent.click(option('AM or PM', 'AM'))
		expect(onChange).toHaveBeenLastCalledWith('09:15')
		fireEvent.click(option('Hours', '12'))
		expect(onChange).toHaveBeenLastCalledWith('00:15')
		fireEvent.click(option('AM or PM', 'PM'))
		expect(onChange).toHaveBeenLastCalledWith('12:15')
		fireEvent.click(option('Hours', '03'))
		expect(onChange).toHaveBeenLastCalledWith('15:15')
	})

	it('picks AM/PM before any time is chosen', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} hour12 />)
		fireEvent.click(trigger())
		fireEvent.click(option('AM or PM', 'PM'))
		expect(onChange).toHaveBeenLastCalledWith('12:00')
	})

	it('focuses the selected hour on open and navigates by keyboard', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} initial="09:15" />)
		fireEvent.click(trigger())
		expect(option('Hours', '09')).toHaveFocus()
		fireEvent.keyDown(option('Hours', '09'), { key: 'ArrowDown' })
		expect(onChange).toHaveBeenLastCalledWith('10:15')
		expect(option('Hours', '10')).toHaveFocus()
		fireEvent.keyDown(option('Hours', '10'), { key: 'ArrowUp' })
		expect(onChange).toHaveBeenLastCalledWith('09:15')
		fireEvent.keyDown(option('Hours', '09'), { key: 'ArrowRight' })
		expect(option('Minutes', '15')).toHaveFocus()
		fireEvent.keyDown(option('Minutes', '15'), { key: 'ArrowRight' }) // no column to the right
		fireEvent.keyDown(option('Minutes', '15'), { key: 'ArrowLeft' })
		expect(option('Hours', '09')).toHaveFocus()
		fireEvent.keyDown(option('Hours', '09'), { key: 'ArrowLeft' }) // no column to the left
		fireEvent.keyDown(option('Hours', '09'), { key: 'x' })
	})

	it('clamps keyboard movement at the ends and skips disabled options', () => {
		const onChange = vi.fn()
		render(<Stateful onChange={onChange} initial="00:00" min="00:00" max="02:00" />)
		fireEvent.click(trigger())
		fireEvent.keyDown(option('Hours', '00'), { key: 'ArrowUp' })
		expect(onChange).toHaveBeenLastCalledWith('00:00')
		fireEvent.keyDown(option('Hours', '00'), { key: 'ArrowDown' })
		fireEvent.keyDown(option('Hours', '01'), { key: 'ArrowDown' })
		fireEvent.keyDown(option('Hours', '02'), { key: 'ArrowDown' })
		expect(onChange).toHaveBeenLastCalledWith('02:00')
	})

	it('focuses the first enabled hour when there is no value', () => {
		render(<Stateful min="05:00" />)
		fireEvent.click(trigger())
		expect(option('Hours', '05')).toHaveFocus()
	})

	it('hops columns into the first enabled option when none is selected', () => {
		render(<Stateful />)
		fireEvent.click(trigger())
		fireEvent.keyDown(option('Hours', '00'), { key: 'ArrowRight' })
		expect(option('Minutes', '00')).toHaveFocus()
	})

	it('closes on Escape, outside click and toggling', () => {
		render(<Stateful initial="09:00" />)
		fireEvent.click(trigger())
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(trigger()).toHaveFocus()
		fireEvent.click(trigger())
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(trigger())
		fireEvent.click(trigger())
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('works without onChange', () => {
		render(<TimePicker label="Time" value="09:00" />)
		fireEvent.click(trigger())
		fireEvent.click(option('Hours', '10'))
		fireEvent.click(option('Minutes', '30'))
	})

	it('scrolls selected options into view inside their columns', () => {
		render(<Stateful initial="09:15" />)
		fireEvent.click(trigger())
		expect(column('Hours').scrollTop).toBeDefined()
	})
})
