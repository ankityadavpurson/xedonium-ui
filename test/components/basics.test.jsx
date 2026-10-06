import { fireEvent, render, screen } from '@testing-library/react'
import Alert from '../../src/components/Alert'
import AreaChart from '../../src/components/AreaChart'
import Avatar from '../../src/components/Avatar'
import BodyText from '../../src/components/BodyText'
import Breadcrumb from '../../src/components/Breadcrumb'
import Card from '../../src/components/Card'
import Container from '../../src/components/Container'
import Dashboard from '../../src/components/Dashboard'
import Divider from '../../src/components/Divider'
import Flex from '../../src/components/Flex'
import Grid from '../../src/components/Grid'
import HelperText from '../../src/components/HelperText'
import Image from '../../src/components/Image'
import Label from '../../src/components/Label'
import List from '../../src/components/List'
import Navbar from '../../src/components/Navbar'
import PageHeader from '../../src/components/PageHeader'
import PageTitle from '../../src/components/PageTitle'
import Portal from '../../src/components/Portal'
import Progress from '../../src/components/Progress'
import Skeleton from '../../src/components/Skeleton'
import Stack from '../../src/components/Stack'
import StatCard from '../../src/components/StatCard'
import Stepper from '../../src/components/Stepper'
import Table from '../../src/components/Table'
import TextLink from '../../src/components/TextLink'
import Timeline from '../../src/components/Timeline'
import Toast from '../../src/components/Toast'
import toolbarButtonClass from '../../src/components/toolbarButtonClass'
import inputClass from '../../src/components/inputClass'

describe('typography', () => {
	it('BodyText / HelperText / PageTitle render with default and custom tags', () => {
		render(
			<>
				<BodyText className="x">body</BodyText>
				<BodyText as="span">span body</BodyText>
				<HelperText>help</HelperText>
				<HelperText as="small">small help</HelperText>
				<PageTitle>title</PageTitle>
				<PageTitle as="h2">title2</PageTitle>
			</>
		)
		expect(screen.getByText('body').tagName).toBe('P')
		expect(screen.getByText('body')).toHaveClass('x', 'text-sm')
		expect(screen.getByText('span body').tagName).toBe('SPAN')
		expect(screen.getByText('help')).toHaveClass('text-xs')
		expect(screen.getByText('small help').tagName).toBe('SMALL')
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('title')
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('title2')
	})

	it('Label renders a label with htmlFor, else a span, or custom tag', () => {
		render(
			<>
				<Label htmlFor="a">with</Label>
				<Label>without</Label>
				<Label as="legend" htmlFor="ignored">
					legend
				</Label>
			</>
		)
		expect(screen.getByText('with').tagName).toBe('LABEL')
		expect(screen.getByText('with')).toHaveAttribute('for', 'a')
		expect(screen.getByText('without').tagName).toBe('SPAN')
		expect(screen.getByText('legend').tagName).toBe('LEGEND')
		expect(screen.getByText('legend')).not.toHaveAttribute('for')
	})

	it('TextLink renders an anchor or a custom link component', () => {
		const Custom = ({ to, children, ...p }) => (
			<a data-custom href={`/r${to}`} {...p}>
				{children}
			</a>
		)
		render(
			<>
				<TextLink href="/x">plain</TextLink>
				<TextLink href="/y" linkComponent={Custom} linkProp="to" className="c">
					custom
				</TextLink>
			</>
		)
		expect(screen.getByText('plain')).toHaveAttribute('href', '/x')
		expect(screen.getByText('custom')).toHaveAttribute('href', '/r/y')
		expect(screen.getByText('custom')).toHaveClass('c')
	})
})

describe('layout', () => {
	it('Container', () => {
		render(
			<>
				<Container data-testid="a">a</Container>
				<Container as="section" maxWidth="max-w-sm" className="z" data-testid="b">
					b
				</Container>
			</>
		)
		expect(screen.getByTestId('a')).toHaveClass('max-w-5xl')
		expect(screen.getByTestId('b').tagName).toBe('SECTION')
		expect(screen.getByTestId('b')).toHaveClass('max-w-sm', 'z')
	})

	it('Flex and Stack', () => {
		render(
			<>
				<Flex data-testid="f">x</Flex>
				<Flex
					data-testid="g"
					direction="column"
					gap={6}
					align="center"
					justify="between"
					wrap
					inline
					as="ul"
					className="k"
				>
					y
				</Flex>
				<Stack data-testid="s">z</Stack>
				<Stack data-testid="r" direction="row" gap={2}>
					z
				</Stack>
			</>
		)
		expect(screen.getByTestId('f')).toHaveClass('flex', 'flex-row', 'gap-3')
		const g = screen.getByTestId('g')
		expect(g.tagName).toBe('UL')
		expect(g).toHaveClass('inline-flex', 'flex-col', 'gap-6', 'items-center', 'justify-between', 'flex-wrap', 'k')
		expect(screen.getByTestId('s')).toHaveClass('flex-col', 'gap-4')
		expect(screen.getByTestId('r')).toHaveClass('flex-row', 'gap-2')
	})

	it('Grid', () => {
		render(
			<>
				<Grid data-testid="a">a</Grid>
				<Grid data-testid="b" cols={3} gap={6} responsive={false} as="section" className="q">
					b
				</Grid>
			</>
		)
		expect(screen.getByTestId('a')).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-4')
		expect(screen.getByTestId('b')).toHaveClass('grid-cols-3', 'gap-6', 'q')
		expect(screen.getByTestId('b').tagName).toBe('SECTION')
	})

	it('Divider variants', () => {
		const { container, rerender } = render(<Divider />)
		expect(container.querySelector('hr')).toBeInTheDocument()
		rerender(<Divider orientation="vertical" />)
		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
		rerender(<Divider label="OR" />)
		expect(screen.getByRole('separator')).toHaveTextContent('OR')
	})

	it('PageHeader', () => {
		const { rerender } = render(<PageHeader title="T" />)
		expect(screen.getByRole('heading')).toHaveTextContent('T')
		rerender(
			<PageHeader title="T" subtitle="sub">
				<button>act</button>
			</PageHeader>
		)
		expect(screen.getByText('sub')).toBeInTheDocument()
		expect(screen.getByText('act')).toBeInTheDocument()
	})

	it('Portal renders into body or a custom container', () => {
		const target = document.createElement('div')
		document.body.append(target)
		render(
			<>
				<Portal>
					<span>in body</span>
				</Portal>
				<Portal container={target}>
					<span>in target</span>
				</Portal>
			</>
		)
		expect(target).toHaveTextContent('in target')
		expect(screen.getByText('in body').parentElement).toBe(document.body)
	})
})

describe('Card', () => {
	it('renders header, footer and padding options', () => {
		const { rerender, container } = render(<Card>body</Card>)
		expect(container.querySelector('header')).toBeNull()
		expect(container.querySelector('footer')).toBeNull()
		rerender(
			<Card title="Title" subtitle="Sub" actions={<button>go</button>} footer="foot" padded={false} className="x">
				body
			</Card>
		)
		expect(screen.getByRole('heading')).toHaveTextContent('Title')
		expect(screen.getByText('Sub')).toBeInTheDocument()
		expect(screen.getByText('go')).toBeInTheDocument()
		expect(screen.getByText('foot')).toBeInTheDocument()
		expect(screen.getByText('body')).not.toHaveClass('p-5')
		rerender(<Card actions={<b>only actions</b>}>body</Card>)
		expect(screen.queryByRole('heading')).toBeNull()
		rerender(<Card title="Only title">b</Card>)
		expect(screen.getByText('Only title')).toBeInTheDocument()
	})
})

describe('Alert', () => {
	it('uses the right role per tone and dismisses', () => {
		const onClose = vi.fn()
		const { rerender } = render(<Alert>info</Alert>)
		expect(screen.getByRole('status')).toBeInTheDocument()
		expect(screen.queryByLabelText('Dismiss')).toBeNull()
		rerender(
			<Alert tone="danger" title="Oops" onClose={onClose} icon={<i data-testid="icon" />}>
				broken
			</Alert>
		)
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(screen.getByText('Oops')).toBeInTheDocument()
		expect(screen.getByTestId('icon')).toBeInTheDocument()
		fireEvent.click(screen.getByLabelText('Dismiss'))
		expect(onClose).toHaveBeenCalled()
		rerender(<Alert tone="warning" title="only title" />)
		expect(screen.getByRole('alert')).toBeInTheDocument()
		rerender(<Alert tone="success">ok</Alert>)
		expect(screen.getByRole('status')).toHaveTextContent('ok')
	})
})

describe('Avatar shape', () => {
	it('applies the shape to the avatar and its link', () => {
		const { container, rerender } = render(<Avatar name="Ada" />)
		expect(container.firstChild).toHaveClass('rounded-full')
		rerender(<Avatar name="Ada" shape="rounded" />)
		expect(container.firstChild).toHaveClass('rounded-lg')
		rerender(<Avatar name="Ada" shape="square" />)
		expect(container.firstChild).not.toHaveClass('rounded-full', 'rounded-lg')
		rerender(<Avatar name="Ada" shape="rounded" href="/a" />)
		expect(screen.getByRole('link')).toHaveClass('rounded-lg')
	})
})

describe('Avatar', () => {
	it('shows initials, falls back on image error, and handles missing names', () => {
		const { rerender, container } = render(<Avatar name="ada lovelace byron" />)
		expect(screen.getByRole('img')).toHaveTextContent('AL')
		rerender(<Avatar />)
		expect(screen.getByRole('img')).toHaveTextContent('?')
		rerender(<Avatar name="Ada" src="/a.png" size="lg" />)
		const img = container.querySelector('img')
		expect(img).toHaveAttribute('src', '/a.png')
		fireEvent.error(img)
		expect(container.querySelector('img')).toBeNull()
		expect(screen.getByRole('img')).toHaveTextContent('A')
	})
})

describe('Image', () => {
	it('renders an image with ratio and fit, and falls back on error', () => {
		const { rerender, container } = render(<Image src="/a.png" alt="pic" ratio="video" fit="contain" />)
		const img = screen.getByAltText('pic')
		expect(img).toHaveClass('aspect-video', 'object-contain')
		rerender(<Image src="/a.png" alt="pic" />)
		expect(screen.getByAltText('pic')).toHaveClass('object-cover')
		fireEvent.error(screen.getByAltText('pic'))
		expect(container.querySelector('img')).toBeNull()
		expect(screen.getByRole('img', { name: 'pic' })).toHaveTextContent('Image unavailable')
	})
	it('supports a custom fallback', () => {
		render(<Image src="/a.png" alt="pic" fallback="Nope" ratio="square" />)
		fireEvent.error(screen.getByAltText('pic'))
		expect(screen.getByText('Nope')).toBeInTheDocument()
	})
})

describe('Breadcrumb', () => {
	it('renders links, plain text and the current page', () => {
		const Custom = ({ to, children, ...p }) => (
			<a data-custom href={to} {...p}>
				{children}
			</a>
		)
		const { rerender } = render(
			<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Mid' }, { label: 'Here', href: '/here' }]} />
		)
		expect(screen.getByText('Home')).toHaveAttribute('href', '/')
		expect(screen.getByText('Mid').tagName).toBe('SPAN')
		expect(screen.getByText('Here')).toHaveAttribute('aria-current', 'page')
		rerender(<Breadcrumb items={[{ label: 'A', href: '/a' }, { label: 'B' }]} linkComponent={Custom} linkProp="to" />)
		expect(screen.getByText('A')).toHaveAttribute('data-custom')
	})
})

describe('List', () => {
	it('renders static and clickable rows', () => {
		const onClick = vi.fn()
		render(
			<List
				items={[
					{ key: 1, primary: 'One', secondary: 'sec', leading: <i>L</i>, trailing: 'T' },
					{ key: 2, primary: 'Two', onClick },
				]}
			/>
		)
		expect(screen.getByText('sec')).toBeInTheDocument()
		expect(screen.getByText('T')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button'))
		expect(onClick).toHaveBeenCalled()
	})
	it('supports undivided lists', () => {
		render(<List divided={false} items={[{ key: 1, primary: 'x' }]} />)
		expect(screen.getByRole('listitem')).not.toHaveClass('border-b')
	})
})

describe('Navbar', () => {
	it('renders brand, links, actions and custom link components', () => {
		const Custom = ({ to, children, ...p }) => (
			<a data-custom href={to} {...p}>
				{children}
			</a>
		)
		const { rerender } = render(
			<Navbar
				brand="Brand"
				actions={<button>act</button>}
				links={[
					{ href: '/a', label: 'A', active: true },
					{ href: '/b', label: 'B', 'data-x': '1' },
				]}
			/>
		)
		expect(screen.getByText('Brand')).toBeInTheDocument()
		expect(screen.getByText('A')).toHaveAttribute('aria-current', 'page')
		expect(screen.getByText('B')).toHaveAttribute('data-x', '1')
		expect(screen.getByText('act')).toBeInTheDocument()
		rerender(<Navbar links={[{ href: '/z', label: 'Z' }]} linkComponent={Custom} linkProp="to" label="Sec" />)
		expect(screen.getByLabelText('Sec')).toBeInTheDocument()
		expect(screen.getByText('Z')).toHaveAttribute('data-custom')
		rerender(<Navbar />)
		expect(screen.getByRole('navigation')).toBeInTheDocument()
	})
})

describe('Progress', () => {
	it('shows determinate, clamped and indeterminate states', () => {
		const { rerender } = render(<Progress value={42.4} label="Upload" showValue />)
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
		expect(screen.getByText('42%')).toBeInTheDocument()
		rerender(<Progress value={150} showValue />)
		expect(screen.getByText('100%')).toBeInTheDocument()
		rerender(<Progress value={-5} />)
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
		rerender(<Progress label="Loading" showValue />)
		expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
		expect(screen.queryByText(/%/)).toBeNull()
		rerender(<Progress />)
		expect(screen.getByRole('progressbar')).toBeInTheDocument()
	})
})

describe('Skeleton', () => {
	it('renders a block, a circle, and text lines', () => {
		const { container, rerender } = render(<Skeleton />)
		expect(container.firstChild).toHaveClass('h-4', 'w-full')
		rerender(<Skeleton circle className="h-8 w-8" />)
		expect(container.firstChild).toHaveClass('rounded-full')
		rerender(<Skeleton lines={3} />)
		expect(container.firstChild.children).toHaveLength(3)
		expect(container.firstChild.lastChild).toHaveClass('w-2/3')
	})
})

describe('StatCard', () => {
	it('renders deltas by trend', () => {
		const { rerender } = render(<StatCard label="Users" value="10" />)
		expect(screen.getByText('10')).toBeInTheDocument()
		rerender(<StatCard label="Users" value="10" delta="+5%" trend="up" hint="vs last" />)
		expect(screen.getByText('+5%').textContent).toContain('▲')
		expect(screen.getByText('vs last')).toBeInTheDocument()
		rerender(<StatCard label="Users" value="10" delta="-5%" trend="down" />)
		expect(screen.getByText('-5%').textContent).toContain('▼')
		rerender(<StatCard label="Users" value="10" delta="0%" />)
		expect(screen.getByText('0%').textContent).not.toMatch(/[▲▼]/)
	})
})

describe('Dashboard', () => {
	it('renders header, stats and panels', () => {
		const { rerender, container } = render(
			<Dashboard
				title="Dash"
				subtitle="s"
				actions={<button>act</button>}
				stats={[
					{ label: 'A', value: 1 },
					{ label: 'B', value: 2 },
					{ label: 'C', value: 3 },
					{ label: 'D', value: 4 },
					{ label: 'E', value: 5 },
				]}
			>
				<div>panel</div>
			</Dashboard>
		)
		expect(screen.getByText('Dash')).toBeInTheDocument()
		expect(screen.getByText('act')).toBeInTheDocument()
		expect(screen.getByText('panel')).toBeInTheDocument()
		expect(screen.getByText('E')).toBeInTheDocument()
		rerender(<Dashboard />)
		expect(container.firstChild.children).toHaveLength(0)
	})
})

describe('Stepper', () => {
	it('marks done, current and upcoming steps', () => {
		const { container } = render(
			<Stepper steps={[{ label: 'One', description: 'first' }, { label: 'Two' }, { label: 'Three' }]} current={1} />
		)
		const items = screen.getAllByRole('listitem')
		expect(items[1]).toHaveAttribute('aria-current', 'step')
		expect(items[0]).not.toHaveAttribute('aria-current')
		expect(items[0].querySelector('svg')).toBeInTheDocument()
		expect(screen.getByText('first')).toBeInTheDocument()
		expect(container.textContent).toContain('3')
	})
	it('defaults current to 0', () => {
		render(<Stepper steps={[{ label: 'Only' }]} />)
		expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'step')
	})
})

describe('Table', () => {
	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'age', header: 'Age', align: 'right', render: r => `${r.age}y` },
		{ key: 'c', header: 'C', align: 'center' },
	]
	it('renders rows, custom cells, caption and alignment', () => {
		render(<Table columns={columns} rows={[{ id: 1, name: 'Ann', age: 3, c: 'x' }]} caption="People" />)
		expect(screen.getByText('Ann')).toBeInTheDocument()
		expect(screen.getByText('3y')).toHaveClass('text-right')
		expect(screen.getByText('People')).toBeInTheDocument()
	})
	it('renders the empty state and a custom rowKey', () => {
		const { rerender } = render(<Table columns={columns} rows={[]} />)
		expect(screen.getByText('No data')).toHaveAttribute('colspan', '3')
		rerender(<Table columns={columns} rows={[]} empty="Nothing" />)
		expect(screen.getByText('Nothing')).toBeInTheDocument()
		rerender(<Table columns={columns} rowKey="name" rows={[{ name: 'a' }, { name: 'b' }]} />)
		expect(screen.getAllByRole('row')).toHaveLength(3)
	})
})

describe('Timeline', () => {
	it('renders items with tones, times and descriptions', () => {
		render(
			<Timeline
				items={[
					{ key: 1, title: 'A', time: '9am', description: 'desc', tone: 'success' },
					{ key: 2, title: 'B' },
				]}
			/>
		)
		expect(screen.getByText('9am')).toBeInTheDocument()
		expect(screen.getByText('desc')).toBeInTheDocument()
		expect(screen.getAllByRole('listitem')).toHaveLength(2)
	})
})

describe('Toast', () => {
	it('is an empty live region with no toast', () => {
		render(<Toast toast={null} />)
		expect(screen.getByRole('status')).toBeEmptyDOMElement()
	})
	it('renders messages, errors and links', () => {
		const { rerender } = render(<Toast toast={{ msg: 'Saved', type: 'success' }} />)
		expect(screen.getByText('Saved')).toBeInTheDocument()
		rerender(<Toast toast={{ msg: 'Bad', type: 'error', link: { href: '/log', label: 'View' } }} />)
		expect(screen.getByText('Bad').closest('.bg-red-700')).toBeInTheDocument()
		expect(screen.getByText('View')).toHaveAttribute('href', '/log')
	})
})

describe('Toast stacking', () => {
	it('renders every toast and closes one by id', () => {
		const onClose = vi.fn()
		render(
			<Toast
				toasts={[
					{ id: 1, msg: 'First' },
					{ id: 2, msg: 'Second', type: 'info' },
				]}
				onClose={onClose}
			/>
		)
		expect(screen.getByText('First')).toBeInTheDocument()
		expect(screen.getByText('Second')).toBeInTheDocument()
		fireEvent.click(screen.getAllByRole('button', { name: 'Dismiss' })[1])
		expect(onClose).toHaveBeenCalledWith(2)
	})

	it('renders no toast for an empty array', () => {
		render(<Toast toasts={[]} />)
		expect(screen.getByRole('status')).toBeEmptyDOMElement()
	})
})

describe('Toast variants and actions', () => {
	it('styles each type and falls back to success', () => {
		const { rerender, container } = render(<Toast toast={{ msg: 'x', type: 'warning' }} />)
		expect(container.querySelector('.bg-amber-400')).toBeInTheDocument()
		rerender(<Toast toast={{ msg: 'x', type: 'info' }} />)
		expect(container.querySelector('.bg-sky-700')).toBeInTheDocument()
		rerender(<Toast toast={{ msg: 'x', type: 'danger' }} />)
		expect(container.querySelector('.bg-red-700')).toBeInTheDocument()
		rerender(<Toast toast={{ msg: 'x', type: 'nope' }} />)
		expect(container.querySelector('.bg-emerald-700')).toBeInTheDocument()
		rerender(<Toast toast={{ msg: 'x', icon: <i data-testid="custom" /> }} />)
		expect(screen.getByTestId('custom')).toBeInTheDocument()
	})

	it('runs actions, then closes, and has a dismiss button', () => {
		const onClose = vi.fn()
		const undo = vi.fn()
		const { rerender } = render(
			<Toast
				toast={{ msg: 'Deleted', actions: [{ label: 'Undo', onClick: undo }, { label: 'Skip' }] }}
				onClose={onClose}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
		expect(undo).toHaveBeenCalledTimes(1)
		expect(onClose).toHaveBeenCalledTimes(1)
		fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
		fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
		expect(onClose).toHaveBeenCalledTimes(3)
		rerender(<Toast toast={{ msg: 'Deleted', actions: [{ label: 'Undo' }] }} />)
		fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
		expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull()
	})
})

describe('AreaChart', () => {
	it('is a LineChart with area filled', () => {
		render(<AreaChart series={[{ name: 'a', values: [1, 2, 3] }]} labels={['a', 'b', 'c']} />)
		expect(screen.getByRole('img', { name: 'Area chart' })).toBeInTheDocument()
	})
})

describe('class helpers', () => {
	it('toolbarButtonClass and inputClass', () => {
		expect(toolbarButtonClass(true)).toContain('border-app-strong')
		expect(toolbarButtonClass(false)).toContain('border-transparent')
		expect(inputClass()).toContain('border-app-border')
		expect(inputClass(true)).toContain('border-red-500')
	})
})
