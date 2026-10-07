import { fireEvent, render, screen } from '@testing-library/react'
import Pagination from '../../src/components/Pagination'
import Sidebar from '../../src/components/Sidebar'
import SortableList from '../../src/components/SortableList'
import Tabs from '../../src/components/Tabs'
import Tree from '../../src/components/Tree'
import VirtualList from '../../src/components/VirtualList'

describe('Tabs', () => {
	const items = [
		{ key: 'a', label: 'A', content: 'Panel A' },
		{ key: 'b', label: 'B', content: 'Panel B', disabled: true },
		{ key: 'c', label: 'C', content: 'Panel C' },
		{ key: 'd', label: 'D' },
	]

	it('is uncontrolled by default and shows the active panel', () => {
		render(<Tabs items={items} />)
		expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A')
		fireEvent.click(screen.getByRole('tab', { name: 'C' }))
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel C')
		fireEvent.click(screen.getByRole('tab', { name: 'D' }))
		expect(screen.queryByRole('tabpanel')).toBeNull()
		expect(screen.getByRole('tab', { name: 'B' })).toBeDisabled()
	})

	it('supports defaultValue and controlled mode', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Tabs items={items} defaultValue="c" />)
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel C')
		rerender(<Tabs items={items} value="a" onChange={onChange} />)
		fireEvent.click(screen.getByRole('tab', { name: 'C' }))
		expect(onChange).toHaveBeenCalledWith('c')
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A')
	})

	it('navigates with the keyboard, skipping disabled tabs', () => {
		render(<Tabs items={items} />)
		const list = screen.getByRole('tablist')
		fireEvent.keyDown(list, { key: 'ArrowRight' })
		expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus()
		fireEvent.keyDown(list, { key: 'ArrowRight' })
		fireEvent.keyDown(list, { key: 'ArrowRight' }) // wraps to A
		expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
		fireEvent.keyDown(list, { key: 'ArrowLeft' }) // wraps to D
		expect(screen.getByRole('tab', { name: 'D' })).toHaveAttribute('aria-selected', 'true')
		fireEvent.keyDown(list, { key: 'Home' })
		expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus()
		fireEvent.keyDown(list, { key: 'End' })
		expect(screen.getByRole('tab', { name: 'D' })).toHaveFocus()
		fireEvent.keyDown(list, { key: 'x' })
		expect(screen.getByRole('tab', { name: 'D' })).toHaveAttribute('aria-selected', 'true')
	})

	it('handles an empty list', () => {
		render(<Tabs items={[]} />)
		expect(screen.getByRole('tablist')).toBeEmptyDOMElement()
		fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
	})
})

describe('Pagination per page', () => {
	it('renders a per-page select and reports the chosen size as a number', () => {
		const onPageSizeChange = vi.fn()
		render(
			<Pagination
				page={1}
				pageCount={5}
				onChange={() => {}}
				pageSize={10}
				pageSizeOptions={[10, 25]}
				onPageSizeChange={onPageSizeChange}
			/>
		)
		const select = screen.getByRole('combobox', { name: /per page/i })
		expect(select).toHaveTextContent('10')
		fireEvent.click(select)
		fireEvent.click(screen.getByRole('option', { name: '25' }))
		expect(onPageSizeChange).toHaveBeenCalledWith(25)
	})

	it('hides the select without a handler', () => {
		render(<Pagination page={1} pageCount={5} onChange={() => {}} pageSize={10} pageSizeOptions={[10, 25]} />)
		expect(screen.queryByRole('combobox')).toBeNull()
	})
})

describe('Pagination', () => {
	it('sizes buttons to match the per-page Select and gives Prev / Next the same width', () => {
		render(<Pagination page={2} pageCount={5} onChange={() => {}} />)
		expect(screen.getByLabelText('Page 2')).toHaveClass('min-h-[38px]', 'min-w-[38px]')
		expect(screen.getByText('Prev')).toHaveClass('min-h-[38px]', 'min-w-16')
		expect(screen.getByText('Next')).toHaveClass('min-w-16')
	})

	it('shows gaps and disables the edge buttons', () => {
		const onChange = vi.fn()
		const { rerender } = render(<Pagination page={1} pageCount={10} onChange={onChange} />)
		expect(screen.getByText('Prev')).toBeDisabled()
		expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page')
		expect(screen.getByText('…')).toBeInTheDocument()
		fireEvent.click(screen.getByText('Next'))
		expect(onChange).toHaveBeenCalledWith(2)
		fireEvent.click(screen.getByLabelText('Page 10'))
		expect(onChange).toHaveBeenCalledWith(10)
		rerender(<Pagination page={10} pageCount={10} onChange={onChange} />)
		expect(screen.getByText('Next')).toBeDisabled()
		fireEvent.click(screen.getByText('Prev'))
		expect(onChange).toHaveBeenCalledWith(9)
	})
	it('shows two gaps in the middle and none for short ranges', () => {
		const { rerender } = render(<Pagination page={5} pageCount={10} onChange={() => {}} siblings={1} />)
		expect(screen.getAllByText('…')).toHaveLength(2)
		rerender(<Pagination page={2} pageCount={3} onChange={() => {}} className="c" />)
		expect(screen.queryByText('…')).toBeNull()
		rerender(<Pagination page={1} pageCount={1} onChange={() => {}} />)
		expect(screen.getByText('Next')).toBeDisabled()
	})
})

describe('Sidebar sections and tooltips', () => {
	const items = [
		{ key: 's', label: 'Main Menu', section: true },
		{ key: 'a', label: 'Alpha', href: '/a', icon: <i /> },
	]

	it('renders a section as a caption, or a divider when collapsed', () => {
		const { rerender } = render(<Sidebar items={items} />)
		expect(screen.getByText('Main Menu')).toHaveClass('uppercase')
		expect(screen.queryByRole('separator')).toBeNull()
		expect(screen.getAllByRole('link')).toHaveLength(1)
		rerender(<Sidebar items={items} collapsed />)
		expect(screen.queryByText('Main Menu')).toBeNull()
		expect(screen.getByRole('separator')).toBeInTheDocument()
	})

	it('shows a tooltip on hover only when the label is truncated', () => {
		render(<Sidebar items={items} />)
		const link = screen.getByRole('link', { name: 'Alpha' })
		fireEvent.mouseEnter(link.parentElement)
		expect(screen.queryByText('Alpha', { selector: 'div' })).toBeNull()
		fireEvent.mouseLeave(link.parentElement)
		const spy = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(200)
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
		fireEvent.mouseEnter(link.parentElement)
		expect(screen.getByText('Alpha', { selector: 'div' })).toBeInTheDocument()
		spy.mockRestore()
	})
})

describe('Sidebar options', () => {
	const items = [{ key: 'a', label: 'Alpha', href: '/a' }]

	it('draws separators by default and removes them with bordered={false}', () => {
		const { rerender } = render(<Sidebar items={items} header="H" footer="F" />)
		const nav = screen.getByRole('navigation')
		expect(nav).toHaveClass('border-r')
		expect(screen.getByText('H')).toHaveClass('border-b', 'px-3', 'py-3')
		expect(screen.getByText('F')).toHaveClass('border-t')
		rerender(<Sidebar items={items} header="H" footer="F" bordered={false} />)
		expect(nav).not.toHaveClass('border-r')
		expect(screen.getByText('H')).not.toHaveClass('border-b')
		expect(screen.getByText('F')).not.toHaveClass('border-t')
	})

	it('sets item density and replaces header and list padding', () => {
		const { rerender } = render(<Sidebar items={items} density="dense" />)
		expect(screen.getByRole('link', { name: 'Alpha' })).toHaveClass('py-1.5')
		rerender(<Sidebar items={items} density="comfortable" header="H" headerClassName="p-1" listClassName="p-3" />)
		expect(screen.getByRole('link', { name: 'Alpha' })).toHaveClass('py-3')
		expect(screen.getByText('H')).toHaveClass('p-1')
		expect(screen.getByText('H')).not.toHaveClass('py-3')
		expect(screen.getByRole('list')).toHaveClass('p-3')
		expect(screen.getByRole('list')).not.toHaveClass('py-2')
	})
})

describe('Sidebar', () => {
	const items = [
		{ key: 'home', label: 'Home', href: '/', icon: <svg data-testid="ic" />, badge: 4 },
		{
			key: 'group',
			label: 'Group',
			href: '/g',
			children: [{ key: 'child', label: 'Child', href: '/c' }],
		},
		{ key: 'btn', label: 'Action', onClick: vi.fn() },
	]

	it('renders links, buttons, nested items, badges, header and footer', () => {
		const onSelect = vi.fn()
		render(<Sidebar items={items} activeKey="home" onSelect={onSelect} header="H" footer="F" />)
		expect(screen.getByText('Home').closest('a')).toHaveAttribute('aria-current', 'page')
		expect(screen.getByText('4')).toBeInTheDocument()
		expect(screen.getByText('Child').closest('a')).toHaveAttribute('href', '/c')
		expect(screen.getByText('Group').closest('button')).toBeInTheDocument()
		expect(screen.getByText('H')).toBeInTheDocument()
		expect(screen.getByText('F')).toBeInTheDocument()
		fireEvent.click(screen.getByText('Action'))
		expect(items[2].onClick).toHaveBeenCalled()
		expect(onSelect).toHaveBeenCalledWith('btn')
		fireEvent.click(screen.getByText('Child'))
		expect(onSelect).toHaveBeenCalledWith('child')
	})

	it('collapses to icons with accessible labels', () => {
		render(<Sidebar items={items} collapsed linkComponent="a" label="Side" />)
		expect(screen.getByLabelText('Side')).toHaveClass('w-14')
		expect(screen.getByLabelText('Home')).toHaveAttribute('title', 'Home')
		expect(screen.queryByText('Child')).toBeNull()
		expect(screen.queryByText('4')).toBeNull()
		fireEvent.click(screen.getByLabelText('Action'))
	})

	it('supports router link components and works without onSelect', () => {
		const Custom = ({ to, children, ...p }) => (
			<a data-custom href={to} {...p}>
				{children}
			</a>
		)
		render(<Sidebar items={[{ key: 'x', label: 'X', href: '/x' }]} linkComponent={Custom} linkProp="to" />)
		fireEvent.click(screen.getByText('X'))
		expect(screen.getByText('X').closest('a')).toHaveAttribute('data-custom')
	})
})

describe('Tree renderLabel', () => {
	it('renders custom labels with the depth of each node', () => {
		const nodes = [{ key: 'a', label: 'Alpha', children: [{ key: 'a1', label: 'Child' }] }]
		render(
			<Tree nodes={nodes} defaultExpanded={['a']} renderLabel={(node, depth) => <b>{`${depth}:${node.label}`}</b>} />
		)
		expect(screen.getByText('0:Alpha')).toBeInTheDocument()
		expect(screen.getByText('1:Child')).toBeInTheDocument()
	})
})

describe('Tree', () => {
	const nodes = [
		{
			key: 'a',
			label: 'Alpha',
			children: [
				{ key: 'a1', label: 'Alpha 1' },
				{ key: 'a2', label: 'Alpha 2', children: [{ key: 'a2x', label: 'Deep' }] },
			],
		},
		{ key: 'b', label: 'Beta' },
	]

	beforeEach(() => {
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
			cb(0)
			return 0
		})
	})

	const item = name => screen.getByText(name).closest('[role=treeitem]')

	it('expands and collapses by click and reports selection', () => {
		const onSelect = vi.fn()
		render(<Tree nodes={nodes} onSelect={onSelect} selected="b" />)
		expect(screen.queryByText('Alpha 1')).toBeNull()
		fireEvent.click(screen.getByText('Alpha'))
		expect(onSelect).toHaveBeenCalledWith('a')
		expect(screen.getByText('Alpha 1')).toBeInTheDocument()
		fireEvent.click(screen.getByText('Alpha'))
		expect(screen.queryByText('Alpha 1')).toBeNull()
		expect(item('Beta')).toHaveAttribute('aria-selected', 'true')
		fireEvent.click(screen.getByText('Beta'))
	})

	it('supports controlled expansion', () => {
		const onExpandedChange = vi.fn()
		render(<Tree nodes={nodes} expanded={['a']} onExpandedChange={onExpandedChange} />)
		expect(screen.getByText('Alpha 1')).toBeInTheDocument()
		fireEvent.click(screen.getByText('Alpha'))
		expect(onExpandedChange).toHaveBeenCalledWith([])
		expect(screen.getByText('Alpha 1')).toBeInTheDocument()
	})

	it('navigates with the keyboard', () => {
		const onSelect = vi.fn()
		render(<Tree nodes={nodes} defaultExpanded={['a']} onSelect={onSelect} label="My tree" />)
		const key = (name, k) => fireEvent.keyDown(item(name), { key: k })
		key('Alpha', 'ArrowDown')
		expect(item('Alpha 1')).toHaveFocus()
		key('Alpha 1', 'ArrowUp')
		expect(item('Alpha')).toHaveFocus()
		key('Alpha', 'ArrowUp') // already first
		key('Alpha', 'ArrowRight') // open -> enters first child
		expect(item('Alpha 1')).toHaveFocus()
		key('Alpha 1', 'ArrowLeft') // leaf -> parent
		expect(item('Alpha')).toHaveFocus()
		key('Alpha', 'ArrowLeft') // collapses
		expect(screen.queryByText('Alpha 1')).toBeNull()
		key('Alpha', 'ArrowRight') // expands
		expect(screen.getByText('Alpha 1')).toBeInTheDocument()
		key('Alpha', 'End')
		expect(item('Beta')).toHaveFocus()
		key('Beta', 'ArrowDown') // already last
		key('Beta', 'ArrowRight') // leaf, nothing
		key('Beta', 'ArrowLeft') // top-level leaf, nothing
		key('Beta', 'Home')
		expect(item('Alpha')).toHaveFocus()
		key('Alpha', 'Enter')
		key('Alpha', ' ')
		expect(onSelect).toHaveBeenCalledTimes(2)
		key('Alpha', 'x')
	})

	it('keeps roving tabindex on the focused row and falls back when it disappears', () => {
		render(<Tree nodes={nodes} defaultExpanded={['a']} />)
		fireEvent.focus(item('Alpha 1'))
		expect(item('Alpha 1')).toHaveAttribute('tabindex', '0')
		expect(item('Alpha')).toHaveAttribute('tabindex', '-1')
		fireEvent.keyDown(item('Alpha'), { key: 'ArrowLeft' })
		expect(item('Alpha')).toHaveAttribute('tabindex', '0')
	})
})

describe('SortableList', () => {
	const items = [{ key: 1, label: 'One' }, { key: 2, label: 'Two' }, { key: 3 }]
	const dt = () => ({ setData: vi.fn(), effectAllowed: '' })

	it('reorders by drag and drop', () => {
		const onChange = vi.fn()
		render(<SortableList items={items} onChange={onChange} renderItem={i => `row-${i.key}`} />)
		const rows = screen.getAllByRole('listitem')
		fireEvent.dragStart(rows[0], { dataTransfer: dt() })
		fireEvent.dragOver(rows[2])
		fireEvent.dragOver(rows[2])
		fireEvent.drop(rows[2])
		expect(onChange).toHaveBeenCalledWith([items[1], items[2], items[0]])
		fireEvent.dragStart(rows[1], { dataTransfer: dt() })
		fireEvent.dragEnd(rows[1])
		fireEvent.dragStart(rows[1], { dataTransfer: dt() })
		fireEvent.drop(rows[1]) // same position: no change
		expect(onChange).toHaveBeenCalledTimes(1)
	})

	it('reorders with the keyboard and announces the move', () => {
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
			cb(0)
			return 0
		})
		const onChange = vi.fn()
		render(<SortableList items={items} onChange={onChange} renderItem={i => i.key} label="Rows" />)
		const handles = screen.getAllByRole('button')
		fireEvent.keyDown(handles[1], { key: 'ArrowUp' })
		expect(onChange).toHaveBeenCalledWith([items[1], items[0], items[2]])
		expect(screen.getByRole('status')).toHaveTextContent('Two moved to position 1 of 3')
		fireEvent.keyDown(handles[0], { key: 'ArrowUp' }) // out of range
		fireEvent.keyDown(handles[2], { key: 'ArrowDown' }) // out of range
		fireEvent.keyDown(handles[1], { key: 'x' })
		fireEvent.keyDown(handles[0], { key: 'ArrowDown' })
		expect(onChange).toHaveBeenCalledTimes(2)
		fireEvent.keyDown(handles[2], { key: 'ArrowUp' })
		expect(screen.getByRole('status')).toHaveTextContent('3 moved')
	})
})

describe('VirtualList', () => {
	const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `row ${i}` }))

	it('renders only the visible window and updates on scroll', () => {
		render(
			<VirtualList
				items={items}
				itemHeight={40}
				height={200}
				overscan={2}
				renderItem={i => i.text}
				getKey={i => i.id}
				label="Big"
			/>
		)
		const list = screen.getByRole('list', { name: 'Big' })
		expect(list).toHaveAttribute('aria-rowcount', '1000')
		expect(screen.getAllByRole('listitem').length).toBeLessThan(20)
		expect(screen.getByText('row 0')).toBeInTheDocument()
		expect(screen.queryByText('row 500')).toBeNull()
		list.scrollTop = 20000
		fireEvent.scroll(list)
		expect(screen.getByText('row 500')).toBeInTheDocument()
		expect(screen.queryByText('row 0')).toBeNull()
	})

	it('falls back to index keys and defaults', () => {
		render(<VirtualList items={[{ text: 'a' }, { text: 'b' }]} itemHeight={20} renderItem={i => i.text} />)
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
	})
})
