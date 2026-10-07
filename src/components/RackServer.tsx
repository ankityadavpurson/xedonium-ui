import { useEffect, useRef } from 'react'

const styles = `
  @keyframes rs-blink {
    0%,45%  { fill:rgb(var(--color-app-card)); filter:drop-shadow(0 0 0 transparent); }
    50%,55% { fill:#00e676; filter:drop-shadow(0 0 6px #00e676); }
    60%,100%{ fill:rgb(var(--color-app-card)); filter:drop-shadow(0 0 0 transparent); }
  }
  @keyframes rs-blink-b {
    0%,40%  { fill:rgb(var(--color-app-card)); }
    50%     { fill:rgb(var(--color-app-strong)); filter:drop-shadow(0 0 5px rgb(var(--color-app-strong))); }
    60%,100%{ fill:rgb(var(--color-app-card)); }
  }
  @keyframes rs-glow-pulse {
    0%,100% { opacity:0.12; }
    50%     { opacity:0.28; }
  }

  .rs-chassis  { fill:rgb(var(--color-app-card)); stroke:rgb(var(--color-app-border)); stroke-width:1.5; }
  .rs-rack     { fill:rgb(var(--color-app-bg)); stroke:rgb(var(--color-app-border)); stroke-width:1; }
  .rs-slotline { fill:rgb(var(--color-app-border)); opacity:0.35; }

  .rs-led-g  { animation: rs-blink 2s infinite ease-in-out; }
  .rs-lg1    { animation-delay:0.0s; }
  .rs-lg2    { animation-delay:0.4s; }
  .rs-lg3    { animation-delay:0.8s; }
  .rs-lg4    { animation-delay:1.2s; }
  .rs-led-b  { animation: rs-blink-b 2.5s infinite ease-in-out; }
  .rs-lb1    { animation-delay:0.2s; }
  .rs-lb2    { animation-delay:0.9s; }

  .rs-fan-blade { fill:rgb(var(--color-app-border)); }
  .rs-fan-hub   { fill:rgb(var(--color-app-soft)); }
  .rs-fan-ring  { fill:none; stroke:rgb(var(--color-app-border)); stroke-width:1.5; }
  .rs-glow      { animation: rs-glow-pulse 3s infinite ease-in-out; }
`

const TOP_SPEED = 720 // degrees per second at full speed
const BOT_SPEED = 540 // degrees per second at full speed (slightly slower)

const RackServer = () => {
	const fanTopRef = useRef<SVGGElement>(null)
	const fanBotRef = useRef<SVGGElement>(null)

	useEffect(() => {
		if (!document.getElementById('rack-server-styles')) {
			const tag = document.createElement('style')
			tag.id = 'rack-server-styles'
			tag.textContent = styles
			document.head.appendChild(tag)
		}

		let topAngle = 0
		let botAngle = 0
		let raf = 0
		let lastTime: number | null = null
		const startTime = performance.now()

		const tick = (now: number) => {
			const delta = lastTime === null ? 0 : (now - lastTime) / 1000
			lastTime = now
			const elapsed = (now - startTime) / 1000

			// Cubic ease-in ramp: top fan reaches full speed at 3s, bottom at 5s
			const topT = Math.min(elapsed / 3, 1)
			const botT = Math.min(elapsed / 5, 1)
			topAngle = (topAngle + topT * topT * topT * TOP_SPEED * delta) % 360
			botAngle = (botAngle + botT * botT * botT * BOT_SPEED * delta) % 360

			// Use SVG transform attribute — bypasses CSS animation-duration overrides
			fanTopRef.current?.setAttribute('transform', `rotate(${topAngle} 222 100)`)
			fanBotRef.current?.setAttribute('transform', `rotate(${botAngle} 222 163)`)

			raf = requestAnimationFrame(tick)
		}

		raf = requestAnimationFrame(tick)

		return () => {
			cancelAnimationFrame(raf)
		}
	}, [])

	return (
		<svg
			width="300"
			height="300"
			viewBox="0 0 300 300"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<defs>
				<linearGradient id="rs-sg" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="rgb(var(--color-app-strong))" stopOpacity="0" />
					<stop offset="50%" stopColor="rgb(var(--color-app-strong))" stopOpacity="0.3" />
					<stop offset="100%" stopColor="rgb(var(--color-app-strong))" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="rs-pg" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#00e676" />
					<stop offset="100%" stopColor="rgb(var(--color-app-strong))" />
				</linearGradient>
				<radialGradient id="rs-ag" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="rgb(var(--color-app-strong))" stopOpacity="0.15" />
					<stop offset="100%" stopColor="rgb(var(--color-app-strong))" stopOpacity="0" />
				</radialGradient>
				<clipPath id="rs-rc">
					<rect x="30" y="55" width="240" height="190" />
				</clipPath>
			</defs>

			{/* Ambient glow */}
			<ellipse cx="150" cy="150" rx="130" ry="110" fill="url(#rs-ag)" className="rs-glow" />

			{/* Rack chassis */}
			<rect x="30" y="50" width="240" height="190" className="rs-chassis" />
			<circle
				cx="40"
				cy="60"
				r="3"
				fill="rgb(var(--color-app-bg))"
				stroke="rgb(var(--color-app-border))"
				strokeWidth="1"
			/>
			<circle
				cx="260"
				cy="60"
				r="3"
				fill="rgb(var(--color-app-bg))"
				stroke="rgb(var(--color-app-border))"
				strokeWidth="1"
			/>
			<circle
				cx="40"
				cy="230"
				r="3"
				fill="rgb(var(--color-app-bg))"
				stroke="rgb(var(--color-app-border))"
				strokeWidth="1"
			/>
			<circle
				cx="260"
				cy="230"
				r="3"
				fill="rgb(var(--color-app-bg))"
				stroke="rgb(var(--color-app-border))"
				strokeWidth="1"
			/>

			{/* Unit 1 */}
			<rect x="42" y="72" width="216" height="56" className="rs-rack" />
			<rect x="52" y="79" width="130" height="8" className="rs-slotline" />
			<rect x="52" y="91" width="130" height="8" className="rs-slotline" />
			<rect x="52" y="103" width="130" height="8" className="rs-slotline" />
			<rect x="52" y="115" width="80" height="8" className="rs-slotline" />
			<circle cx="60" cy="83" r="2.5" className="rs-led-g rs-lg1" />
			<circle cx="60" cy="95" r="2.5" className="rs-led-g rs-lg2" />
			<circle cx="60" cy="107" r="2.5" className="rs-led-b rs-lb1" />
			<circle cx="60" cy="119" r="2.5" className="rs-led-g rs-lg3" />
			<circle cx="222" cy="100" r="20" fill="rgb(var(--color-app-bg))" />
			<g ref={fanTopRef}>
				<path d="M222 80 Q230 100 222 120 Q214 100 222 80" className="rs-fan-blade" />
				<path d="M202 100 Q222 108 242 100 Q222 92 202 100" className="rs-fan-blade" />
				<circle cx="222" cy="100" r="2.5" className="rs-fan-hub" />
			</g>
			<circle cx="222" cy="100" r="20" className="rs-fan-ring" />

			{/* Unit 2 */}
			<rect x="42" y="136" width="216" height="56" className="rs-rack" />
			<rect x="52" y="143" width="130" height="8" className="rs-slotline" />
			<rect x="52" y="155" width="130" height="8" className="rs-slotline" />
			<rect x="52" y="167" width="130" height="8" className="rs-slotline" />
			<rect x="52" y="179" width="80" height="8" className="rs-slotline" />
			<circle cx="60" cy="147" r="2.5" className="rs-led-g rs-lg2" />
			<circle cx="60" cy="159" r="2.5" className="rs-led-b rs-lb2" />
			<circle cx="60" cy="171" r="2.5" className="rs-led-g rs-lg4" />
			<circle cx="60" cy="183" r="2.5" className="rs-led-g rs-lg1" />
			<circle cx="222" cy="163" r="20" fill="rgb(var(--color-app-bg))" />
			<g ref={fanBotRef}>
				<path d="M222 143 Q230 163 222 183 Q214 163 222 143" className="rs-fan-blade" />
				<path d="M202 163 Q222 171 242 163 Q222 155 202 163" className="rs-fan-blade" />
				<circle cx="222" cy="163" r="2.5" className="rs-fan-hub" />
			</g>
			<circle cx="222" cy="163" r="20" className="rs-fan-ring" />
		</svg>
	)
}

export default RackServer
