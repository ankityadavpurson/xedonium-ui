import { fireEvent, render, screen } from '@testing-library/react'
import PipelineGraph from '../../src/components/PipelineGraph'

const nodes = [
	{ id: 'changes', label: 'changes', status: 'success', duration: '3s' },
	{ id: 'verify', label: 'verify', status: 'running', needs: ['changes'] },
	{ id: 'build', label: 'build', status: 'failed', duration: '1m', needs: ['verify'] },
	{ id: 'deploy', label: 'deploy', status: 'queued', needs: ['build'] },
	{ id: 'lint', label: 'lint', status: 'skipped', needs: ['changes'] },
	{ id: 'old', label: 'old', status: 'cancelled' },
]

describe('PipelineGraph', () => {
	it('renders a labelled region with one button per node, named with its status', () => {
		render(<PipelineGraph nodes={nodes} aria-label="Publish run" />)
		expect(screen.getByRole('region', { name: 'Publish run' })).toBeInTheDocument()
		expect(screen.getAllByRole('button')).toHaveLength(6)
		expect(screen.getByRole('button', { name: 'changes, success, 3s' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'verify, running' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'build, failed, 1m' })).toHaveClass('border-red-500')
	})

	it('defaults the region name to Pipeline and draws a connector per dependency', () => {
		const { container } = render(<PipelineGraph nodes={nodes} />)
		expect(screen.getByRole('region', { name: 'Pipeline' })).toBeInTheDocument()
		expect(container.querySelectorAll('svg.absolute path')).toHaveLength(4)
	})

	it('calls onNodeClick with the node and marks the selected one', () => {
		const onNodeClick = vi.fn()
		render(<PipelineGraph nodes={nodes} onNodeClick={onNodeClick} selectedId="build" />)
		fireEvent.click(screen.getByRole('button', { name: /^verify/ }))
		expect(onNodeClick).toHaveBeenCalledWith(nodes[1])
		expect(screen.getByRole('button', { name: /^build/ })).toHaveAttribute('aria-current', 'true')
		expect(screen.getByRole('button', { name: /^verify/ })).not.toHaveAttribute('aria-current')
	})

	it('uses renderNode for the node content', () => {
		render(
			<PipelineGraph
				nodes={nodes.slice(0, 2)}
				selectedId="verify"
				renderNode={(node, { selected }) => `${node.id}:${selected}`}
			/>
		)
		expect(screen.getByText('changes:false')).toBeInTheDocument()
		expect(screen.getByText('verify:true')).toBeInTheDocument()
	})

	it('renders nothing for no nodes, or the empty text', () => {
		const { container, rerender } = render(<PipelineGraph nodes={[]} />)
		expect(container).toBeEmptyDOMElement()
		rerender(<PipelineGraph nodes={[]} emptyText="No jobs" />)
		expect(screen.getByText('No jobs')).toBeInTheDocument()
	})

	it('sizes the canvas from the layout and the sizing props', () => {
		render(<PipelineGraph nodes={nodes.slice(0, 3)} nodeWidth={100} nodeHeight={40} gapX={20} gapY={10} />)
		// 3 columns (340px) and 1 row, plus 8px of padding on each side
		const canvas = screen.getByTestId('pipeline-canvas')
		expect(canvas.style.width).toBe('356px')
		expect(canvas.style.height).toBe('56px')
	})

	describe('panning', () => {
		// happy-dom has no layout: report a frame smaller than the canvas (which is 356 x 56 here)
		let widthSpy, heightSpy
		beforeEach(() => {
			widthSpy = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(150)
			heightSpy = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(40)
		})
		afterEach(() => {
			widthSpy.mockRestore()
			heightSpy.mockRestore()
		})

		const setup = onNodeClick => {
			render(
				<PipelineGraph
					nodes={nodes.slice(0, 3)}
					onNodeClick={onNodeClick}
					nodeWidth={100}
					nodeHeight={40}
					gapX={20}
					gapY={10}
				/>
			)
			return { frame: screen.getByRole('region'), canvas: screen.getByTestId('pipeline-canvas') }
		}

		const drag = (target, from, to) => {
			fireEvent.pointerDown(target, { clientX: from, clientY: 0, button: 0, pointerType: 'mouse' })
			fireEvent.pointerMove(window, { clientX: to, clientY: 0 })
			fireEvent.pointerUp(window, { clientX: to, clientY: 0 })
		}

		it('pans when the graph is wider than its frame, within its size', () => {
			const { frame, canvas } = setup()
			expect(frame).toHaveClass('cursor-grab')
			drag(frame, 100, 60)
			expect(canvas.style.transform).toBe('translate(-40px, 0px)')
			drag(frame, 100, -400)
			// 150px frame, 356px canvas: at most 206px to the left
			expect(canvas.style.transform).toBe('translate(-206px, 0px)')
			drag(frame, 0, 400)
			expect(canvas.style.transform).toBe('translate(0px, 0px)')
		})

		it('does not click the node under the pointer after a drag', () => {
			const onNodeClick = vi.fn()
			const { frame } = setup(onNodeClick)
			const button = screen.getByRole('button', { name: /^changes/ })
			drag(button, 100, 60)
			fireEvent.click(button)
			expect(onNodeClick).not.toHaveBeenCalled()
			// the next plain click goes through
			fireEvent.click(button)
			expect(onNodeClick).toHaveBeenCalledTimes(1)
			expect(frame).toBeInTheDocument()
		})

		it('still clicks after a movement under 4px', () => {
			const onNodeClick = vi.fn()
			setup(onNodeClick)
			const button = screen.getByRole('button', { name: /^changes/ })
			drag(button, 100, 102)
			fireEvent.click(button)
			expect(onNodeClick).toHaveBeenCalledTimes(1)
		})

		it('does not pan, or show a grab cursor, when everything fits', () => {
			widthSpy.mockReturnValue(1000)
			heightSpy.mockReturnValue(1000)
			const { frame, canvas } = setup()
			expect(frame).not.toHaveClass('cursor-grab')
			drag(frame, 100, 0)
			expect(canvas.style.transform).toBe('translate(0px, 0px)')
		})
	})
})
