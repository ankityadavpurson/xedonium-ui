import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import Button from '../../src/components/Button'
import Checkbox from '../../src/components/Checkbox'
import FanFavicon from '../../src/components/FanFavicon'
import Field from '../../src/components/Field'
import FileUpload from '../../src/components/FileUpload'
import Input from '../../src/components/Input'
import LoadingScreen from '../../src/components/LoadingScreen'
import PasswordInput from '../../src/components/PasswordInput'
import PageLayout from '../../src/components/PageLayout'
import Radio from '../../src/components/Radio'
import RadioGroup from '../../src/components/RadioGroup'
import Select from '../../src/components/Select'
import Slider from '../../src/components/Slider'
import Switch from '../../src/components/Switch'
import TextArea from '../../src/components/TextArea'
import ThemeToggle from '../../src/components/ThemeToggle'
import Tooltip from '../../src/components/Tooltip'
import { ThemeContext } from '../../src/theme/ThemeContext'

describe('Button', () => {
	it('renders variants, handles clicks and disabled state', () => {
		const onClick = vi.fn()
		const { rerender } = render(<Button onClick={onClick}>Go</Button>)
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
		fireEvent.click(screen.getByRole('button'))
		expect(onClick).toHaveBeenCalledTimes(1)
		for (const variant of ['secondary', 'flat', 'danger', 'success', 'warning']) {
			rerender(<Button variant={variant}>Go</Button>)
			expect(screen.getByRole('button')).toBeInTheDocument()
		}
		rerender(
			<Button type="submit" disabled>
				Go
			</Button>
		)
		expect(screen.getByRole('button')).toBeDisabled()
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
	})
	it('wraps in a tooltip when asked', () => {
		render(
			<Button tooltip="Hint" tooltipPlacement="top">
				Go
			</Button>
		)
		expect(screen.getByRole('button')).toHaveAccessibleDescription('Hint')
	})
})

describe('Tooltip on SVG shapes', () => {
	it('wraps in the given element, follows the pointer and skips the span-only description', () => {
		render(
			<svg>
				<Tooltip as="g" text="Detail" followPointer placement="top">
					<circle r="5" />
				</Tooltip>
			</svg>
		)
		const group = document.querySelector('svg > g')
		expect(group).toBeInTheDocument()
		expect(document.querySelector('svg span')).toBeNull()
		fireEvent.mouseEnter(group, { clientX: 50, clientY: 60 })
		expect(document.body.querySelector('.pointer-events-none.fixed')).toHaveTextContent('Detail')
		fireEvent.mouseMove(group, { clientX: 70, clientY: 80 })
		expect(document.body.querySelector('.pointer-events-none.fixed')).toBeInTheDocument()
		fireEvent.mouseLeave(group)
		expect(document.body.querySelector('.pointer-events-none.fixed')).toBeNull()
	})

	it('ignores pointer movement unless followPointer is set', () => {
		render(
			<svg>
				<Tooltip as="g" text="Detail">
					<circle r="5" />
				</Tooltip>
			</svg>
		)
		const group = document.querySelector('svg > g')
		fireEvent.mouseEnter(group)
		fireEvent.mouseMove(group, { clientX: 5, clientY: 5 })
		expect(document.body.querySelector('.pointer-events-none.fixed')).toHaveTextContent('Detail')
	})
})

describe('Tooltip', () => {
	it('returns children untouched without text', () => {
		render(
			<Tooltip>
				<button>solo</button>
			</Tooltip>
		)
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
	})

	it('shows on hover, hides on leave, pointer down, blur', () => {
		render(
			<Tooltip text="Tip">
				<button>trigger</button>
			</Tooltip>
		)
		const wrapper = screen.getByRole('button').parentElement
		fireEvent.mouseEnter(wrapper)
		expect(document.body.querySelector('[aria-hidden="true"]')).toHaveTextContent('Tip')
		fireEvent.mouseLeave(wrapper)
		expect(screen.queryByText('Tip', { selector: 'div' })).toBeNull()
		fireEvent.mouseEnter(wrapper)
		fireEvent.pointerDown(wrapper)
		expect(screen.queryByText('Tip', { selector: 'div' })).toBeNull()
		fireEvent.mouseEnter(wrapper)
		fireEvent.blur(screen.getByRole('button'))
		expect(screen.queryByText('Tip', { selector: 'div' })).toBeNull()
	})

	it('shows on keyboard focus only (focus-visible)', () => {
		render(
			<Tooltip text="Tip" placement="top">
				<button>trigger</button>
			</Tooltip>
		)
		const button = screen.getByRole('button')
		vi.spyOn(button, 'matches').mockReturnValue(false)
		fireEvent.focus(button)
		expect(screen.queryByText('Tip', { selector: 'div' })).toBeNull()
		button.matches.mockReturnValue(true)
		fireEvent.focus(button)
		expect(screen.getByText('Tip', { selector: 'div' })).toBeInTheDocument()
	})

	it('closes on Escape, scroll and resize', () => {
		render(
			<Tooltip text="Tip">
				<button>trigger</button>
			</Tooltip>
		)
		const wrapper = screen.getByRole('button').parentElement
		for (const fire of [
			() => fireEvent.keyDown(window, { key: 'Escape' }),
			() => fireEvent.scroll(window),
			() => fireEvent.resize(window),
		]) {
			fireEvent.mouseEnter(wrapper)
			expect(screen.getByText('Tip', { selector: 'div' })).toBeInTheDocument()
			fire()
			expect(screen.queryByText('Tip', { selector: 'div' })).toBeNull()
		}
		fireEvent.mouseEnter(wrapper)
		fireEvent.keyDown(window, { key: 'a' })
		expect(screen.getByText('Tip', { selector: 'div' })).toBeInTheDocument()
	})

	it('skips aria-describedby when the child already has the same aria-label', () => {
		render(
			<Tooltip text="Close">
				<button aria-label="Close">x</button>
			</Tooltip>
		)
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby')
	})

	it('positions the tooltip once measured', () => {
		render(
			<Tooltip text="Tip">
				<button>trigger</button>
			</Tooltip>
		)
		fireEvent.mouseEnter(screen.getByRole('button').parentElement)
		expect(screen.getByText('Tip', { selector: 'div' })).toHaveStyle({ visibility: 'visible' })
	})
})

describe('ThemeToggle', () => {
	const renderWith = (activeTheme, ui) => {
		const toggleTheme = vi.fn()
		render(<ThemeContext.Provider value={{ activeTheme, toggleTheme }}>{ui}</ThemeContext.Provider>)
		return toggleTheme
	}
	it('renders the button variant and toggles', () => {
		const toggle = renderWith('dark', <ThemeToggle />)
		fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
		expect(toggle).toHaveBeenCalled()
	})
	it('renders the toolbar variant in light mode', () => {
		const toggle = renderWith('light', <ThemeToggle variant="toolbar" />)
		fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
		expect(toggle).toHaveBeenCalled()
	})
})

describe('PageLayout / LoadingScreen', () => {
	it('lays out children with optional toggle and centering', () => {
		const { container, rerender } = render(
			<PageLayout outerClassName="o" innerClassName="i">
				kid
			</PageLayout>
		)
		expect(container.querySelector('main')).toHaveClass('o')
		expect(screen.queryByRole('button')).toBeNull()
		rerender(
			<PageLayout themeToggle centerContent maxWidth="max-w-sm">
				kid
			</PageLayout>
		)
		expect(screen.getByRole('button')).toBeInTheDocument()
		expect(screen.getByText('kid')).toHaveClass('items-center', 'max-w-sm')
	})
	it('LoadingScreen shows the default fan loader and forwards loader props', () => {
		const { rerender } = render(<LoadingScreen />)
		expect(screen.getByRole('status')).toHaveTextContent('Loading')
		rerender(<LoadingScreen variant="card" size="sm" label="Saving" description="Hold on" />)
		expect(screen.getByRole('status')).toHaveTextContent('Saving')
		expect(screen.getByText('Hold on')).toBeInTheDocument()
	})
})

describe('FanFavicon', () => {
	it('is decorative by default and labelled when asked', () => {
		const { container, rerender } = render(<FanFavicon />)
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
		rerender(<FanFavicon label="Busy" size={20} />)
		expect(screen.getByRole('img', { name: 'Busy' })).toHaveAttribute('width', '20')
	})

	it('follows the document theme and honours an override', async () => {
		const { container, rerender } = render(<FanFavicon />)
		const fill = () => container.querySelector('circle').getAttribute('fill')
		const light = fill()
		await act(async () => {
			document.documentElement.setAttribute('data-theme', 'dark')
			await Promise.resolve()
		})
		await vi.waitFor(() => expect(fill()).not.toBe(light))
		rerender(<FanFavicon theme="light" />)
		expect(fill()).toBe(light)
	})

	it('spins the blades each frame and cancels on unmount', () => {
		const frames = []
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => frames.push(cb))
		const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
		const { container, unmount } = render(<FanFavicon />)
		act(() => frames.shift()(0))
		act(() => frames.shift()(1000))
		expect(container.querySelector('g').getAttribute('transform')).toMatch(/^rotate\(/)
		unmount()
		expect(cancel).toHaveBeenCalled()
	})

	it('falls back to the light palette for unknown themes', () => {
		const { container } = render(<FanFavicon theme="sepia" />)
		expect(container.querySelector('circle')).toBeInTheDocument()
	})
})

describe('Checkbox', () => {
	it('toggles and reports the boolean', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Checkbox label="Agree" checked={false} onChange={onChange} />)
		fireEvent.click(screen.getByLabelText('Agree'))
		expect(onChange).toHaveBeenCalledWith(true)
		rerender(<Checkbox label="Agree" checked onChange={onChange} />)
		expect(screen.getByLabelText('Agree')).toBeChecked()
		fireEvent.click(screen.getByLabelText('Agree'))
		expect(onChange).toHaveBeenLastCalledWith(false)
	})
	it('supports indeterminate, disabled and no onChange', () => {
		const { rerender } = render(<Checkbox label="Mixed" checked={false} indeterminate />)
		expect(screen.getByLabelText('Mixed').indeterminate).toBe(true)
		rerender(<Checkbox label="Mixed" checked={false} disabled />)
		expect(screen.getByLabelText('Mixed')).toBeDisabled()
		fireEvent.click(screen.getByLabelText('Mixed'))
		rerender(<Checkbox label="Free" checked={false} onChange={undefined} />)
		fireEvent.click(screen.getByLabelText('Free'))
	})
})

describe('Switch', () => {
	it('toggles via click and reflects state', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Switch label="Wifi" checked={false} onChange={onChange} />)
		fireEvent.click(screen.getByRole('switch'))
		expect(onChange).toHaveBeenCalledWith(true)
		rerender(<Switch label="Wifi" checked onChange={onChange} />)
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
		fireEvent.click(screen.getByRole('switch'))
		expect(onChange).toHaveBeenLastCalledWith(false)
		rerender(<Switch checked={false} disabled />)
		expect(screen.getByRole('switch')).toBeDisabled()
		rerender(<Switch checked={false} />)
		fireEvent.click(screen.getByRole('switch'))
	})
})

describe('Radio / RadioGroup', () => {
	it('Radio renders an input with label and disabled state', () => {
		const { rerender } = render(<Radio label="One" name="g" value="1" onChange={() => {}} />)
		expect(screen.getByLabelText('One')).toHaveAttribute('type', 'radio')
		rerender(<Radio label="One" disabled onChange={() => {}} />)
		expect(screen.getByLabelText('One')).toBeDisabled()
	})
	it('RadioGroup selects values and honours direction, name and disabled options', () => {
		const onChange = vi.fn()
		const options = [
			{ value: 'a', label: 'A' },
			{ value: 'b', label: 'B' },
			{ value: 'c', label: 'C', disabled: true },
		]
		const { rerender } = render(<RadioGroup label="Pick" value="a" onChange={onChange} options={options} />)
		expect(screen.getByLabelText('A')).toBeChecked()
		fireEvent.click(screen.getByLabelText('B'))
		expect(onChange).toHaveBeenCalledWith('b')
		expect(screen.getByLabelText('C')).toBeDisabled()
		rerender(<RadioGroup name="grp" direction="row" value="b" options={options} />)
		expect(screen.getByLabelText('B')).toHaveAttribute('name', 'grp')
		fireEvent.click(screen.getByLabelText('A'))
	})
})

describe('Input', () => {
	it('reports string values, forwards refs, supports invalid', () => {
		const onChange = vi.fn()
		const ref = createRef()
		const { rerender } = render(<Input ref={ref} value="" onChange={onChange} placeholder="p" />)
		fireEvent.change(screen.getByPlaceholderText('p'), { target: { value: 'hi' } })
		expect(onChange).toHaveBeenCalledWith('hi')
		expect(ref.current).toBe(screen.getByPlaceholderText('p'))
		rerender(<Input value="" invalid type="email" className="k" placeholder="p" />)
		expect(screen.getByPlaceholderText('p')).toHaveAttribute('aria-invalid', 'true')
		expect(screen.getByPlaceholderText('p')).toHaveAttribute('type', 'email')
		fireEvent.change(screen.getByPlaceholderText('p'), { target: { value: 'z' } })
	})
})

describe('Field', () => {
	it('labels the input and reports values', () => {
		const onChange = vi.fn()
		render(<Field label="Email" value="" onChange={onChange} placeholder="you@x" />)
		fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a' } })
		expect(onChange).toHaveBeenCalledWith('a')
		expect(screen.getByLabelText('Email')).toHaveAttribute('aria-required', 'true')
	})
	it('shows errors accessibly', () => {
		render(<Field label="Email" value="" onChange={() => {}} error="Required" required={false} type="email" />)
		const input = screen.getByLabelText('Email')
		expect(input).toHaveAttribute('aria-invalid', 'true')
		expect(input).toHaveAccessibleDescription('Required')
		expect(input).toHaveAttribute('aria-required', 'false')
	})
})

describe('Slider', () => {
	it('emits numbers and shows the value', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Slider label="Vol" value={30} onChange={onChange} />)
		fireEvent.change(screen.getByLabelText('Vol'), { target: { value: '55' } })
		expect(onChange).toHaveBeenCalledWith(55)
		expect(screen.getByText('30')).toBeInTheDocument()
		rerender(<Slider value={150} min={0} max={100} showValue={false} />)
		expect(screen.getByRole('slider')).toBeInTheDocument()
		rerender(<Slider value={5} min={5} max={5} />)
		expect(screen.getByRole('slider').style.getPropertyValue('--xd-fill')).toBe('0%')
		rerender(<Slider value={5} />)
		fireEvent.change(screen.getByRole('slider'), { target: { value: '6' } })
		rerender(<Slider value={-5} label="x" showValue={false} />)
	})
})

describe('Slider buffered', () => {
	it('sets the buffered band, never behind the thumb, and omits it by default', () => {
		const { rerender } = render(<Slider aria-label="Seek" value={20} buffered={60} />)
		const input = screen.getByRole('slider', { name: 'Seek' })
		expect(input.style.getPropertyValue('--xd-fill')).toBe('20%')
		expect(input.style.getPropertyValue('--xd-buffer')).toBe('60%')
		rerender(<Slider aria-label="Seek" value={50} buffered={10} />)
		expect(screen.getByRole('slider', { name: 'Seek' }).style.getPropertyValue('--xd-buffer')).toBe('50%')
		rerender(<Slider aria-label="Seek" value={50} buffered={500} />)
		expect(screen.getByRole('slider', { name: 'Seek' }).style.getPropertyValue('--xd-buffer')).toBe('100%')
		rerender(<Slider aria-label="Seek" value={50} />)
		expect(screen.getByRole('slider', { name: 'Seek' }).style.getPropertyValue('--xd-buffer')).toBe('')
	})
})

describe('Slider vertical', () => {
	it('is upright, announces its orientation and anchors the popover to the thumb height', () => {
		render(<Slider aria-label="Level" orientation="vertical" value={50} showValue={false} valueLabel={v => `${v}!`} />)
		const input = screen.getByRole('slider', { name: 'Level' })
		expect(input).toHaveAttribute('aria-orientation', 'vertical')
		expect(input.style.transform).toContain('rotate(-90deg)')
		expect(input.style.width).toBe('112px')
		expect(input.parentElement.style.height).toBe('112px')
		fireEvent.pointerDown(input)
		expect(document.querySelector('[aria-hidden="true"].pointer-events-none.border')).toHaveTextContent('50!')
		const anchor = document.querySelector('span.absolute.h-0')
		expect(anchor.style.bottom).toContain('50%')
	})

	it('honours a custom length', () => {
		render(<Slider aria-label="Level" orientation="vertical" length={200} value={0} />)
		const input = screen.getByRole('slider', { name: 'Level' })
		expect(input.style.width).toBe('200px')
		expect(input.parentElement.style.height).toBe('200px')
	})

	it('stays horizontal by default', () => {
		render(<Slider aria-label="Level" value={50} />)
		const input = screen.getByRole('slider', { name: 'Level' })
		expect(input).not.toHaveAttribute('aria-orientation')
		expect(input).toHaveClass('w-full')
	})
})

describe('Slider valueLabel popover', () => {
	const popover = () => document.querySelector('[aria-hidden="true"].pointer-events-none.border')

	it('shows the formatted value while dragging and hides it afterwards', () => {
		render(
			<Slider aria-label="Seek" value={65} max={300} showValue={false} valueLabel={s => `t=${s}`} onChange={() => {}} />
		)
		const input = screen.getByRole('slider', { name: 'Seek' })
		expect(popover()).toBeNull()
		fireEvent.pointerDown(input)
		expect(popover()).toHaveTextContent('t=65')
		fireEvent.pointerUp(window)
		expect(popover()).toBeNull()
		fireEvent.pointerDown(input)
		fireEvent.pointerCancel(window)
		expect(popover()).toBeNull()
	})

	it('shows it for keyboard focus only and never without valueLabel', () => {
		const { rerender } = render(<Slider aria-label="Seek" value={5} showValue={false} valueLabel={s => `${s}!`} />)
		const input = screen.getByRole('slider', { name: 'Seek' })
		input.matches = () => true
		fireEvent.focus(input)
		expect(popover()).toHaveTextContent('5!')
		fireEvent.blur(input)
		expect(popover()).toBeNull()
		input.matches = () => false
		fireEvent.focus(input)
		expect(popover()).toBeNull()
		delete input.matches
		rerender(<Slider aria-label="Seek" value={5} showValue={false} />)
		fireEvent.pointerDown(screen.getByRole('slider', { name: 'Seek' }))
		expect(popover()).toBeNull()
	})
})

describe('FileUpload', () => {
	const file = (name = 'a.txt', size = 3) => new File(['x'.repeat(size)], name)

	it('lists files chosen via the input', () => {
		const onChange = vi.fn()
		render(<FileUpload onChange={onChange} accept=".txt" multiple />)
		const input = document.querySelector('input[type=file]')
		fireEvent.change(input, { target: { files: [file('a.txt'), file('b.txt', 5)] } })
		expect(onChange).toHaveBeenCalledWith([expect.any(File), expect.any(File)])
		expect(screen.getByText('a.txt')).toBeInTheDocument()
		expect(screen.getByText('b.txt')).toBeInTheDocument()
	})

	it('accepts dropped files, keeping only one when not multiple', () => {
		const onChange = vi.fn()
		const { rerender } = render(<FileUpload onChange={onChange} />)
		const zone = screen.getByText('Choose files or drop them here')
		fireEvent.dragOver(zone)
		expect(zone).toHaveClass('border-app-strong')
		fireEvent.dragLeave(zone)
		fireEvent.dragOver(zone)
		fireEvent.drop(zone, { dataTransfer: { files: [file('one.txt'), file('two.txt')] } })
		expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'one.txt' })])
		expect(screen.queryByText('two.txt')).toBeNull()
		fireEvent.drop(zone, { dataTransfer: { files: [] } })
		expect(onChange).toHaveBeenLastCalledWith([])
		rerender(<FileUpload multiple onChange={onChange} />)
		fireEvent.drop(screen.getByText('Choose files or drop them here'), {
			dataTransfer: { files: [file('x.txt'), file('y.txt')] },
		})
		expect(screen.getByText('y.txt')).toBeInTheDocument()
	})

	it('ignores drops when disabled and works without onChange', () => {
		const onChange = vi.fn()
		const { rerender } = render(<FileUpload disabled label="Nope" onChange={onChange} />)
		const zone = screen.getByText('Nope')
		fireEvent.dragOver(zone)
		fireEvent.drop(zone, { dataTransfer: { files: [file()] } })
		expect(onChange).not.toHaveBeenCalled()
		rerender(<FileUpload />)
		fireEvent.change(document.querySelector('input[type=file]'), { target: { files: [file()] } })
		expect(screen.getByText('a.txt')).toBeInTheDocument()
	})
})

describe('Select flat variant', () => {
	it('drops the border and fill but keeps behaving like a select', () => {
		const onChange = vi.fn()
		const options = [
			{ value: 'a', label: 'Alpha' },
			{ value: 'b', label: 'Beta' },
		]
		const { rerender } = render(
			<Select aria-label="Pick" variant="flat" value="a" onChange={onChange} options={options} />
		)
		const trigger = screen.getByRole('combobox', { name: 'Pick' })
		expect(trigger).toHaveClass('bg-transparent', 'border-transparent')
		fireEvent.click(trigger)
		fireEvent.click(screen.getByRole('option', { name: 'Beta' }))
		expect(onChange).toHaveBeenCalledWith('b')
		rerender(<Select aria-label="Pick" variant="flat" value="a" error="Bad" onChange={onChange} options={options} />)
		expect(screen.getByRole('combobox', { name: 'Pick' })).toHaveClass('border-red-500')
	})
})

describe('Select', () => {
	const options = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry', disabled: true },
		{ value: 'cherry', label: 'Cherry' },
	]
	const setup = (props = {}) => {
		const onChange = vi.fn()
		const utils = render(<Select label="Fruit" value="apple" onChange={onChange} options={options} {...props} />)
		return { onChange, combo: screen.getByRole('combobox'), ...utils }
	}
	const key = (el, k, extra = {}) => fireEvent.keyDown(el, { key: k, ...extra })

	it('shows the selected label or placeholder', () => {
		const { combo, rerender } = setup()
		expect(combo).toHaveTextContent('Apple')
		rerender(<Select placeholder="Choose" value="zzz" options={options} />)
		expect(screen.getByRole('combobox')).toHaveTextContent('Choose')
		rerender(<Select value={undefined} options={options} />)
		expect(screen.getByRole('combobox')).toBeInTheDocument()
	})

	it('opens by click, picks an option and focuses the button', () => {
		const { combo, onChange } = setup()
		fireEvent.click(combo)
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		expect(combo).toHaveAttribute('aria-expanded', 'true')
		fireEvent.mouseDown(screen.getByText('Cherry'))
		fireEvent.mouseMove(screen.getByText('Cherry'))
		fireEvent.click(screen.getByText('Cherry'))
		expect(onChange).toHaveBeenCalledWith('cherry')
		expect(screen.queryByRole('listbox')).toBeNull()
		expect(combo).toHaveFocus()
	})

	it('ignores clicks and hover on disabled options and toggles closed', () => {
		const { combo, onChange } = setup()
		fireEvent.click(combo)
		fireEvent.mouseMove(screen.getByText('Blueberry'))
		fireEvent.click(screen.getByText('Blueberry'))
		expect(onChange).not.toHaveBeenCalled()
		fireEvent.click(combo)
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('navigates with the keyboard', () => {
		const { combo, onChange } = setup()
		key(combo, 'ArrowDown')
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		key(combo, 'ArrowDown') // skips the disabled option
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-1$/)
		key(combo, 'ArrowDown')
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-3$/)
		key(combo, 'ArrowDown') // clamped
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-3$/)
		key(combo, 'ArrowUp')
		key(combo, 'Home')
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-0$/)
		key(combo, 'End')
		key(combo, 'Enter')
		expect(onChange).toHaveBeenCalledWith('cherry')
	})

	it('selects with Space, closes with Escape and Tab', () => {
		const { combo, onChange } = setup()
		key(combo, ' ')
		key(combo, 'ArrowDown')
		key(combo, ' ')
		expect(onChange).toHaveBeenCalledWith('banana')
		key(combo, 'Enter')
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		key(combo, 'Escape') // handled by useDismissable
		expect(screen.queryByRole('listbox')).toBeNull()
		expect(combo).toHaveFocus()
		key(combo, 'ArrowUp')
		key(combo, 'Tab')
		expect(screen.queryByRole('listbox')).toBeNull()
		key(combo, 'ArrowDown')
		key(combo, 'F5') // unhandled key keeps the list open
		expect(screen.getByRole('listbox')).toBeInTheDocument()
	})

	it('dismisses on outside click', () => {
		const { combo } = setup()
		fireEvent.click(combo)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('supports type-ahead when closed and open', () => {
		vi.useFakeTimers()
		const { combo, onChange } = setup()
		key(combo, 'c')
		expect(onChange).toHaveBeenCalledWith('cherry')
		key(combo, 'x') // no match
		key(combo, 'c', { ctrlKey: true }) // ignored with modifiers
		act(() => vi.advanceTimersByTime(700))
		key(combo, 'ArrowDown')
		key(combo, 'b')
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-1$/)
		key(combo, 'l') // "bl" matches the disabled option, which is skipped, so no change
		key(combo, 'c', { metaKey: true })
		expect(screen.getByRole('listbox')).toBeInTheDocument()
	})

	it('opens with no selection on the first enabled option', () => {
		const { combo } = setup({ value: 'none' })
		fireEvent.click(combo)
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-0$/)
	})

	it('falls back when the selected option is disabled', () => {
		const { combo } = setup({ value: 'blueberry' })
		fireEvent.click(combo)
		expect(combo.getAttribute('aria-activedescendant')).toMatch(/opt-0$/)
	})

	it('does nothing when disabled', () => {
		const { combo } = setup({ disabled: true })
		fireEvent.click(combo)
		key(combo, 'ArrowDown')
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('handles empty / all-disabled lists', () => {
		const { combo, rerender } = setup({ options: [] })
		key(combo, 'ArrowDown')
		key(combo, 'ArrowDown')
		key(combo, 'Home')
		key(combo, 'End')
		key(combo, 'Enter')
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		rerender(<Select options={[{ value: 'a', label: 'A', disabled: true }]} value="" />)
	})

	it('renders errors and a hidden form input', () => {
		const { container } = setup({ error: 'Bad', name: 'fruit' })
		expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Bad')
		expect(container.querySelector('input[type=hidden]')).toHaveValue('apple')
	})

	it('renders without a label and without onChange', () => {
		render(<Select value="" options={options} name="n" />)
		const combo = screen.getByRole('combobox')
		fireEvent.click(combo)
		fireEvent.click(screen.getByText('Apple'))
		key(combo, 'c')
		expect(document.querySelector('input[type=hidden]')).toHaveValue('')
	})

	it('scrolls the active option into view', () => {
		const spy = vi.fn()
		Element.prototype.scrollIntoView = spy
		const { combo } = setup()
		fireEvent.click(combo)
		expect(spy).toHaveBeenCalled()
		delete Element.prototype.scrollIntoView
	})
})

describe('helperText', () => {
	const cases = [
		['Field', props => <Field label="L" onChange={() => {}} {...props} />, 'textbox'],
		['Select', props => <Select label="L" options={[]} {...props} />, 'combobox'],
		['TextArea', props => <TextArea label="L" {...props} />, 'textbox'],
		['PasswordInput', props => <PasswordInput label="L" {...props} />, null],
	]

	it.each(cases)('%s links helper text with aria-describedby and yields to the error', (_, make, role) => {
		const control = () => (role ? screen.getByRole(role) : screen.getByLabelText('L'))
		const { rerender } = render(make({ helperText: 'A hint' }))
		const hint = screen.getByText('A hint')
		expect(control().getAttribute('aria-describedby')).toBe(hint.id)
		rerender(make({ helperText: 'A hint', error: 'Bad' }))
		expect(screen.queryByText('A hint')).toBeNull()
		expect(control().getAttribute('aria-describedby')).toBe(screen.getByText('Bad').id)
		rerender(make({}))
		expect(control()).not.toHaveAttribute('aria-describedby')
	})
})
