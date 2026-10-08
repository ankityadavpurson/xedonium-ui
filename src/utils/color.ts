// Black or white, whichever reads better on `color` (hex, #rgb, rgb() / rgba()); white when it cannot be parsed
const channels = (color: string): [number, number, number] | null => {
	const value = color.trim().toLowerCase()
	const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value)
	if (hex) {
		const digits = hex[1].length === 3 ? [...hex[1]].map(d => d + d).join('') : hex[1]
		return [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16)) as [number, number, number]
	}
	const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(value)
	return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null
}

export const readableTextColor = (color: string) => {
	const parsed = channels(color)
	if (!parsed) return '#ffffff'
	const [r, g, b] = parsed.map(channel => {
		const c = channel / 255
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#000000' : '#ffffff'
}
