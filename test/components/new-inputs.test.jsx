import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import Accordion from '../../src/components/Accordion'
import Badge from '../../src/components/Badge'
import Button from '../../src/components/Button'
import ButtonLink from '../../src/components/ButtonLink'
import Chip from '../../src/components/Chip'
import CodeDisplay from '../../src/components/CodeDisplay'
import MultiSelect from '../../src/components/MultiSelect'
import PasswordInput from '../../src/components/PasswordInput'
import SearchSelect from '../../src/components/SearchSelect'
import TextArea from '../../src/components/TextArea'

const options = [
	{ value: 'a', label: 'Apple' },
	{ value: 'b', label: 'Banana' },
	{ value: 'c', label: 'Cherry', disabled: true },
	{ value: 'd', label: 'Date' },
]

describe('Accordion', () => {
	it.each([
		['sm', 'gap-2'],
		['md', 'gap-4'],
		['lg', 'gap-6'],
	])('gap=%s separates the items into their own bordered cards', (gap, cls) => {
		const { container } = render(<Accordion items={items} gap={gap} />)
		expect(container.firstChild).toHaveClass('flex', 'flex-col', cls)
		expect(container.firstChild).not.toHaveClass('border', 'divide-y')
		expect(container.firstChild.firstChild).toHaveClass('border')
	})

	it('shares one border with no gap, including for an unknown gap', () => {
		const { container, rerender } = render(<Accordion items={items} />)
		expect(container.firstChild).toHaveClass('divide-y', 'border')
		rerender(<Accordion items={items} gap="huge" />)
		expect(container.firstChild).toHaveClass('divide-y', 'border')
	})

	const items = [
		{ key: 'one', title: 'One', content: 'First body' },
		{ key: 'two', title: 'Two', content: 'Second body' },
		{ key: 'three', title: 'Three', content: 'Third body', disabled: true },
	]

	it('opens one section at a time by default', () => {
		const onChange = vi.fn()
		render(<Accordion items={items} defaultValue={['one']} onChange={onChange} />)
		expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'true')
		fireEvent.click(screen.getByRole('button', { name: 'Two' }))
		expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'false')
		expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-expanded', 'true')
		expect(onChange).toHaveBeenLastCalledWith(['two'])
		fireEvent.click(screen.getByRole('button', { name: 'Two' }))
		expect(onChange).toHaveBeenLastCalledWith([])
	})

	it('supports multiple and controlled mode', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Accordion items={items} multiple value={['one']} onChange={onChange} />)
		fireEvent.click(screen.getByRole('button', { name: 'Two' }))
		expect(onChange).toHaveBeenLastCalledWith(['one', 'two'])
		// controlled: state does not change until the parent says so
		expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-expanded', 'false')
		rerender(<Accordion items={items} multiple value={['one', 'two']} onChange={onChange} />)
		expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-expanded', 'true')
		fireEvent.click(screen.getByRole('button', { name: 'One' }))
		expect(onChange).toHaveBeenLastCalledWith(['two'])
		expect(screen.getByRole('button', { name: 'Three' })).toBeDisabled()
	})

	it('moves focus between headers with the keyboard', () => {
		render(<Accordion items={items} />)
		const one = screen.getByRole('button', { name: 'One' })
		const two = screen.getByRole('button', { name: 'Two' })
		one.focus()
		fireEvent.keyDown(one, { key: 'ArrowDown' })
		expect(two).toHaveFocus()
		fireEvent.keyDown(two, { key: 'ArrowDown' })
		expect(one).toHaveFocus()
		fireEvent.keyDown(one, { key: 'ArrowUp' })
		expect(two).toHaveFocus()
		fireEvent.keyDown(two, { key: 'Home' })
		expect(one).toHaveFocus()
		fireEvent.keyDown(one, { key: 'End' })
		expect(two).toHaveFocus()
		fireEvent.keyDown(two, { key: 'x' })
		expect(two).toHaveFocus()
	})
})

describe('ButtonLink', () => {
	it('lays out an icon beside the label (inline-flex with a gap)', () => {
		render(
			<ButtonLink href="/new">
				<svg data-testid="icon" />
				New role
			</ButtonLink>
		)
		expect(screen.getByRole('link', { name: 'New role' })).toHaveClass('inline-flex', 'items-center', 'gap-2')
	})

	it('renders a link with a variant', () => {
		const onClick = vi.fn()
		render(
			<ButtonLink href="/docs" variant="secondary" onClick={onClick}>
				Docs
			</ButtonLink>
		)
		const link = screen.getByRole('link', { name: 'Docs' })
		expect(link).toHaveAttribute('href', '/docs')
		fireEvent.click(link)
		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('blocks navigation when disabled and supports router links', () => {
		const onClick = vi.fn()
		const { rerender } = render(
			<ButtonLink href="/docs" disabled onClick={onClick}>
				Docs
			</ButtonLink>
		)
		const link = screen.getByText('Docs')
		expect(link).toHaveAttribute('aria-disabled', 'true')
		expect(link).not.toHaveAttribute('href')
		expect(link).toHaveAttribute('tabindex', '-1')
		fireEvent.click(link)
		expect(onClick).not.toHaveBeenCalled()
		const Router = ({ to, children, ...rest }) => (
			<a data-to={to} {...rest}>
				{children}
			</a>
		)
		rerender(
			<ButtonLink href="/x" linkComponent={Router} linkProp="to">
				Docs
			</ButtonLink>
		)
		expect(screen.getByText('Docs')).toHaveAttribute('data-to', '/x')
	})

	it('Button still renders through the shared class helper', () => {
		render(<Button variant="warning">Go</Button>)
		expect(screen.getByRole('button')).toHaveClass('bg-amber-400')
	})
})

describe('CodeDisplay', () => {
	it('renders lines, caption and line numbers', () => {
		render(<CodeDisplay code={'a\nb\n'} language="js" lineNumbers copyable={false} maxHeight={50} wrap />)
		expect(screen.getByText('js')).toBeInTheDocument()
		expect(screen.getByText('2')).toBeInTheDocument()
		expect(screen.queryByRole('button')).toBeNull()
	})

	it('prefers title over language and renders without a header', () => {
		const { rerender } = render(<CodeDisplay code="x" title="file.js" language="js" />)
		expect(screen.getByText('file.js')).toBeInTheDocument()
		rerender(<CodeDisplay copyable={false} />)
		expect(document.querySelector('figcaption')).toBeNull()
	})

	it('colors code by language and leaves other languages plain', () => {
		const { container, rerender } = render(<CodeDisplay code={"const a = 'x' // hi\n<Button />"} language="jsx" />)
		const tokens = [...container.querySelectorAll('code span[style]')].map(s => s.getAttribute('style'))
		expect(tokens).toEqual(
			expect.arrayContaining([
				'color: var(--xd-tok-keyword);',
				'color: var(--xd-tok-string);',
				'color: var(--xd-tok-comment);',
				'color: var(--xd-tok-tag);',
			])
		)
		expect(container.querySelector('.italic')).toHaveTextContent('// hi')
		rerender(<CodeDisplay code="const a = 1" language="plain" />)
		expect(container.querySelectorAll('code span[style]')).toHaveLength(0)
		rerender(<CodeDisplay code="const a = 1" language="js" highlight={false} />)
		expect(container.querySelectorAll('code span[style]')).toHaveLength(0)
	})

	it('highlights shell commands and multi-line comments across lines', () => {
		const { container, rerender } = render(<CodeDisplay code="yarn add xedonium # now" language="bash" />)
		expect(container.querySelectorAll('code span[style]').length).toBeGreaterThan(1)
		rerender(<CodeDisplay code={'/* a\nb */\nlet x'} language="js" />)
		expect(container.querySelectorAll('.italic')).toHaveLength(2)
	})

	it('lets colors override the palette, text and background', () => {
		const { container } = render(
			<CodeDisplay
				code="const a = 1"
				language="js"
				colors={{ keyword: 'hotpink', text: 'white', background: 'black' }}
			/>
		)
		const pre = container.querySelector('pre')
		expect(pre.style.getPropertyValue('--xd-tok-keyword')).toBe('hotpink')
		expect(pre.style.color).toBe('white')
		expect(container.querySelector('figure').style.background).toBe('black')
	})

	it('copies to the clipboard and resets the label', async () => {
		vi.useFakeTimers()
		const writeText = vi.fn().mockResolvedValue()
		Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
		render(<CodeDisplay code="hello" />)
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
		})
		expect(writeText).toHaveBeenCalledWith('hello')
		expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
		act(() => vi.advanceTimersByTime(1600))
		expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
		vi.useRealTimers()
	})

	it('stays quiet when the clipboard is unavailable', async () => {
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText: vi.fn().mockRejectedValue(new Error('no')) },
			configurable: true,
		})
		render(<CodeDisplay code="hello" />)
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
		})
		expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
	})
})

describe('TextArea', () => {
	it('reports changes and shows a counter and error', () => {
		const onChange = vi.fn()
		render(<TextArea label="Bio" value="hey" onChange={onChange} maxLength={10} error="Bad" resize={false} />)
		const box = screen.getByLabelText('Bio')
		expect(box).toHaveAttribute('aria-invalid', 'true')
		expect(box).toHaveAccessibleDescription('Bad')
		expect(screen.getByText('3 / 10')).toBeInTheDocument()
		fireEvent.change(box, { target: { value: 'hello' } })
		expect(onChange).toHaveBeenCalledWith('hello')
	})

	it('works without label, counter or handler', () => {
		render(<TextArea aria-label="plain" />)
		fireEvent.change(screen.getByLabelText('plain'), { target: { value: 'z' } })
		expect(screen.queryByText(/\//)).toBeNull()
	})
})

describe('MultiSelect', () => {
	const Harness = props => {
		const [value, setValue] = useState(props.initial ?? [])
		return <MultiSelect label="Fruit" value={value} onChange={setValue} options={options} {...props} />
	}
	const chips = () => screen.queryAllByRole('button', { name: /^Remove / }).map(b => b.getAttribute('aria-label'))

	it('toggles options with the mouse and stays open', () => {
		render(<Harness name="fruit" placeholder="Pick" />)
		const input = screen.getByRole('combobox')
		expect(input).toHaveAttribute('placeholder', 'Pick')
		fireEvent.click(input)
		fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
		fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		expect(chips()).toEqual(['Remove Apple', 'Remove Banana'])
		expect(document.querySelectorAll('input[name="fruit"]')).toHaveLength(2)
		fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
		fireEvent.click(screen.getByRole('option', { name: 'Cherry' }))
		expect(chips()).toEqual(['Remove Banana'])
	})

	it('removes single chips and clears all', () => {
		render(<Harness initial={['a', 'b', 'd']} />)
		fireEvent.click(screen.getByRole('button', { name: 'Remove Banana' }))
		expect(chips()).toEqual(['Remove Apple', 'Remove Date'])
		fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
		expect(chips()).toEqual([])
		expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull()
	})

	it('can hide the clear-all button and disables chips when disabled', () => {
		const { rerender } = render(<Harness initial={['a']} clearable={false} />)
		expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull()
		rerender(<Harness initial={['a']} disabled />)
		expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull()
		expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeDisabled()
	})

	it('filters options when searchable', () => {
		render(<Harness searchable emptyText="Nothing" />)
		const input = screen.getByRole('combobox')
		fireEvent.change(input, { target: { value: 'an' } })
		expect(screen.getAllByRole('option')).toHaveLength(1)
		fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
		expect(chips()).toEqual(['Remove Banana'])
		expect(input).toHaveValue('')
		fireEvent.change(input, { target: { value: 'zzz' } })
		expect(screen.getByText('Nothing')).toBeInTheDocument()
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(input).toHaveValue('')
	})

	it('honours a custom filter', () => {
		render(<Harness searchable filter={(query, option) => option.value === query} />)
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'd' } })
		expect(screen.getAllByRole('option')).toHaveLength(1)
	})

	it('supports the keyboard', () => {
		render(<Harness initial={['d']} />)
		const input = screen.getByRole('combobox')
		fireEvent.keyDown(input, { key: 'x' })
		expect(screen.queryByRole('listbox')).toBeNull()
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		expect(input).toHaveAttribute('aria-expanded', 'true')
		fireEvent.keyDown(input, { key: 'Home' })
		fireEvent.keyDown(input, { key: ' ' })
		expect(chips()).toEqual(['Remove Apple', 'Remove Date'])
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(chips()).toEqual(['Remove Apple'])
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		fireEvent.keyDown(input, { key: 'End' })
		fireEvent.keyDown(input, { key: 'Tab' })
		expect(screen.queryByRole('listbox')).toBeNull()
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		fireEvent.keyDown(input, { key: ' ' })
		fireEvent.keyDown(input, { key: 'Backspace' })
		expect(chips()).toEqual([])
		fireEvent.keyDown(input, { key: 'Backspace' })
	})

	it('keeps Space and Home as text editing keys when searchable', () => {
		render(<Harness searchable initial={['a']} />)
		const input = screen.getByRole('combobox')
		fireEvent.change(input, { target: { value: 'b' } })
		fireEvent.keyDown(input, { key: 'Home' })
		fireEvent.keyDown(input, { key: 'End' })
		fireEvent.keyDown(input, { key: ' ' })
		fireEvent.keyDown(input, { key: 'Backspace' })
		expect(chips()).toEqual(['Remove Apple'])
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(chips()).toEqual(['Remove Apple', 'Remove Banana'])
	})

	it('opens and closes from the control and chevron, and closes on outside click', () => {
		render(<Harness error="Pick one" />)
		const input = screen.getByRole('combobox')
		expect(input).toHaveAccessibleDescription('Pick one')
		const control = input.parentElement
		fireEvent.click(control)
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		fireEvent.click(control)
		expect(screen.queryByRole('listbox')).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: 'Open options' }))
		fireEvent.click(screen.getByRole('button', { name: 'Close options' }))
		expect(screen.queryByRole('listbox')).toBeNull()
		fireEvent.click(control)
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('listbox')).toBeNull()
		fireEvent.click(control)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('does nothing when disabled', () => {
		render(<Harness disabled />)
		const input = screen.getByRole('combobox')
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.click(input.parentElement)
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('handles empty option lists, hover and a missing handler', () => {
		const { rerender } = render(<MultiSelect options={[]} onChange={() => {}} />)
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
		rerender(<MultiSelect options={options} value={['a']} />)
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
		fireEvent.mouseMove(screen.getByRole('option', { name: 'Date' }))
		fireEvent.mouseMove(screen.getByRole('option', { name: 'Cherry' }))
		fireEvent.mouseDown(screen.getByRole('option', { name: 'Date' }))
		fireEvent.click(screen.getByRole('option', { name: 'Date' }))
		fireEvent.click(screen.getByRole('button', { name: 'Remove Apple' }))
		fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' })
	})
})

describe('SearchSelect', () => {
	const Harness = props => {
		const [value, setValue] = useState(props.initial)
		return <SearchSelect label="Fruit" value={value} onChange={setValue} options={options} {...props} />
	}

	it('filters as you type and picks with the mouse', () => {
		render(<Harness name="fruit" />)
		const input = screen.getByRole('combobox')
		fireEvent.focus(input)
		expect(screen.getAllByRole('option')).toHaveLength(4)
		fireEvent.change(input, { target: { value: 'an' } })
		expect(screen.getAllByRole('option')).toHaveLength(1)
		fireEvent.click(screen.getByRole('option', { name: 'Banana' }))
		expect(screen.queryByRole('listbox')).toBeNull()
		expect(input).toHaveValue('Banana')
		expect(document.querySelector('input[name="fruit"]')).toHaveValue('b')
	})

	it('shows an empty message and clears the query on close', () => {
		const onSearch = vi.fn()
		render(<Harness onSearch={onSearch} emptyText="Nothing" />)
		const input = screen.getByRole('combobox')
		fireEvent.change(input, { target: { value: 'zzz' } })
		expect(screen.getByText('Nothing')).toBeInTheDocument()
		expect(onSearch).toHaveBeenLastCalledWith('zzz')
		fireEvent.keyDown(input, { key: 'Enter' })
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(onSearch).toHaveBeenLastCalledWith('')
		expect(input).toHaveValue('')
	})

	it('supports the keyboard', () => {
		render(<Harness initial="d" />)
		const input = screen.getByRole('combobox')
		expect(input).toHaveValue('Date')
		fireEvent.keyDown(input, { key: 'Home' })
		fireEvent.keyDown(input, { key: 'End' })
		fireEvent.keyDown(input, { key: 'Enter' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		expect(input).toHaveAttribute('aria-expanded', 'true')
		fireEvent.keyDown(input, { key: 'Home' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		fireEvent.keyDown(input, { key: 'End' })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(input).toHaveValue('Date')
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		fireEvent.keyDown(input, { key: 'a' })
		fireEvent.keyDown(input, { key: 'Tab' })
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('picks the first match on Enter and honours a custom filter', () => {
		render(<Harness filter={(query, option) => option.value === query} />)
		const input = screen.getByRole('combobox')
		fireEvent.change(input, { target: { value: 'd' } })
		expect(screen.getAllByRole('option')).toHaveLength(1)
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(input).toHaveValue('Date')
	})

	it('respects disabled and error, ignores disabled options', () => {
		const { rerender } = render(<Harness error="Oops" />)
		const input = screen.getByRole('combobox')
		expect(input).toHaveAccessibleDescription('Oops')
		fireEvent.click(input)
		fireEvent.mouseMove(screen.getByRole('option', { name: 'Cherry' }))
		fireEvent.mouseMove(screen.getByRole('option', { name: 'Apple' }))
		fireEvent.mouseDown(screen.getByRole('option', { name: 'Apple' }))
		fireEvent.click(screen.getByRole('option', { name: 'Cherry' }))
		expect(screen.getByRole('listbox')).toBeInTheDocument()
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('listbox')).toBeNull()
		rerender(<Harness disabled />)
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
		fireEvent.focus(screen.getByRole('combobox'))
		expect(screen.queryByRole('listbox')).toBeNull()
	})

	it('copes with no options', () => {
		render(<SearchSelect options={[]} />)
		const input = screen.getByRole('combobox')
		fireEvent.focus(input)
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(screen.getByText('No matches')).toBeInTheDocument()
	})
})

describe('PasswordInput', () => {
	it('toggles visibility and reports changes', () => {
		const onChange = vi.fn()
		render(<PasswordInput label="Password" value="secret" onChange={onChange} />)
		const input = screen.getByLabelText('Password')
		expect(input).toHaveAttribute('type', 'password')
		expect(input).toHaveAttribute('autocomplete', 'current-password')
		fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
		expect(input).toHaveAttribute('type', 'text')
		fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
		expect(input).toHaveAttribute('type', 'password')
		fireEvent.change(input, { target: { value: 'next' } })
		expect(onChange).toHaveBeenCalledWith('next')
	})

	it('shows errors, supports disabled and works without label or handler', () => {
		const { rerender } = render(<PasswordInput label="Password" value="" onChange={() => {}} error="Too short" />)
		expect(screen.getByLabelText('Password')).toHaveAccessibleDescription('Too short')
		rerender(<PasswordInput aria-label="pw" value="" disabled />)
		expect(screen.getByLabelText('pw')).toBeDisabled()
		expect(screen.getByRole('button')).toBeDisabled()
		rerender(<PasswordInput aria-label="pw" value="" />)
		fireEvent.change(screen.getByLabelText('pw'), { target: { value: 'z' } })
	})
})

describe('Badge', () => {
	const indicator = container => container.querySelector('[data-hidden]')

	it('shows content over children and caps large numbers', () => {
		const { container, rerender } = render(
			<Badge badgeContent={4}>
				<i>icon</i>
			</Badge>
		)
		expect(screen.getByText('4')).toBeInTheDocument()
		expect(indicator(container)).toHaveAttribute('data-hidden', 'false')
		rerender(
			<Badge badgeContent={120}>
				<i>icon</i>
			</Badge>
		)
		expect(screen.getByText('99+')).toBeInTheDocument()
		rerender(
			<Badge badgeContent={120} max={999}>
				<i>icon</i>
			</Badge>
		)
		expect(screen.getByText('120')).toBeInTheDocument()
		rerender(
			<Badge badgeContent="new">
				<i>icon</i>
			</Badge>
		)
		expect(screen.getByText('new')).toBeInTheDocument()
	})

	it('hides when empty or zero unless showZero, and honours invisible', () => {
		const { container, rerender } = render(
			<Badge badgeContent={0}>
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveAttribute('data-hidden', 'true')
		rerender(
			<Badge badgeContent={0} showZero>
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveAttribute('data-hidden', 'false')
		rerender(
			<Badge>
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveAttribute('data-hidden', 'true')
		rerender(
			<Badge badgeContent={3} invisible>
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveAttribute('data-hidden', 'true')
		rerender(
			<Badge variant="dot" invisible={false}>
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveAttribute('data-hidden', 'false')
	})

	it('supports colors, dots, corners and circular overlap', () => {
		const { container, rerender } = render(
			<Badge variant="dot">
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveClass('h-2')
		rerender(
			<Badge badgeContent={1} size="sm">
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container)).toHaveClass('h-4')
		for (const color of ['secondary', 'success', 'danger', 'warning', 'info']) {
			rerender(
				<Badge badgeContent={1} color={color}>
					<i>icon</i>
				</Badge>
			)
		}
		rerender(
			<Badge
				badgeContent={1}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				overlap="circular"
				className="x"
			>
				<i>icon</i>
			</Badge>
		)
		expect(indicator(container).style.left).toBe('14%')
		expect(indicator(container).style.bottom).toBe('14%')
	})

	it('renders on its own without children', () => {
		const { container, rerender } = render(<Badge badgeContent={2} />)
		expect(screen.getByText('2')).toBeInTheDocument()
		expect(indicator(container)).not.toHaveClass('absolute')
		rerender(<Badge badgeContent={0} />)
		expect(indicator(container)).toHaveClass('hidden')
	})
})

describe('Chip', () => {
	it('colours by tone, optionally filled, and selection wins over tone', () => {
		const { rerender } = render(<Chip tone="success">Active</Chip>)
		const chip = () => screen.getByText('Active').closest('span[class*="border"]')
		expect(chip()).toHaveClass('text-emerald-800')
		rerender(
			<Chip tone="danger" filled>
				Active
			</Chip>
		)
		expect(chip()).toHaveClass('bg-red-600', 'text-white')
		rerender(
			<Chip tone="info" onClick={() => {}} selected>
				Active
			</Chip>
		)
		expect(chip()).toHaveClass('bg-app-strong')
		expect(chip()).not.toHaveClass('bg-sky-500/10')
	})

	it('renders static text with a leading element', () => {
		render(
			<Chip leading={<i data-testid="lead" />} size="sm" className="x">
				Tag
			</Chip>
		)
		expect(screen.getByText('Tag')).toBeInTheDocument()
		expect(screen.getByTestId('lead')).toBeInTheDocument()
		expect(screen.queryByRole('button')).toBeNull()
	})

	it('toggles as a button with pressed state', () => {
		const onClick = vi.fn()
		const { rerender } = render(<Chip onClick={onClick}>Open</Chip>)
		const button = screen.getByRole('button', { name: 'Open' })
		expect(button).not.toHaveAttribute('aria-pressed')
		fireEvent.click(button)
		expect(onClick).toHaveBeenCalledTimes(1)
		rerender(
			<Chip onClick={onClick} selected>
				Open
			</Chip>
		)
		expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-pressed', 'true')
		rerender(
			<Chip onClick={onClick} selected={false}>
				Open
			</Chip>
		)
		expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-pressed', 'false')
	})

	it('removes with a labelled button', () => {
		const onRemove = vi.fn()
		const { rerender } = render(<Chip onRemove={onRemove}>react</Chip>)
		fireEvent.click(screen.getByRole('button', { name: 'Remove react' }))
		expect(onRemove).toHaveBeenCalledTimes(1)
		rerender(
			<Chip onRemove={onRemove}>
				<b>node</b>
			</Chip>
		)
		expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
		rerender(
			<Chip onRemove={onRemove} removeLabel="Delete tag">
				x
			</Chip>
		)
		expect(screen.getByRole('button', { name: 'Delete tag' })).toBeInTheDocument()
	})

	it('disables its buttons', () => {
		render(
			<Chip onClick={() => {}} onRemove={() => {}} disabled>
				Off
			</Chip>
		)
		for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
	})
})
