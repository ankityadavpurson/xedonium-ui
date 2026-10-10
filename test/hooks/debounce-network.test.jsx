import { act, renderHook } from '@testing-library/react'
import useDebouncedValue from '../../src/hooks/useDebouncedValue'
import useNetworkStatus from '../../src/hooks/useNetworkStatus'

describe('useDebouncedValue options', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	const setup = (options, delay = 300) =>
		renderHook(({ value }) => useDebouncedValue(value, delay, options), { initialProps: { value: 'a' } })

	it('returns the value at once when the delay is zero or negative', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
			initialProps: { value: 'a', delay: 0 },
		})
		rerender({ value: 'b', delay: 0 })
		expect(result.current).toBe('b')
		rerender({ value: 'c', delay: -5 })
		expect(result.current).toBe('c')
	})

	it('uses a 300 ms delay by default', () => {
		const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value), { initialProps: { value: 'a' } })
		rerender({ value: 'b' })
		act(() => vi.advanceTimersByTime(299))
		expect(result.current).toBe('a')
		act(() => vi.advanceTimersByTime(1))
		expect(result.current).toBe('b')
	})

	it('with leading, takes the first change of a burst at once and debounces the rest', () => {
		const { result, rerender } = setup({ leading: true })
		rerender({ value: 'b' })
		expect(result.current).toBe('b')
		rerender({ value: 'c' })
		act(() => vi.advanceTimersByTime(200))
		rerender({ value: 'd' })
		expect(result.current).toBe('b')
		act(() => vi.advanceTimersByTime(300))
		expect(result.current).toBe('d')
	})

	it('with leading, treats a change after a quiet period as the start of a new burst', () => {
		const { result, rerender } = setup({ leading: true })
		rerender({ value: 'b' })
		act(() => vi.advanceTimersByTime(1000))
		rerender({ value: 'c' })
		expect(result.current).toBe('c')
	})

	it('with maxWait, never waits longer than that while the value keeps changing', () => {
		const { result, rerender } = setup({ maxWait: 500 })
		rerender({ value: 'b' })
		act(() => vi.advanceTimersByTime(250))
		rerender({ value: 'c' })
		act(() => vi.advanceTimersByTime(250))
		// 500 ms after the burst began the latest value goes through, although it was still changing
		expect(result.current).toBe('c')
		rerender({ value: 'd' })
		act(() => vi.advanceTimersByTime(300))
		expect(result.current).toBe('d')
	})

	it('with maxWait, a quiet value still settles after the delay', () => {
		const { result, rerender } = setup({ maxWait: 1000 })
		rerender({ value: 'b' })
		act(() => vi.advanceTimersByTime(300))
		expect(result.current).toBe('b')
	})

	it('restarts the wait when the delay changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
			initialProps: { value: 'a', delay: 300 },
		})
		rerender({ value: 'b', delay: 300 })
		act(() => vi.advanceTimersByTime(200))
		rerender({ value: 'b', delay: 100 })
		act(() => vi.advanceTimersByTime(100))
		expect(result.current).toBe('b')
	})
})

describe('useNetworkStatus', () => {
	const setOnline = value => Object.defineProperty(window.navigator, 'onLine', { configurable: true, value })
	afterEach(() => {
		setOnline(true)
		delete window.navigator.connection
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('follows the browser online and offline events', () => {
		const { result } = renderHook(() => useNetworkStatus({ probeUrl: '' }))
		expect(result.current).toMatchObject({ status: 'online', online: true })
		act(() => {
			setOnline(false)
			window.dispatchEvent(new Event('offline'))
		})
		expect(result.current).toMatchObject({ status: 'offline', online: false })
		act(() => {
			setOnline(true)
			window.dispatchEvent(new Event('online'))
		})
		expect(result.current.status).toBe('online')
	})

	it('starts offline when the browser is offline, and stops listening when disabled', () => {
		setOnline(false)
		const { result, rerender } = renderHook(({ enabled }) => useNetworkStatus({ probeUrl: '', enabled }), {
			initialProps: { enabled: false },
		})
		expect(result.current.status).toBe('offline')
		act(() => {
			setOnline(true)
			window.dispatchEvent(new Event('online'))
		})
		expect(result.current.status).toBe('offline')
		rerender({ enabled: true })
		expect(result.current.status).toBe('online')
	})

	it('checks the probe URL: reachable gives the latency, unreachable gives "unreachable"', async () => {
		const fetchMock = vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('down')).mockResolvedValue({})
		vi.stubGlobal('fetch', fetchMock)
		const { result } = renderHook(() => useNetworkStatus({ probeUrl: '/health' }))
		await act(async () => {})
		expect(result.current.status).toBe('online')
		expect(typeof result.current.latency).toBe('number')
		expect(result.current.lastChecked).toBeInstanceOf(Date)
		await act(async () => {
			await result.current.check()
		})
		expect(result.current.status).toBe('unreachable')
		expect(fetchMock).toHaveBeenCalledWith(
			'/health',
			expect.objectContaining({ method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
		)
		await act(async () => {
			await result.current.check()
		})
		expect(result.current.status).toBe('online')
	})

	it('checks again when the browser comes back online and on an interval', async () => {
		vi.useFakeTimers()
		const fetchMock = vi.fn().mockResolvedValue({})
		vi.stubGlobal('fetch', fetchMock)
		renderHook(() => useNetworkStatus({ probeUrl: '/health', interval: 1000 }))
		await act(async () => {})
		expect(fetchMock).toHaveBeenCalledTimes(1)
		await act(async () => {
			vi.advanceTimersByTime(1000)
		})
		expect(fetchMock).toHaveBeenCalledTimes(2)
		await act(async () => {
			window.dispatchEvent(new Event('online'))
		})
		expect(fetchMock).toHaveBeenCalledTimes(3)
	})

	it('gives up on a slow probe after the timeout', async () => {
		vi.useFakeTimers()
		vi.stubGlobal(
			'fetch',
			vi.fn(
				(url, { signal }) =>
					new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted'))))
			)
		)
		const { result } = renderHook(() => useNetworkStatus({ probeUrl: '/slow', timeout: 2000 }))
		expect(result.current.status).toBe('checking')
		await act(async () => {
			vi.advanceTimersByTime(2000)
		})
		expect(result.current.status).toBe('unreachable')
	})

	it('does nothing without a probe URL when check() is called', async () => {
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)
		const { result } = renderHook(() => useNetworkStatus({ probeUrl: '' }))
		await act(async () => {
			await result.current.check()
		})
		expect(fetchMock).not.toHaveBeenCalled()
		expect(result.current.status).toBe('online')
	})

	it('reads and updates the connection information the browser has', () => {
		const listeners = {}
		window.navigator.connection = {
			effectiveType: '3g',
			downlink: 1.5,
			rtt: 300,
			saveData: false,
			addEventListener: (type, fn) => (listeners[type] = fn),
			removeEventListener: () => {},
		}
		const { result } = renderHook(() => useNetworkStatus({ probeUrl: '' }))
		expect(result.current.connection).toEqual({ effectiveType: '3g', downlink: 1.5, rtt: 300, saveData: false })
		act(() => {
			window.navigator.connection.effectiveType = '4g'
			listeners.change()
		})
		expect(result.current.connection.effectiveType).toBe('4g')
	})

	it('does not update after it has unmounted', async () => {
		let resolve
		vi.stubGlobal(
			'fetch',
			vi.fn(() => new Promise(r => (resolve = r)))
		)
		const { result, unmount } = renderHook(() => useNetworkStatus({ probeUrl: '/late' }))
		expect(result.current.status).toBe('checking')
		unmount()
		await act(async () => resolve({}))
		expect(result.current.status).toBe('checking')
	})
})
