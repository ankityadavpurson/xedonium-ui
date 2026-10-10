import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { createRef } from 'react'
import BackToTop from '../../src/components/BackToTop'
import ScrollProgress from '../../src/components/ScrollProgress'
import useScrollProgress from '../../src/hooks/useScrollProgress'

// happy-dom has no layout: give an element a scroll size and position
const scroller = ({ scrollHeight = 1000, clientHeight = 200, scrollTop = 0 } = {}) => {
	const element = document.createElement('div')
	document.body.appendChild(element)
	Object.defineProperty(element, 'scrollHeight', { configurable: true, value: scrollHeight })
	Object.defineProperty(element, 'clientHeight', { configurable: true, value: clientHeight })
	element.scrollTop = scrollTop
	element.scrollTo = vi.fn()
	return element
}
const scrollTo = (element, top) =>
	act(() => {
		element.scrollTop = top
		fireEvent.scroll(element)
	})

afterEach(() => {
	document.body.innerHTML = ''
	vi.restoreAllMocks()
})

describe('useScrollProgress', () => {
	it('reports how far an element has scrolled', () => {
		const element = scroller()
		const { result } = renderHook(() => useScrollProgress(element))
		expect(result.current).toEqual({ progress: 0, scrollTop: 0, scrollable: true })
		scrollTo(element, 400)
		expect(result.current).toMatchObject({ progress: 0.5, scrollTop: 400 })
		scrollTo(element, 5000)
		expect(result.current.progress).toBe(1)
	})

	it('counts a position within a pixel of the end as the end', () => {
		const element = scroller()
		const { result } = renderHook(() => useScrollProgress(element))
		scrollTo(element, 799.6)
		expect(result.current.progress).toBe(1)
	})

	it('reads a ref after the first render', () => {
		const element = scroller()
		const ref = { current: element }
		const { result } = renderHook(() => useScrollProgress(ref))
		scrollTo(element, 200)
		expect(result.current.progress).toBe(0.25)
	})

	it('says there is nothing to scroll when the content fits', () => {
		const element = scroller({ scrollHeight: 200, clientHeight: 200 })
		const { result } = renderHook(() => useScrollProgress(element))
		expect(result.current).toEqual({ progress: 0, scrollTop: 0, scrollable: false })
	})

	it('measures the page when there is no target, and follows resizes', () => {
		const root = document.documentElement
		Object.defineProperty(root, 'scrollHeight', { configurable: true, value: 2000 })
		Object.defineProperty(root, 'clientHeight', { configurable: true, value: 1000 })
		const { result } = renderHook(() => useScrollProgress())
		expect(result.current.scrollable).toBe(true)
		act(() => {
			window.scrollY = 500
			fireEvent.scroll(window)
		})
		expect(result.current.progress).toBe(0.5)
		Object.defineProperty(root, 'scrollHeight', { configurable: true, value: 3000 })
		act(() => void fireEvent(window, new Event('resize')))
		expect(result.current.progress).toBe(0.25)
		window.scrollY = 0
		delete root.scrollHeight
		delete root.clientHeight
	})

	it('stops listening when it unmounts', () => {
		const element = scroller()
		const remove = vi.spyOn(element, 'removeEventListener')
		renderHook(() => useScrollProgress(element)).unmount()
		expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
	})

	it('does nothing for a ref that points at nothing', () => {
		const { result } = renderHook(() => useScrollProgress({ current: null }))
		expect(result.current.progress).toBe(0)
	})
})

describe('BackToTop', () => {
	it('is hidden until the target has scrolled past the threshold', () => {
		const element = scroller()
		render(<BackToTop target={element} fixed={false} threshold={100} />)
		const hidden = screen.getByLabelText('Back to top', { selector: 'button' })
		expect(hidden.closest('div')).toHaveClass('invisible')
		expect(hidden).toHaveAttribute('tabindex', '-1')
		scrollTo(element, 150)
		expect(hidden.closest('div')).not.toHaveClass('invisible')
		expect(hidden).toHaveAttribute('tabindex', '0')
	})

	it('scrolls the target to the top, smoothly or at once', () => {
		const element = scroller({ scrollTop: 500 })
		const { rerender } = render(<BackToTop target={element} fixed={false} />)
		fireEvent.click(screen.getByRole('button', { hidden: true }))
		expect(element.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
		rerender(<BackToTop target={element} fixed={false} instant />)
		fireEvent.click(screen.getByRole('button', { hidden: true }))
		expect(element.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
	})

	it('skips the animation when the reader prefers reduced motion', () => {
		vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} })
		const element = scroller({ scrollTop: 500 })
		render(<BackToTop target={element} fixed={false} />)
		fireEvent.click(screen.getByRole('button', { hidden: true }))
		expect(element.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
	})

	it('scrolls the window and uses a ref target', () => {
		const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		const { unmount } = render(<BackToTop />)
		fireEvent.click(screen.getByRole('button', { hidden: true }))
		expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
		unmount()
		const element = scroller()
		const ref = createRef()
		ref.current = element
		render(<BackToTop target={ref} fixed={false} />)
		fireEvent.click(screen.getByRole('button', { hidden: true }))
		expect(element.scrollTo).toHaveBeenCalled()
	})

	it('is fixed to the page by default and can sit in another corner', () => {
		const { container, rerender } = render(<BackToTop position="bottom-left" />)
		expect(container.firstChild).toHaveClass('fixed', 'left-5')
		rerender(<BackToTop fixed={false} position="bottom-center" className="extra" />)
		expect(container.firstChild).toHaveClass('absolute', 'left-1/2', 'extra')
	})

	it('can draw a progress ring and take a custom label, shape and icon', () => {
		const element = scroller()
		const { container } = render(
			<BackToTop target={element} fixed={false} showProgress label="Top">
				<span>up</span>
			</BackToTop>
		)
		expect(screen.getByLabelText('Top', { selector: 'button' })).toHaveClass('rounded-full')
		expect(screen.getByText('up')).toBeInTheDocument()
		scrollTo(element, 400)
		const arc = container.querySelectorAll('circle')[1]
		expect(arc).toHaveAttribute('stroke-dashoffset', '50')
	})

	it('draws a closed ring, without a seam, at the end', () => {
		const element = scroller()
		const { container } = render(<BackToTop target={element} fixed={false} showProgress />)
		scrollTo(element, 800)
		const arc = container.querySelectorAll('circle')[1]
		expect(arc).not.toHaveAttribute('stroke-dasharray')
		scrollTo(element, 400)
		expect(container.querySelectorAll('circle')[1]).toHaveAttribute('stroke-dasharray', '100')
	})

	it('is square by default, and round when asked', () => {
		const { rerender } = render(<BackToTop fixed={false} />)
		expect(screen.getByRole('button', { hidden: true })).not.toHaveClass('rounded-full')
		rerender(<BackToTop fixed={false} shape="circle" />)
		expect(screen.getByRole('button', { hidden: true })).toHaveClass('rounded-full')
	})
})

describe('ScrollProgress', () => {
	it('fills the bar as the target scrolls', () => {
		const element = scroller()
		render(<ScrollProgress target={element} fixed={false} />)
		const bar = screen.getByRole('progressbar', { name: 'Reading progress' })
		expect(bar).toHaveAttribute('aria-valuenow', '0')
		scrollTo(element, 600)
		expect(bar).toHaveAttribute('aria-valuenow', '75')
		expect(bar.firstChild).toHaveStyle({ width: '75%' })
		expect(bar).toHaveClass('absolute', 'top-0')
	})

	it('can sit at the bottom, be thicker, fixed and named', () => {
		render(<ScrollProgress edge="bottom" thickness={8} label="Read" className="extra" />)
		const bar = screen.getByRole('progressbar', { name: 'Read' })
		expect(bar).toHaveClass('fixed', 'bottom-0', 'extra')
		expect(bar).toHaveStyle({ height: '8px' })
	})

	it('shows a back-to-top button with a ring in the button variant', () => {
		const element = scroller()
		const { container } = render(
			<ScrollProgress
				variant="button"
				target={element}
				fixed={false}
				threshold={50}
				position="bottom-left"
				size="sm"
				label="Up"
			/>
		)
		expect(screen.queryByRole('progressbar')).toBeNull()
		scrollTo(element, 100)
		expect(screen.getByRole('button', { name: 'Up' })).toBeInTheDocument()
		expect(container.querySelectorAll('circle')).toHaveLength(2)
	})
})
