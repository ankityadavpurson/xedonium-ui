import { useEffect, useRef, useState } from 'react'

const format = seconds => {
	if (!Number.isFinite(seconds)) return '0:00'
	const m = Math.floor(seconds / 60)
	const s = Math.floor(seconds % 60)
	return `${m}:${String(s).padStart(2, '0')}`
}

const controlClass =
	'px-2 py-1 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:bg-app-bg focus-visible:outline-offset-[-2px]'

/** Video player with themed controls (play, seek, time, mute, fullscreen). Extra props go to the <video> element. */
const Video = ({ src, poster, title = 'Video', ratio = 'video', className = '', children, ...rest }) => {
	const videoRef = useRef(null)
	const wrapRef = useRef(null)
	const [playing, setPlaying] = useState(false)
	const [time, setTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [muted, setMuted] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)

	useEffect(() => {
		const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current)
		document.addEventListener('fullscreenchange', onChange)
		return () => document.removeEventListener('fullscreenchange', onChange)
	}, [])

	const toggle = () => {
		const video = videoRef.current
		if (video.paused) video.play().catch(() => {})
		else video.pause()
	}
	const toggleFullscreen = () => {
		if (document.fullscreenElement) document.exitFullscreen()
		else wrapRef.current?.requestFullscreen?.()
	}

	return (
		<div ref={wrapRef} className={`flex flex-col border border-app-border bg-app-card ${className}`}>
			<video
				ref={videoRef}
				src={src}
				poster={poster}
				title={title}
				muted={muted}
				playsInline
				preload="metadata"
				className={`block w-full bg-black ${ratio === 'video' ? 'aspect-video' : ''} ${fullscreen ? 'flex-1' : ''}`}
				onClick={toggle}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
				onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
				{...rest}
			>
				{children}
			</video>
			<div
				role="group"
				aria-label={`${title} controls`}
				className="flex items-center gap-1 border-t border-app-border px-1 py-1"
			>
				<button type="button" className={controlClass} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
					{playing ? 'Pause' : 'Play'}
				</button>
				<span className="w-10 text-center text-xs tabular-nums text-app-muted">{format(time)}</span>
				<input
					type="range"
					aria-label="Seek"
					min={0}
					max={duration || 0}
					step="any"
					value={Math.min(time, duration || 0)}
					onChange={e => {
						videoRef.current.currentTime = Number(e.target.value)
						setTime(Number(e.target.value))
					}}
					className="min-w-0 flex-1 cursor-pointer accent-[rgb(var(--color-app-strong))]"
				/>
				<span className="w-10 text-center text-xs tabular-nums text-app-muted">{format(duration)}</span>
				<button type="button" className={controlClass} aria-pressed={muted} onClick={() => setMuted(m => !m)}>
					{muted ? 'Unmute' : 'Mute'}
				</button>
				<button type="button" className={controlClass} onClick={toggleFullscreen}>
					{fullscreen ? 'Exit' : 'Full'}
				</button>
			</div>
		</div>
	)
}

export default Video
