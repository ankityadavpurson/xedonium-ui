import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
	cleanup()
	vi.useRealTimers()
	vi.restoreAllMocks()
	document.documentElement.removeAttribute('data-theme')
	document.title = ''
})

if (!window.matchMedia) {
	window.matchMedia = query => ({
		matches: false,
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	})
}

if (!globalThis.ResizeObserver) {
	globalThis.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
}

// Node 25 ships a stub `localStorage` that shadows the DOM one; use an in-memory Storage instead
if (typeof window.localStorage?.clear !== 'function') {
	class MemoryStorage {
		#data = new Map()
		get length() {
			return this.#data.size
		}
		key(i) {
			return [...this.#data.keys()][i] ?? null
		}
		getItem(k) {
			return this.#data.has(k) ? this.#data.get(k) : null
		}
		setItem(k, v) {
			this.#data.set(String(k), String(v))
		}
		removeItem(k) {
			this.#data.delete(k)
		}
		clear() {
			this.#data.clear()
		}
	}
	for (const name of ['localStorage', 'sessionStorage']) {
		Object.defineProperty(window, name, { value: new MemoryStorage(), configurable: true })
		Object.defineProperty(globalThis, name, { value: window[name], configurable: true })
	}
	globalThis.Storage = window.Storage = MemoryStorage
}
