// Viewport-aware placement for floating panels (tooltips, menus, popovers, pickers).
// Everything here works in viewport coordinates, i.e. for `position: fixed` panels.

const EDGE = 8 // px kept clear of the viewport edges

const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

// "bottom-start" -> { side: 'bottom', align: 'start' }; "auto" / "top" default the alignment to centre
export const parsePlacement = (placement = 'bottom') => {
	const [side, align = 'center'] = placement.split('-')
	return { side, align }
}

const place = (side, align, anchor, panel, gap) => {
	if (side === 'top' || side === 'bottom') {
		const top = side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - panel.height
		const left =
			align === 'start'
				? anchor.left
				: align === 'end'
					? anchor.right - panel.width
					: anchor.left + anchor.width / 2 - panel.width / 2
		return { top, left }
	}
	const left = side === 'right' ? anchor.right + gap : anchor.left - gap - panel.width
	const top =
		align === 'start'
			? anchor.top
			: align === 'end'
				? anchor.bottom - panel.height
				: anchor.top + anchor.height / 2 - panel.height / 2
	return { top, left }
}

// How much of the panel sticks out of the viewport on the placement's main axis (0 = fits)
const overflow = (side, anchor, panel, gap, viewport) => {
	if (side === 'bottom') return Math.max(0, anchor.bottom + gap + panel.height - (viewport.height - EDGE))
	if (side === 'top') return Math.max(0, EDGE - (anchor.top - gap - panel.height))
	if (side === 'right') return Math.max(0, anchor.right + gap + panel.width - (viewport.width - EDGE))
	return Math.max(0, EDGE - (anchor.left - gap - panel.width))
}

/**
 * Where to put `panel` (a { width, height } box) relative to `anchor` (a DOMRect).
 * The preferred side flips to the opposite one when it doesn't fit; `auto` takes the first of
 * bottom, top, right, left that fits (or the least cramped). The result is clamped to the viewport.
 * Returns { top, left, side, align } where `side` / `align` are the ones actually used.
 */
export const computePosition = (anchor, panel, { placement = 'bottom', gap = 6, viewport } = {}) => {
	const vp = viewport ?? { width: document.documentElement.clientWidth, height: window.innerHeight }
	const { side: preferred, align } = parsePlacement(placement)

	let side = preferred
	if (preferred === 'auto') {
		const order = ['bottom', 'top', 'right', 'left']
		side = order.find(s => overflow(s, anchor, panel, gap, vp) === 0)
		if (!side)
			side = order.reduce((best, s) =>
				overflow(s, anchor, panel, gap, vp) < overflow(best, anchor, panel, gap, vp) ? s : best
			)
	} else if (overflow(preferred, anchor, panel, gap, vp) > 0) {
		const opposite = OPPOSITE[preferred]
		if (overflow(opposite, anchor, panel, gap, vp) < overflow(preferred, anchor, panel, gap, vp)) side = opposite
	}

	// start <-> end alignment flips when the panel would stick out sideways (e.g. a menu near the right edge)
	const vertical = side === 'top' || side === 'bottom'
	const cross = rect => (vertical ? [rect.left, rect.left + panel.width] : [rect.top, rect.top + panel.height])
	const limit = vertical ? vp.width : vp.height
	const sticksOut = rect => {
		const [from, to] = cross(rect)
		return Math.max(0, EDGE - from) + Math.max(0, to - (limit - EDGE))
	}
	let finalAlign = align
	let raw = place(side, align, anchor, panel, gap)
	if ((align === 'start' || align === 'end') && sticksOut(raw) > 0) {
		const other = align === 'start' ? 'end' : 'start'
		const flipped = place(side, other, anchor, panel, gap)
		if (sticksOut(flipped) < sticksOut(raw)) {
			raw = flipped
			finalAlign = other
		}
	}
	const top = Math.min(Math.max(EDGE, raw.top), Math.max(EDGE, vp.height - EDGE - panel.height))
	const left = Math.min(Math.max(EDGE, raw.left), Math.max(EDGE, vp.width - EDGE - panel.width))
	return { top, left, side, align: finalAlign }
}

/**
 * True when most of `element` (more than half of its area) is scrolled out of view: outside the viewport, or
 * outside the visible area of a scroll / overflow-hidden ancestor. Floating panels use it to hide instead of
 * hovering over unrelated content. A position: fixed ancestor (a fullscreen player, a dialog) ends the walk: it is laid
 * out against the viewport, so overflow further up the tree does not clip it.
 */
export const isClipped = element => {
	const rect = element.getBoundingClientRect()
	const area = rect.width * rect.height
	if (area === 0) return false
	let visible = {
		top: Math.max(rect.top, 0),
		left: Math.max(rect.left, 0),
		bottom: Math.min(rect.bottom, window.innerHeight),
		right: Math.min(rect.right, document.documentElement.clientWidth),
	}
	for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
		const { overflowX, overflowY, position } = getComputedStyle(parent)
		if (overflowX !== 'visible' || overflowY !== 'visible') {
			const box = parent.getBoundingClientRect()
			visible = {
				top: Math.max(visible.top, box.top),
				left: Math.max(visible.left, box.left),
				bottom: Math.min(visible.bottom, box.bottom),
				right: Math.min(visible.right, box.right),
			}
		}
		if (position === 'fixed') break
	}
	const width = Math.max(0, visible.right - visible.left)
	const height = Math.max(0, visible.bottom - visible.top)
	return (width * height) / area < 0.5
}
