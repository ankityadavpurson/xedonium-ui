import { fireEvent, render, screen } from '@testing-library/react'
import NotFoundPage from '../../src/components/NotFoundPage'

describe('NotFoundPage', () => {
	it('shows the defaults: code, title, description and a home link', () => {
		render(<NotFoundPage />)
		expect(screen.getByRole('heading', { level: 1, name: '404: Page not found' })).toBeInTheDocument()
		expect(screen.getByText(/does not exist or has moved/)).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/')
		expect(screen.queryByRole('button')).toBeNull()
		expect(screen.getByRole('region', { name: '404: Page not found' })).toBeInTheDocument()
	})

	it('accepts any status, custom text and links, and hides an empty description', () => {
		const { rerender } = render(
			<NotFoundPage
				code="500"
				title="Server error"
				description="Try again later."
				homeHref="/status"
				homeLabel="Status"
			/>
		)
		expect(screen.getByRole('heading', { name: '500: Server error' })).toBeInTheDocument()
		expect(screen.getByText('Try again later.')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Status' })).toHaveAttribute('href', '/status')
		rerender(<NotFoundPage description="" />)
		expect(screen.queryByText(/does not exist/)).toBeNull()
	})

	it('adds a back button when given onBack', () => {
		const onBack = vi.fn()
		render(<NotFoundPage onBack={onBack} backLabel="Back" />)
		fireEvent.click(screen.getByRole('button', { name: 'Back' }))
		expect(onBack).toHaveBeenCalledTimes(1)
	})

	it('can hide the home link, and shows nothing but the text without any action', () => {
		const { container, rerender } = render(<NotFoundPage homeHref={null} onBack={() => {}} />)
		expect(screen.queryByRole('link')).toBeNull()
		expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
		rerender(<NotFoundPage homeHref={null} />)
		expect(screen.queryByRole('link')).toBeNull()
		expect(screen.queryByRole('button')).toBeNull()
		expect(container.querySelector('a, button')).toBeNull()
	})

	it('supports router links, children, fullScreen and extra classes', () => {
		const Router = ({ to, children, ...rest }) => (
			<a data-to={to} {...rest}>
				{children}
			</a>
		)
		const { container } = render(
			<NotFoundPage homeHref="/start" linkComponent={Router} linkProp="to" fullScreen className="extra">
				<span>suggestions</span>
			</NotFoundPage>
		)
		expect(screen.getByText('Go home')).toHaveAttribute('data-to', '/start')
		expect(screen.getByText('suggestions')).toBeInTheDocument()
		expect(container.firstChild).toHaveClass('min-h-screen', 'extra')
	})

	it('gives each instance its own heading id', () => {
		render(
			<>
				<NotFoundPage title="One" />
				<NotFoundPage title="Two" />
			</>
		)
		const ids = screen.getAllByRole('heading', { level: 1 }).map(h => h.id)
		expect(new Set(ids).size).toBe(2)
	})
})
