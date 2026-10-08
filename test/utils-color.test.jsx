import { readableTextColor } from '../src/utils/color'

describe('readableTextColor', () => {
	it.each([
		['#ffffff', '#000000'],
		['#facc15', '#000000'],
		['#000', '#ffffff'],
		['#2563eb', '#ffffff'],
		['rgb(255, 255, 255)', '#000000'],
		['rgba(10 20 30 / 0.5)', '#ffffff'],
		['  #FFF  ', '#000000'],
	])('%s -> %s', (color, expected) => {
		expect(readableTextColor(color)).toBe(expected)
	})

	it('falls back to white for colors it cannot read', () => {
		expect(readableTextColor('royalblue')).toBe('#ffffff')
		expect(readableTextColor('var(--brand)')).toBe('#ffffff')
	})
})
