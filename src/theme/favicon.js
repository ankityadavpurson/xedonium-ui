import { THEME_FAVICON_COLORS } from './constants'

export const buildFaviconHref = (theme, title = '') => {
	const colors = THEME_FAVICON_COLORS[theme]
	const svg = `
		<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
			<title>${title}</title>
			<circle cx="32" cy="32" r="30" fill="${colors.outer}"/>
			<path d="M32 32 C32 18, 42 14, 45 10 C49 5, 52 6, 50 12 C48 18, 38 20, 32 32 Z" fill="${colors.bladeA}"/>
			<path d="M32 32 C46 32, 50 42, 54 45 C59 49, 58 52, 52 50 C46 48, 44 38, 32 32 Z" fill="${colors.bladeB}"/>
			<path d="M32 32 C32 46, 22 50, 19 54 C15 59, 12 58, 14 52 C16 46, 26 44, 32 32 Z" fill="${colors.bladeA}"/>
			<path d="M32 32 C18 32, 14 22, 10 19 C5 15, 6 12, 12 14 C18 16, 20 26, 32 32 Z" fill="${colors.bladeB}"/>
			<circle cx="32" cy="32" r="5" fill="${colors.hubOuter}"/>
			<circle cx="32" cy="32" r="3" fill="${colors.hubInner}"/>
			<circle cx="32" cy="32" r="30" fill="none" stroke="${colors.ring}" stroke-width="5" opacity="${colors.ringOpacity}"/>
		</svg>
	`

	return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
