import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { useRef } from 'react'
import useDialogFocus from '../../src/hooks/useDialogFocus'
import useDismissable from '../../src/hooks/useDismissable'
import useDocumentTitle from '../../src/hooks/useDocumentTitle'
import useEscapeKey from '../../src/hooks/useEscapeKey'
import useFlipAlign from '../../src/hooks/useFlipAlign'
import useKeyboardShortcuts from '../../src/hooks/useKeyboardShortcuts'
import useLeaveWarning from '../../src/hooks/useLeaveWarning'
import useTimedToast from '../../src/hooks/useTimedToast'

describe('useDocumentTitle', () => {
	it('joins title and suffix', () => {
		const { rerender } = renderHook(({ t }) => useDocumentTitle(t, 'App'), { initialProps: { t: 'Home' } })
		expect(document.title).toBe('Home · App')
		rerender({ t: '' })
		expect(document.title).toBe('App')
	})
	it('works without a suffix', () => {
		renderHook(() => useDocumentTitle('Only'))
		expect(document.title).toBe('Only')
	})
})

describe('useEscapeKey', () => {
	it('fires on Escape only while enabled', () => {
		const fn = vi.fn()
		const { rerender } = renderHook(({ on }) => useEscapeKey(on, fn), { initialProps: { on: true } })
		fireEvent.keyDown(window, { key: 'Enter' })
		expect(fn).not.toHaveBeenCalled()
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(fn).toHaveBeenCalledTimes(1)
		rerender({ on: false })
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(fn).toHaveBeenCalledTimes(1)
	})
})

describe('useLeaveWarning', () => {
	it('prevents unload only while active', () => {
		const { rerender } = renderHook(({ when }) => useLeaveWarning(when), { initialProps: { when: true } })
		const ev = new Event('beforeunload', { cancelable: true })
		window.dispatchEvent(ev)
		expect(ev.defaultPrevented).toBe(true)
		rerender({ when: false })
		const ev2 = new Event('beforeunload', { cancelable: true })
		window.dispatchEvent(ev2)
		expect(ev2.defaultPrevented).toBe(false)
	})
})

describe('useTimedToast', () => {
	beforeEach(() => vi.useFakeTimers())

	it('shows then clears after the duration', () => {
		const { result } = renderHook(() => useTimedToast(1000))
		act(() => result.current.showToast('Hi'))
		expect(result.current.toast).toMatchObject({ msg: 'Hi', type: 'success' })
		act(() => vi.advanceTimersByTime(1000))
		expect(result.current.toast).toBeNull()
	})

	it('supports type, link and custom duration', () => {
		const { result } = renderHook(() => useTimedToast())
		const link = { href: '/x', label: 'x' }
		act(() => result.current.showToast('A', 'error', { link, duration: 500 }))
		expect(result.current.toast).toEqual({ id: expect.any(Number), msg: 'A', type: 'error', link })
		act(() => vi.advanceTimersByTime(400))
		act(() => result.current.showToast('B'))
		act(() => vi.advanceTimersByTime(400))
		expect(result.current.toast.msg).toBe('B')
		act(() => vi.advanceTimersByTime(3000))
		expect(result.current.toast).toBeNull()
	})

	it('stacks several toasts, each with its own timer', () => {
		const { result } = renderHook(() => useTimedToast(1000))
		let first, second
		act(() => {
			first = result.current.showToast('A')
		})
		act(() => vi.advanceTimersByTime(600))
		act(() => {
			second = result.current.showToast('B', 'info')
		})
		expect(first).not.toBe(second)
		expect(result.current.toasts.map(t => t.msg)).toEqual(['A', 'B'])
		expect(result.current.toast.msg).toBe('B')
		act(() => vi.advanceTimersByTime(400))
		expect(result.current.toasts.map(t => t.msg)).toEqual(['B'])
		act(() => vi.advanceTimersByTime(600))
		expect(result.current.toasts).toEqual([])
		expect(result.current.toast).toBeNull()
	})

	it('drops the oldest beyond max and hides one or all', () => {
		const { result } = renderHook(() => useTimedToast(1000, { max: 2 }))
		act(() => {
			result.current.showToast('A')
			result.current.showToast('B')
			result.current.showToast('C')
		})
		expect(result.current.toasts.map(t => t.msg)).toEqual(['B', 'C'])
		act(() => result.current.hideToast(result.current.toasts[0].id))
		expect(result.current.toasts.map(t => t.msg)).toEqual(['C'])
		act(() => result.current.showToast('D', 'success', { duration: 0 }))
		act(() => result.current.hideToast())
		expect(result.current.toasts).toEqual([])
		act(() => vi.advanceTimersByTime(5000))
		expect(result.current.toasts).toEqual([])
	})

	it('supports actions, persistent toasts and hideToast', () => {
		const { result } = renderHook(() => useTimedToast(100))
		const actions = [{ label: 'Undo' }]
		act(() => result.current.showToast('A', 'info', { actions, duration: 0 }))
		act(() => vi.advanceTimersByTime(10000))
		expect(result.current.toast).toMatchObject({ msg: 'A', type: 'info', actions })
		act(() => result.current.hideToast())
		expect(result.current.toast).toBeNull()
	})

	it('clears the timer on unmount', () => {
		const { result, unmount } = renderHook(() => useTimedToast())
		act(() => result.current.showToast('A'))
		unmount()
		expect(() => vi.runAllTimers()).not.toThrow()
	})
})

describe('useDismissable', () => {
	const Harness = ({ open, onDismiss }) => {
		const ref = useRef(null)
		useDismissable(open, ref, onDismiss)
		return (
			<div>
				<div ref={ref} data-testid="inside">
					inside
				</div>
				<div data-testid="outside">outside</div>
			</div>
		)
	}

	it('dismisses on outside mousedown and Escape, not inside', () => {
		const fn = vi.fn()
		render(<Harness open onDismiss={fn} />)
		fireEvent.mouseDown(screen.getByTestId('inside'))
		expect(fn).not.toHaveBeenCalled()
		fireEvent.mouseDown(screen.getByTestId('outside'))
		expect(fn).toHaveBeenLastCalledWith('outside')
		fireEvent.keyDown(document, { key: 'a' })
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(fn).toHaveBeenLastCalledWith('escape')
	})

	it('does nothing when closed and uses the latest callback', () => {
		const a = vi.fn()
		const b = vi.fn()
		const { rerender } = render(<Harness open={false} onDismiss={a} />)
		fireEvent.mouseDown(screen.getByTestId('outside'))
		expect(a).not.toHaveBeenCalled()
		rerender(<Harness open onDismiss={a} />)
		rerender(<Harness open onDismiss={b} />)
		fireEvent.mouseDown(screen.getByTestId('outside'))
		expect(b).toHaveBeenCalledWith('outside')
		expect(a).not.toHaveBeenCalled()
	})

	it('accepts an array of refs', () => {
		const fn = vi.fn()
		const Multi = () => {
			const a = useRef(null)
			const b = useRef(null)
			useDismissable(true, [a, b], fn)
			return (
				<>
					<div ref={a} data-testid="a" />
					<div ref={b} data-testid="b" />
					<div data-testid="c" />
				</>
			)
		}
		render(<Multi />)
		fireEvent.mouseDown(screen.getByTestId('b'))
		expect(fn).not.toHaveBeenCalled()
		fireEvent.mouseDown(screen.getByTestId('c'))
		expect(fn).toHaveBeenCalledWith('outside')
	})
})

describe('useDialogFocus', () => {
	const Harness = ({ open, empty, autofocus }) => {
		const ref = useRef(null)
		useDialogFocus(open, ref)
		return (
			<div>
				<button>opener</button>
				<div ref={ref} tabIndex={-1} data-testid="dialog">
					{!empty && (
						<>
							<button>first</button>
							<input data-autofocus={autofocus ? '' : undefined} aria-label="mid" />
							<button>last</button>
						</>
					)}
				</div>
			</div>
		)
	}

	it('focuses first element, traps Tab, restores focus', () => {
		const { rerender } = render(<Harness open={false} />)
		screen.getByText('opener').focus()
		rerender(<Harness open />)
		expect(screen.getByText('first')).toHaveFocus()
		const dialog = screen.getByTestId('dialog')
		screen.getByText('last').focus()
		fireEvent.keyDown(dialog, { key: 'Tab' })
		expect(screen.getByText('first')).toHaveFocus()
		fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
		expect(screen.getByText('last')).toHaveFocus()
		fireEvent.keyDown(dialog, { key: 'Enter' })
		screen.getByLabelText('mid').focus()
		fireEvent.keyDown(dialog, { key: 'Tab' })
		expect(screen.getByLabelText('mid')).toHaveFocus()
		rerender(<Harness open={false} />)
		expect(screen.getByText('opener')).toHaveFocus()
	})

	it('prefers [data-autofocus]', () => {
		render(<Harness open autofocus />)
		expect(screen.getByLabelText('mid')).toHaveFocus()
	})

	it('focuses the container and blocks Tab when nothing is focusable', () => {
		render(<Harness open empty />)
		const dialog = screen.getByTestId('dialog')
		expect(dialog).toHaveFocus()
		const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
		dialog.dispatchEvent(ev)
		expect(ev.defaultPrevented).toBe(true)
	})

	it('focuses initialFocusRef first, ahead of data-autofocus', () => {
		const Custom = () => {
			const ref = useRef(null)
			const target = useRef(null)
			useDialogFocus(true, ref, target)
			return (
				<div ref={ref} tabIndex={-1}>
					<button>first</button>
					<input data-autofocus aria-label="auto" />
					<input ref={target} aria-label="target" />
				</div>
			)
		}
		render(<Custom />)
		expect(screen.getByLabelText('target')).toHaveFocus()
	})

	it('does nothing without a container', () => {
		const { result } = renderHook(() => useDialogFocus(true, { current: null }))
		expect(result.current).toBeUndefined()
	})
})

describe('useFlipAlign', () => {
	const panelWith = rect => ({ current: { getBoundingClientRect: () => rect } })

	it('flips end -> start when overflowing the left edge', () => {
		const ref = panelWith({ left: 2, right: 200 })
		const { result } = renderHook(() => useFlipAlign(true, ref, 'end'))
		expect(result.current).toBe('start')
	})

	it('flips start -> end when overflowing the right edge, resets on close', () => {
		const ref = panelWith({ left: 10, right: 99999 })
		const { result, rerender } = renderHook(({ open }) => useFlipAlign(open, ref, 'start'), {
			initialProps: { open: true },
		})
		expect(result.current).toBe('end')
		rerender({ open: false })
		expect(result.current).toBe('start')
	})

	it('keeps preferred when it fits or when there is no panel', () => {
		const fits = panelWith({ left: 50, right: 100 })
		expect(renderHook(() => useFlipAlign(true, fits, 'end')).result.current).toBe('end')
		expect(renderHook(() => useFlipAlign(true, { current: null }, 'end')).result.current).toBe('end')
	})
})

describe('useKeyboardShortcuts', () => {
	const press = (init, target = window) => fireEvent.keyDown(target, init)

	it('matches mod+key (ctrl off-Mac) exactly', () => {
		const fn = vi.fn()
		renderHook(() => useKeyboardShortcuts({ 'mod+k': fn }))
		press({ key: 'k', ctrlKey: true })
		expect(fn).toHaveBeenCalledTimes(1)
		press({ key: 'k' })
		press({ key: 'k', ctrlKey: true, shiftKey: true })
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('uses meta for mod on Mac', () => {
		vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel')
		const fn = vi.fn()
		renderHook(() => useKeyboardShortcuts({ 'mod+k': fn }))
		press({ key: 'k', metaKey: true })
		press({ key: 'k', ctrlKey: true })
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('supports explicit modifiers', () => {
		const fn = vi.fn()
		renderHook(() => useKeyboardShortcuts({ 'ctrl+alt+shift+meta+x': fn }))
		press({ key: 'X', ctrlKey: true, altKey: true, shiftKey: true, metaKey: true })
		expect(fn).toHaveBeenCalled()
	})

	it('ignores plain keys while typing, but not modifier combos', () => {
		const plain = vi.fn()
		const combo = vi.fn()
		renderHook(() => useKeyboardShortcuts({ '/': plain, 'mod+s': combo }))
		const input = document.createElement('input')
		const editable = document.createElement('div')
		Object.defineProperty(editable, 'isContentEditable', { value: true })
		document.body.append(input, editable)
		press({ key: '/' }, input)
		press({ key: '/' }, editable)
		expect(plain).not.toHaveBeenCalled()
		press({ key: 's', ctrlKey: true }, input)
		expect(combo).toHaveBeenCalled()
		press({ key: '/' }, document.body)
		expect(plain).toHaveBeenCalledTimes(1)
		press({ key: '/' }, window)
		expect(plain).toHaveBeenCalledTimes(2)
	})

	it('can be disabled and always uses the latest handlers', () => {
		const a = vi.fn()
		const b = vi.fn()
		const { rerender } = renderHook(({ s, on }) => useKeyboardShortcuts(s, on), {
			initialProps: { s: { a }, on: false },
		})
		press({ key: 'a' })
		expect(a).not.toHaveBeenCalled()
		rerender({ s: { a }, on: true })
		rerender({ s: { a: b }, on: true })
		press({ key: 'a' })
		expect(b).toHaveBeenCalled()
		expect(a).not.toHaveBeenCalled()
	})
})
