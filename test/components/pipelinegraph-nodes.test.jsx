import { fireEvent, render, screen } from '@testing-library/react'
import PipelineGraph from '../../src/components/PipelineGraph'

describe('PipelineGraph node customization', () => {
	it('renders a React label, description, custom icon and trailing content', () => {
		render(
			<PipelineGraph
				nodes={[
					{
						id: 'build',
						label: <em>Build</em>,
						status: 'success',
						duration: '4s',
						description: 'on main',
						icon: <span data-testid="my-icon" />,
						trailing: <span>v2</span>,
					},
				]}
			/>
		)
		const button = screen.getByRole('button')
		expect(button).toHaveTextContent('Build')
		expect(button.querySelector('em')).toBeInTheDocument()
		expect(button).toHaveTextContent('on main')
		expect(button).toHaveTextContent('4s')
		expect(button).toHaveTextContent('v2')
		expect(screen.getByTestId('my-icon')).toBeInTheDocument()
		// the custom icon replaces the status icon
		expect(button.querySelector('svg')).toBeNull()
	})

	it('names a node from its id when the label is not text, or from ariaLabel', () => {
		render(
			<PipelineGraph
				nodes={[
					{ id: 'one', label: <em>One</em>, status: 'queued' },
					{ id: 'two', label: <em>Two</em>, status: 'failed', ariaLabel: 'Second job failed', title: 'See logs' },
				]}
			/>
		)
		expect(screen.getByRole('button', { name: 'one, queued' })).toBeInTheDocument()
		const two = screen.getByRole('button', { name: 'Second job failed' })
		expect(two).toHaveAttribute('title', 'See logs')
	})

	it('applies a per-node className and disables a node', () => {
		const onNodeClick = vi.fn()
		render(
			<PipelineGraph
				onNodeClick={onNodeClick}
				nodes={[
					{ id: 'a', label: 'a', status: 'success', className: 'bg-red-50' },
					{ id: 'b', label: 'b', status: 'queued', disabled: true },
				]}
			/>
		)
		expect(screen.getByRole('button', { name: /^a/ })).toHaveClass('bg-red-50')
		const disabled = screen.getByRole('button', { name: /^b/ })
		expect(disabled).toBeDisabled()
		fireEvent.click(disabled)
		expect(onNodeClick).not.toHaveBeenCalled()
	})

	it('gives renderNode the default icon to keep', () => {
		render(
			<PipelineGraph
				nodes={[{ id: 'a', label: 'a', status: 'success' }]}
				renderNode={(node, { icon }) => (
					<>
						{icon}
						<span>custom {node.id}</span>
					</>
				)}
			/>
		)
		const button = screen.getByRole('button')
		expect(button).toHaveTextContent('custom a')
		expect(button.querySelector('svg')).toBeInTheDocument()
	})
})
