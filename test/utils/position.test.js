import { computePosition, isClipped, parsePlacement } from '../../src/utils/position'

const anchor = (left, top, width = 100, height = 30) => ({
	left,
	top,
	width,
	height,
	right: left + width,
	bottom: top + height,
})
const vp = { width: 1000, height: 800 }
const panel = { width: 200, height: 100 }

describe('parsePlacement', () => {
	it('splits side and align', () => {
		expect(parsePlacement('bottom-start')).toEqual({ side: 'bottom', align: 'start' })
		expect(parsePlacement('top')).toEqual({ side: 'top', align: 'center' })
		expect(parsePlacement()).toEqual({ side: 'bottom', align: 'center' })
	})
})

describe('computePosition', () => {
	it('places below, centred', () => {
		const r = computePosition(anchor(400, 100), panel, { viewport: vp })
		expect(r).toMatchObject({ side: 'bottom', align: 'center', top: 136, left: 350 })
	})

	it('places above, start and end aligned', () => {
		const start = computePosition(anchor(400, 400), panel, { placement: 'top-start', viewport: vp })
		expect(start).toMatchObject({ side: 'top', left: 400, top: 400 - 6 - 100 })
		const end = computePosition(anchor(400, 400), panel, { placement: 'top-end', viewport: vp })
		expect(end.left).toBe(500 - 200)
	})

	it('places left and right with each alignment', () => {
		const right = computePosition(anchor(100, 300), panel, { placement: 'right', viewport: vp })
		expect(right).toMatchObject({ side: 'right', left: 206, top: 315 - 50 })
		const rs = computePosition(anchor(100, 300), panel, { placement: 'right-start', viewport: vp })
		expect(rs.top).toBe(300)
		const re = computePosition(anchor(100, 300), panel, { placement: 'right-end', viewport: vp })
		expect(re.top).toBe(330 - 100)
		const left = computePosition(anchor(500, 300), panel, { placement: 'left', viewport: vp })
		expect(left).toMatchObject({ side: 'left', left: 500 - 6 - 200 })
	})

	it('flips to the opposite side when it does not fit', () => {
		expect(computePosition(anchor(400, 750), panel, { placement: 'bottom', viewport: vp }).side).toBe('top')
		expect(computePosition(anchor(400, 10), panel, { placement: 'top', viewport: vp }).side).toBe('bottom')
		expect(computePosition(anchor(900, 300), panel, { placement: 'right', viewport: vp }).side).toBe('left')
		expect(computePosition(anchor(20, 300), panel, { placement: 'left', viewport: vp }).side).toBe('right')
	})

	it('keeps the preferred side when the opposite fits no better', () => {
		const tiny = { width: 100, height: 100 }
		const r = computePosition(anchor(10, 10, 10, 10), tiny, {
			placement: 'bottom',
			viewport: { width: 500, height: 50 },
		})
		expect(r.side).toBe('bottom')
	})

	it('auto picks the first side that fits', () => {
		expect(computePosition(anchor(400, 100), panel, { placement: 'auto', viewport: vp }).side).toBe('bottom')
		expect(computePosition(anchor(400, 740), panel, { placement: 'auto', viewport: vp }).side).toBe('top')
	})

	it('auto picks the least cramped when nothing fits', () => {
		const big = { width: 900, height: 700 }
		const r = computePosition(anchor(450, 385, 100, 30), big, { placement: 'auto', viewport: vp })
		expect(['top', 'bottom', 'left', 'right']).toContain(r.side)
	})

	it('flips start/end alignment when the panel sticks out sideways', () => {
		expect(computePosition(anchor(900, 100), panel, { placement: 'bottom-start', viewport: vp }).align).toBe('end')
		expect(computePosition(anchor(0, 100, 50), panel, { placement: 'bottom-end', viewport: vp }).align).toBe('start')
		expect(computePosition(anchor(100, 780), panel, { placement: 'right-start', viewport: vp }).align).toBe('end')
	})

	it('keeps alignment when flipping would not help', () => {
		const wide = { width: 990, height: 100 }
		const r = computePosition(anchor(500, 100), wide, { placement: 'bottom-start', viewport: vp })
		expect(r.left).toBeGreaterThanOrEqual(8)
	})

	it('clamps into the viewport', () => {
		const r = computePosition(anchor(-100, -100), panel, { placement: 'bottom', viewport: vp })
		expect(r.left).toBe(8)
		expect(r.top).toBeGreaterThanOrEqual(8)
	})

	it('falls back to window size without a viewport', () => {
		expect(computePosition(anchor(10, 10), { width: 10, height: 10 }).side).toBe('bottom')
	})
})

describe('isClipped', () => {
	beforeEach(() => {
		vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024)
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768)
	})

	const rectOf = (el, r) => {
		el.getBoundingClientRect = () => ({
			left: r[0],
			top: r[1],
			right: r[0] + r[2],
			bottom: r[1] + r[3],
			width: r[2],
			height: r[3],
		})
	}

	it('is false for zero-area elements', () => {
		const el = document.createElement('div')
		document.body.append(el)
		rectOf(el, [0, 0, 0, 0])
		expect(isClipped(el)).toBe(false)
	})

	it('detects an element outside the viewport', () => {
		const el = document.createElement('div')
		document.body.append(el)
		rectOf(el, [0, -500, 100, 100])
		expect(isClipped(el)).toBe(true)
	})

	it('is false for a visible element', () => {
		const el = document.createElement('div')
		document.body.append(el)
		rectOf(el, [10, 10, 100, 100])
		expect(isClipped(el)).toBe(false)
	})

	it('stops at a fixed ancestor, which is not clipped by overflow further up (fullscreen player)', () => {
		const scroller = document.createElement('div')
		scroller.style.overflowX = 'auto'
		scroller.style.overflowY = 'auto'
		const fixed = document.createElement('div')
		fixed.style.position = 'fixed'
		fixed.style.overflowX = 'hidden'
		fixed.style.overflowY = 'hidden'
		const el = document.createElement('div')
		fixed.append(el)
		scroller.append(fixed)
		document.body.append(scroller)
		rectOf(scroller, [0, 0, 100, 50]) // far from where the fixed player is
		rectOf(fixed, [0, 0, 1000, 700])
		rectOf(el, [500, 600, 100, 30])
		expect(isClipped(el)).toBe(false)
		// the fixed ancestor's own overflow still clips
		rectOf(fixed, [0, 0, 300, 300])
		expect(isClipped(el)).toBe(true)
	})

	it('accounts for scroll/overflow ancestors', () => {
		const wrapper = document.createElement('div')
		wrapper.style.overflowX = 'hidden'
		wrapper.style.overflowY = 'hidden'
		const plain = document.createElement('div')
		plain.style.overflowX = 'visible'
		plain.style.overflowY = 'visible'
		const el = document.createElement('div')
		plain.append(el)
		wrapper.append(plain)
		document.body.append(wrapper)
		rectOf(wrapper, [0, 0, 100, 50])
		rectOf(el, [10, 10, 100, 100])
		expect(isClipped(el)).toBe(true)
		rectOf(wrapper, [0, 0, 300, 300])
		expect(isClipped(el)).toBe(false)
	})
})
