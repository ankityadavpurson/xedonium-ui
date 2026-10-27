import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import AppShell from '../../src/components/AppShell'
import Button from '../../src/components/Button'
import Markdown from '../../src/components/Markdown'
import MultiSelect from '../../src/components/MultiSelect'
import ScrollProgress from '../../src/components/ScrollProgress'
import Sidebar from '../../src/components/Sidebar'
import Table from '../../src/components/Table'

describe('Table rowProps / isRowHidden', () => {
	const columns = [{ key: 'name', header: 'Name' }]
	const rows = [
		{ id: 1, name: 'one' },
		{ id: 2, name: 'two' },
		{ id: 3, name: 'three' },
	]

	it('adds per-row attributes', () => {
		render(
			<Table
				columns={columns}
				rows={rows}
				rowProps={row => ({ className: row.id === 2 ? 'picked' : '', 'aria-selected': row.id === 2 })}
			/>
		)
		const row = screen.getByText('two').closest('tr')
		expect(row).toHaveClass('picked')
		expect(row).toHaveAttribute('aria-selected', 'true')
	})

	it('hides rows without unmounting them and drops the border of the last visible row', () => {
		const { rerender } = render(<Table columns={columns} rows={rows} isRowHidden={row => row.id !== 1} />)
		const cell = screen.getByText('two')
		expect(cell.closest('tr')).toHaveAttribute('hidden')
		expect(screen.getByText('one').closest('tr')).not.toHaveClass('border-b')
		rerender(<Table columns={columns} rows={rows} isRowHidden={() => false} />)
		expect(screen.getByText('two')).toBe(cell)
		expect(cell.closest('tr')).not.toHaveAttribute('hidden')
		expect(screen.getByText('one').closest('tr')).toHaveClass('border-b')
		expect(screen.getByText('three').closest('tr')).not.toHaveClass('border-b')
	})

	it('shows the empty message when every row is hidden', () => {
		render(<Table columns={columns} rows={rows} isRowHidden={() => true} empty="Nothing" />)
		expect(screen.getByText('Nothing')).toBeInTheDocument()
		expect(screen.getByText('one')).toBeInTheDocument()
	})
})

describe('Sidebar options', () => {
	it('renders a divider and an unlabeled section as separators', () => {
		render(
			<Sidebar
				items={[
					{ key: 'a', label: 'Alpha' },
					{ key: 'd', divider: true },
					{ key: 's', label: '', section: true },
					{ key: 'b', label: 'Beta' },
				]}
			/>
		)
		expect(screen.getAllByRole('separator')).toHaveLength(2)
	})

	it('sets the text case, icon size, item classes, width and a right border apart from the header lines', () => {
		render(
			<Sidebar
				header="Head"
				bordered={false}
				borderRight
				width="w-72"
				textCase="none"
				iconSize="md"
				itemClassName="mine"
				items={[{ key: 'a', label: 'Alpha', icon: <svg />, onClick: () => {} }]}
			/>
		)
		const nav = screen.getByRole('navigation')
		expect(nav).toHaveClass('border-r', 'w-72')
		expect(screen.getByText('Head')).not.toHaveClass('border-b')
		const button = screen.getByRole('button', { name: 'Alpha' })
		expect(button).toHaveClass('mine', 'text-sm')
		expect(button).not.toHaveClass('uppercase')
		expect(button.querySelector('span')).toHaveClass('[&>svg]:h-5')
	})

	it('can drop the right edge but keep the header line', () => {
		render(<Sidebar header="Head" borderRight={false} items={[{ key: 'a', label: 'Alpha' }]} />)
		expect(screen.getByRole('navigation')).not.toHaveClass('border-r')
		expect(screen.getByText('Head')).toHaveClass('border-b')
	})
})

describe('AppShell sidebarFullHeight', () => {
	it('puts the header over the content column only', () => {
		render(
			<AppShell sidebarFullHeight header="Top" sidebar={<nav aria-label="Side">side</nav>}>
				Main
			</AppShell>
		)
		const header = screen.getByRole('banner')
		const aside = document.querySelector('aside')
		expect(aside.nextElementSibling).toContainElement(header)
		expect(aside.nextElementSibling).toContainElement(screen.getByRole('main'))
	})

	it('keeps the header above the sidebar by default', () => {
		render(
			<AppShell header="Top" sidebar={<nav aria-label="Side">side</nav>}>
				Main
			</AppShell>
		)
		const header = screen.getByRole('banner')
		expect(header.parentElement).toBe(document.querySelector('aside').parentElement.parentElement)
	})
})

describe('MultiSelect creatable', () => {
	const options = [
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
	]
	const Harness = props => {
		const [value, setValue] = useState([])
		return <MultiSelect label="Tags" value={value} onChange={setValue} options={options} creatable {...props} />
	}
	const chips = () => screen.queryAllByRole('button', { name: /^Remove / }).map(b => b.getAttribute('aria-label'))
	const type = text => fireEvent.change(screen.getByRole('combobox'), { target: { value: text } })

	it('adds typed text with Enter or a comma, once', () => {
		const onCreate = vi.fn()
		render(<Harness onCreate={onCreate} />)
		const input = screen.getByRole('combobox')
		type('svelte')
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(chips()).toEqual(['Remove svelte'])
		expect(onCreate).toHaveBeenCalledWith('svelte')
		type('solid')
		fireEvent.keyDown(input, { key: ',' })
		expect(chips()).toEqual(['Remove svelte', 'Remove solid'])
		type('SVELTE')
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(chips()).toHaveLength(2)
		expect(onCreate).toHaveBeenCalledTimes(2)
		expect(input).toHaveValue('')
	})

	it('splits on commas typed or pasted into the field', () => {
		render(<Harness />)
		type('svelte, solid,')
		expect(chips()).toEqual(['Remove svelte', 'Remove solid'])
		expect(screen.getByRole('combobox')).toHaveValue('')
		type('vue, astro')
		expect(chips()).toEqual(['Remove svelte', 'Remove solid', 'Remove Vue'])
		expect(screen.getByRole('combobox')).toHaveValue('astro')
	})

	it('picks the existing option when the typed text names it', () => {
		render(<Harness />)
		type('vue')
		fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
		expect(chips()).toEqual(['Remove Vue'])
	})

	it('offers an Add row, with a custom label', () => {
		render(<Harness createLabel={text => `Create ${text}`} />)
		type('astro')
		fireEvent.click(screen.getByRole('option', { name: 'Create astro' }))
		expect(chips()).toEqual(['Remove astro'])
	})

	it('does not offer to create text that is an option', () => {
		render(<Harness />)
		type('react')
		expect(screen.queryByRole('option', { name: /Add/ })).toBeNull()
	})
})

describe('Markdown inline', () => {
	it('renders the inline subset without a block wrapper', () => {
		const { container } = render(
			<h1>
				<Markdown inline>{'Hello **bold** and [a link](https://x.test) `code`'}</Markdown>
			</h1>
		)
		expect(container.querySelector('p, div')).toBeNull()
		expect(container.querySelector('strong')).toHaveTextContent('bold')
		expect(screen.getByRole('link', { name: 'a link' })).toHaveAttribute('href', 'https://x.test')
		expect(container.querySelector('code')).toHaveTextContent('code')
	})

	it('uses a span when given a className and keeps unsafe links as text', () => {
		const { container } = render(
			<Markdown inline className="k">
				{'[x](javascript:alert(1))'}
			</Markdown>
		)
		expect(container.firstChild.tagName).toBe('SPAN')
		expect(container.firstChild).toHaveClass('k')
		expect(screen.queryByRole('link')).toBeNull()
	})
})

describe('ScrollProgress colour', () => {
	it('reads --xd-progress for the bar and takes barClassName', () => {
		render(<ScrollProgress barClassName="mine" />)
		const fill = screen.getByRole('progressbar').firstChild
		expect(fill).toHaveClass('mine')
		expect(fill.style.background).toContain('--xd-progress')
	})

	it('reads --xd-progress for the ring stroke', () => {
		const { container } = render(<ScrollProgress variant="button" threshold={0} />)
		const arc = container.querySelectorAll('circle')[1]
		expect(arc.getAttribute('style')).toContain('--xd-progress')
	})
})

describe('primary colour tokens', () => {
	it('the default button reads the primary tokens', () => {
		render(<Button>Go</Button>)
		expect(screen.getByRole('button')).toHaveClass(
			'bg-app-primary',
			'text-app-primary-text',
			'hover:bg-app-primary-hover'
		)
	})
})

describe('Table compact', () => {
	it('tightens the cell padding', () => {
		const columns = [{ key: 'name', header: 'Name' }]
		const rows = [{ id: 1, name: 'one' }]
		const { rerender } = render(<Table columns={columns} rows={rows} />)
		expect(screen.getByText('one')).toHaveClass('px-4', 'py-2.5')
		rerender(<Table compact columns={columns} rows={rows} />)
		expect(screen.getByText('one')).toHaveClass('px-3', 'py-1.5')
		expect(screen.getByText('Name')).toHaveClass('px-3', 'py-1.5')
	})
})
