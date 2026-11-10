import { fireEvent, render, screen } from '@testing-library/react'
import Accordion, { AccordionSection } from '../../src/components/Accordion'
import ActionMenu from '../../src/components/ActionMenu'
import CommandPalette from '../../src/components/CommandPalette'
import Drawer from '../../src/components/Drawer'
import Menu from '../../src/components/Menu'
import Popover from '../../src/components/Popover'
import Progress from '../../src/components/Progress'
import AppBar from '../../src/components/AppBar'
import Tree from '../../src/components/Tree'
import Button from '../../src/components/Button'
import Calendar from '../../src/components/Calendar'
import Chip from '../../src/components/Chip'
import CodeDisplay from '../../src/components/CodeDisplay'
import NestedTable from '../../src/components/NestedTable'
import PipelineGraph from '../../src/components/PipelineGraph'
import Sidebar from '../../src/components/Sidebar'
import Timeline from '../../src/components/Timeline'
import VirtualList from '../../src/components/VirtualList'

describe('accessibility fixes from the audit', () => {
	it('keeps aria-rowcount off the list role of VirtualList', () => {
		render(<VirtualList items={[1, 2, 3]} itemHeight={20} height={60} renderItem={i => i} getKey={i => i} label="L" />)
		expect(screen.getByRole('list', { name: 'L' })).not.toHaveAttribute('aria-rowcount')
	})

	it('points aria-controls of NestedTable only at a details row that exists', () => {
		const columns = [{ key: 'name', header: 'Name' }]
		const { rerender } = render(
			<NestedTable
				columns={columns}
				rows={[{ id: 'a', name: 'A', children: [{ id: 'b', name: 'B' }] }]}
				defaultExpanded={['a']}
			/>
		)
		expect(screen.getByRole('button', { name: /Collapse a/ })).not.toHaveAttribute('aria-controls')
		rerender(
			<NestedTable
				columns={columns}
				rows={[{ id: 'a', name: 'A' }]}
				renderDetails={() => <p>More</p>}
				defaultExpanded={['a']}
			/>
		)
		const id = screen.getByRole('button', { name: /Collapse a/ }).getAttribute('aria-controls')
		expect(document.getElementById(id)).not.toBeNull()
	})

	it('makes a horizontal Timeline focusable so it can be scrolled by keyboard', () => {
		const items = [{ key: 'a', title: 'A' }]
		const { container, rerender } = render(<Timeline items={items} orientation="horizontal" />)
		expect(container.querySelector('ol')).toHaveAttribute('tabindex', '0')
		rerender(<Timeline items={items} />)
		expect(container.querySelector('ol')).not.toHaveAttribute('tabindex')
	})

	it('renders a Sidebar section caption as a plain list item', () => {
		render(
			<Sidebar
				items={[
					{ key: 's', section: true, label: 'Main' },
					{ key: 'a', label: 'A', onClick: () => {} },
				]}
			/>
		)
		expect(screen.getByText('Main').tagName).toBe('LI')
		expect(screen.getByText('Main')).not.toHaveAttribute('role')
	})

	it('uses AA-contrast backgrounds for the filled success, info and danger styles', () => {
		const { rerender } = render(<Button variant="success">Go</Button>)
		expect(screen.getByRole('button')).toHaveClass('bg-emerald-700')
		rerender(
			<Chip tone="success" filled>
				x
			</Chip>
		)
		expect(screen.getByText('x').closest('span.inline-flex.max-w-full')).toHaveClass('bg-emerald-700')
		rerender(
			<Chip tone="info" filled>
				x
			</Chip>
		)
		expect(screen.getByText('x').closest('span.inline-flex.max-w-full')).toHaveClass('bg-sky-700')
		rerender(
			<Chip tone="danger" filled>
				x
			</Chip>
		)
		expect(screen.getByText('x').closest('span.inline-flex.max-w-full')).toHaveClass('dark:text-black')
	})

	it('draws the CodeDisplay caption, button and line numbers in the custom text color', () => {
		render(<CodeDisplay code="a" language="js" lineNumbers colors={{ text: '#eee', background: '#111' }} />)
		expect(screen.getByText('js')).toHaveStyle({ color: '#eee' })
		expect(screen.getByRole('button', { name: 'Copy' })).toHaveStyle({ color: '#eee' })
		expect(screen.getByText('1')).toHaveStyle({ color: '#eee' })
	})

	it('names calendar days by weekday, day, month and year so the visible number is in the name', () => {
		render(<Calendar value={new Date(2024, 4, 15)} />)
		const name = new Date(2024, 4, 1).toLocaleDateString(undefined, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
		expect(screen.getByRole('button', { name })).toHaveTextContent('1')
		expect(name).toMatch(/\b1\b/)
	})

	it('puts the visible node text first in a PipelineGraph node name', () => {
		render(
			<PipelineGraph
				nodes={[{ id: 'a', label: 'build', description: 'main', duration: '2m', status: 'success' }]}
				aria-label="P"
			/>
		)
		expect(screen.getByRole('button', { name: 'build main 2m, success' })).toBeInTheDocument()
	})

	it('renders Accordion headers at the heading level asked for, h3 by default', () => {
		const items = [{ key: 'a', title: 'A', content: 'x' }]
		const { rerender } = render(<Accordion items={items} />)
		expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
		rerender(<Accordion items={items} headingLevel={2} />)
		expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
		rerender(
			<AccordionSection title="S" headingLevel={4}>
				x
			</AccordionSection>
		)
		fireEvent.click(screen.getByRole('button', { name: 'S' }))
		expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument()
	})

	it('draws the focus outline inside Sidebar entries and AppBar links, where a scrolling parent would clip it', () => {
		const { unmount } = render(<Sidebar items={[{ key: 'a', label: 'A', onClick: () => {} }]} />)
		expect(screen.getByRole('button', { name: 'A' })).toHaveClass('focus-visible:-outline-offset-2')
		unmount()
		render(<AppBar brand="B" links={[{ label: 'Home', href: '/' }]} />)
		expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('focus-visible:-outline-offset-2')
	})

	it('names a text trigger by its visible text unless the label contains it', () => {
		const items = [{ key: 'a', label: 'Peel', onClick: () => {} }]
		const { rerender } = render(<Menu items={items} label="Lair actions" trigger="Bananas" />)
		expect(screen.getByRole('button', { name: 'Bananas' })).not.toHaveAttribute('aria-label')
		rerender(<Menu items={items} label="Banana actions" trigger="Banana" />)
		expect(screen.getByRole('button', { name: 'Banana actions' })).toBeInTheDocument()
		rerender(<Menu items={items} label="Lair actions" trigger="⋮" />)
		expect(screen.getByRole('button', { name: 'Lair actions' })).toBeInTheDocument()
		rerender(<Menu items={items} label="Lair actions" trigger={<svg />} />)
		expect(screen.getByRole('button', { name: 'Lair actions' })).toBeInTheDocument()
		rerender(<ActionMenu items={items} label="Lair actions" trigger="Bananas" />)
		expect(screen.getByRole('button', { name: 'Bananas' })).not.toHaveAttribute('aria-label')
		rerender(
			<Popover label="Banana facts" trigger="Kevin">
				x
			</Popover>
		)
		expect(screen.getByRole('button', { name: 'Kevin' })).not.toHaveAttribute('aria-label')
	})

	it('still names the open menu by its label when the trigger is named by its text', () => {
		render(<Menu items={[{ key: 'a', label: 'Peel', onClick: () => {} }]} label="Lair actions" trigger="Bananas" />)
		fireEvent.click(screen.getByRole('button', { name: 'Bananas' }))
		expect(screen.getByRole('menu', { name: 'Lair actions' })).toBeInTheDocument()
	})

	it('always gives a Progress indicator an accessible name', () => {
		const { rerender } = render(<Progress value={40} />)
		expect(screen.getByRole('progressbar', { name: 'Progress' })).toBeInTheDocument()
		rerender(<Progress variant="circular" />)
		expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument()
		rerender(<Progress value={40} aria-label="Bananas peeled" />)
		expect(screen.getByRole('progressbar', { name: 'Bananas peeled' })).toBeInTheDocument()
		rerender(<Progress value={40} label="Upload" />)
		expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument()
	})

	it('renders the Drawer dialog on a div, since a landmark element cannot take the dialog role', () => {
		render(
			<Drawer open title="Gadgets" onClose={() => {}}>
				x
			</Drawer>
		)
		expect(screen.getByRole('dialog', { name: 'Gadgets' }).tagName).toBe('DIV')
	})

	it('puts the visible year in the name of the Calendar year button', () => {
		render(<Calendar value={new Date(2024, 4, 15)} jumpMode="dropdown" />)
		fireEvent.click(screen.getByRole('button', { name: /choose month and year/ }))
		expect(screen.getByRole('button', { name: '2024, choose year' })).toHaveTextContent('2024')
	})

	it('keeps the empty message of CommandPalette out of the listbox children', () => {
		render(<CommandPalette open commands={[]} onClose={() => {}} />)
		expect(screen.getByRole('listbox').querySelector('li')).toHaveAttribute('role', 'presentation')
	})

	it('shows keyboard focus on the row of a Tree item', () => {
		render(<Tree nodes={[{ key: 'a', label: 'Alpha' }]} />)
		const item = screen.getByRole('treeitem')
		expect(item).toHaveClass('group')
		expect(item.firstElementChild).toHaveClass('group-focus-visible:outline')
	})
})
