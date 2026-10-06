import { fireEvent, render, screen } from '@testing-library/react'
import Avatar from '../../src/components/Avatar'
import Loader from '../../src/components/Loader'
import Progress from '../../src/components/Progress'

describe('Loader', () => {
	it('defaults to the fan with a label, as a status region', () => {
		const { container } = render(<Loader />)
		expect(screen.getByRole('status')).toHaveTextContent('Loading')
		expect(container.querySelector('svg')).toHaveAttribute('width', '64')
	})

	it.each([
		['sm', '32'],
		['lg', '96'],
	])('sizes the fan for %s', (size, width) => {
		const { container } = render(<Loader size={size} />)
		expect(container.querySelector('svg')).toHaveAttribute('width', width)
	})

	it('spinner variant shows a ring and an sr-only label', () => {
		const { container } = render(<Loader variant="spinner" label="Wait" size="lg" />)
		expect(container.querySelector('svg')).toHaveAttribute('width', '48')
		expect(screen.getByText('Wait')).toHaveClass('sr-only')
	})

	it('dots variant shows the label with three dots', () => {
		const { container } = render(<Loader variant="dots" label="Fetching" />)
		expect(screen.getByRole('status')).toHaveTextContent('Fetching...')
		expect(container.querySelectorAll('.xd-dot')).toHaveLength(3)
	})

	it('shimmer variant', () => {
		render(<Loader variant="shimmer" label="Thinking" />)
		expect(screen.getByText('Thinking')).toHaveClass('xd-shimmer')
	})

	it('inline and stacked variants render a spinner next to / above the label', () => {
		const { container, rerender } = render(<Loader variant="inline" label="In" size="sm" />)
		expect(container.querySelector('svg')).toBeInTheDocument()
		expect(screen.getByText('In')).toHaveClass('text-xs')
		rerender(<Loader variant="stacked" label="Out" />)
		expect(container.querySelector('svg')).toBeInTheDocument()
		expect(screen.getByText('Out')).toBeInTheDocument()
	})

	it('card variant shows an optional description', () => {
		const { rerender } = render(<Loader variant="card" label="Syncing" description="Almost there" />)
		expect(screen.getByText('Syncing')).toBeInTheDocument()
		expect(screen.getByText('Almost there')).toBeInTheDocument()
		rerender(<Loader variant="card" label="Syncing" />)
		expect(screen.queryByText('Almost there')).toBeNull()
	})

	it('applies a custom className', () => {
		render(<Loader className="custom" />)
		expect(screen.getByRole('status')).toHaveClass('custom')
	})
})

describe('Progress (circular)', () => {
	it('draws a partial ring with the value and label', () => {
		const { container } = render(<Progress variant="circular" value={40.4} label="Upload" showValue />)
		expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('aria-valuenow', '40')
		expect(screen.getByText('40%')).toBeInTheDocument()
		expect(container.querySelectorAll('circle')[1]).toHaveAttribute('stroke-dasharray', '40.4 100')
		expect(screen.getByText('Upload')).toBeInTheDocument()
	})

	it('draws a full ring undashed and clamps the value', () => {
		const { container, rerender } = render(<Progress variant="circular" value={100} showValue />)
		expect(container.querySelectorAll('circle')[1]).not.toHaveAttribute('stroke-dasharray')
		rerender(<Progress variant="circular" value={250} showValue />)
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
		rerender(<Progress variant="circular" value={-3} />)
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
	})

	it('is a spinning arc when indeterminate and hides the value', () => {
		const { container } = render(<Progress variant="circular" showValue label="Loading" size="sm" />)
		expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
		expect(container.querySelector('svg')).toHaveClass('animate-spin')
		expect(container.querySelector('path')).toBeInTheDocument()
		expect(screen.queryByText(/%/)).toBeNull()
	})

	it.each([
		['sm', '32'],
		['md', '64'],
		['lg', '96'],
	])('sizes the ring for %s', (size, width) => {
		const { container } = render(<Progress variant="circular" value={10} size={size} showValue />)
		expect(container.querySelector('svg')).toHaveAttribute('width', width)
	})

	it('omits the label when none is given', () => {
		const { container } = render(<Progress variant="circular" value={10} className="c" />)
		expect(container.firstChild).toHaveClass('c')
		expect(container.querySelector('span')).toBeNull()
	})
})

describe('Avatar (src, children and links)', () => {
	it('uses alt text on the image and keeps the name as the accessible name', () => {
		const { container } = render(<Avatar name="Ada" src="/a.png" alt="Ada portrait" />)
		expect(container.querySelector('img')).toHaveAttribute('alt', 'Ada portrait')
		expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument()
	})

	it('shows children when there is no image, and initials otherwise', () => {
		const { rerender } = render(
			<Avatar name="Ada">
				<i data-testid="icon" />
			</Avatar>
		)
		expect(screen.getByTestId('icon')).toBeInTheDocument()
		rerender(<Avatar name="Ada Lovelace" />)
		expect(screen.getByRole('img')).toHaveTextContent('AL')
	})

	it('falls back to children when the image fails, and retries for a new src', () => {
		const { container, rerender } = render(
			<Avatar name="Ada" src="/a.png">
				<b>fallback</b>
			</Avatar>
		)
		fireEvent.error(container.querySelector('img'))
		expect(screen.getByText('fallback')).toBeInTheDocument()
		rerender(
			<Avatar name="Ada" src="/b.png">
				<b>fallback</b>
			</Avatar>
		)
		expect(container.querySelector('img')).toHaveAttribute('src', '/b.png')
	})

	it('forwards extra props and className to the circle when not linked', () => {
		render(<Avatar name="Ada" className="k" data-x="1" />)
		expect(screen.getByRole('img')).toHaveAttribute('data-x', '1')
		expect(screen.getByRole('img')).toHaveClass('k')
	})

	it('renders a link when href is given', () => {
		const onClick = vi.fn()
		render(<Avatar name="Ada" href="/u/ada" target="_blank" className="k" onClick={onClick} />)
		const link = screen.getByRole('link', { name: 'Ada' })
		expect(link).toHaveAttribute('href', '/u/ada')
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveClass('k')
		fireEvent.click(link)
		expect(onClick).toHaveBeenCalled()
		expect(screen.queryByRole('img')).toBeNull()
	})

	it('supports router link components', () => {
		const Custom = ({ to, children, ...p }) => (
			<a data-custom href={to} {...p}>
				{children}
			</a>
		)
		render(<Avatar name="Ada" href="/x" linkComponent={Custom} linkProp="to" />)
		expect(screen.getByRole('link')).toHaveAttribute('data-custom')
		expect(screen.getByRole('link')).toHaveAttribute('href', '/x')
	})

	it('treats an empty href as a link', () => {
		render(<Avatar name="Ada" href="" />)
		expect(screen.getByRole('link')).toBeInTheDocument()
	})
})
