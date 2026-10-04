import { useEffect, useRef, useState } from 'react'
import { THEME_FAVICON_COLORS } from '../theme/constants'

const SPIN_SPEED = 450 // degrees per second (360 / 1.2s)

const getActiveTheme = () => {
	if (typeof document === 'undefined') return 'light'
	return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

// Decorative by default; pass `label` when the spinner is the only sign that something is loading
const FanFavicon = ({ size = 64, theme: themeOverride, label }) => {
	const [theme, setTheme] = useState(() => themeOverride || getActiveTheme())
	const fanRef = useRef(null)

	useEffect(() => {
		if (themeOverride) {
			setTheme(themeOverride)
			return undefined
		}

		const root = document.documentElement
		const syncTheme = () => setTheme(getActiveTheme())
		const observer = new MutationObserver(syncTheme)

		syncTheme()
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

		return () => observer.disconnect()
	}, [themeOverride])

	useEffect(() => {
		let angle = 0
		let lastTime = null
		let raf

		const tick = now => {
			const delta = lastTime === null ? 0 : (now - lastTime) / 1000
			lastTime = now
			angle = (angle + SPIN_SPEED * delta) % 360
			fanRef.current?.setAttribute('transform', `rotate(${angle} 32 32)`)
			raf = requestAnimationFrame(tick)
		}

		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [])

	const colors = THEME_FAVICON_COLORS[theme] || THEME_FAVICON_COLORS.light

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			focusable="false"
			{...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
		>
			<circle cx="32" cy="32" r="30" fill={colors.outer} />

			<g ref={fanRef}>
				<path d="M32 32 C32 18, 42 14, 45 10 C49 5, 52 6, 50 12 C48 18, 38 20, 32 32 Z" fill={colors.bladeA} />
				<path d="M32 32 C46 32, 50 42, 54 45 C59 49, 58 52, 52 50 C46 48, 44 38, 32 32 Z" fill={colors.bladeB} />
				<path d="M32 32 C32 46, 22 50, 19 54 C15 59, 12 58, 14 52 C16 46, 26 44, 32 32 Z" fill={colors.bladeA} />
				<path d="M32 32 C18 32, 14 22, 10 19 C5 15, 6 12, 12 14 C18 16, 20 26, 32 32 Z" fill={colors.bladeB} />
			</g>

			<circle cx="32" cy="32" r="5" fill={colors.hubOuter} />
			<circle cx="32" cy="32" r="3" fill={colors.hubInner} />

			<circle cx="32" cy="32" r="30" fill="none" stroke={colors.ring} strokeWidth="5" opacity="0.85" />
		</svg>
	)
}

export default FanFavicon
