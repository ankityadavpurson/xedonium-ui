import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import Loader from './Loader'
import FullscreenExitIcon from './icons/FullscreenExit'
import FullscreenIcon from './icons/Fullscreen'
import PauseIcon from './icons/Pause'
import PlayIcon from './icons/Play'
import VolumeIcon from './icons/Volume'
import VolumeLowIcon from './icons/VolumeLow'
import VolumeOffIcon from './icons/VolumeOff'
import Select from './Select'
import Slider from './Slider'

const format = seconds => {
	if (!Number.isFinite(seconds)) return '0:00'
	const m = Math.floor(seconds / 60)
	const s = Math.floor(seconds % 60)
	return `${m}:${String(s).padStart(2, '0')}`
}

const BUFFERING_DELAY = 300 // ms a stall must last before the spinner shows

const DEFAULT_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const currentFullscreen = () => document.fullscreenElement ?? document.webkitFullscreenElement

/**
 * Video player whose controls are built from the library's own Button, Slider and Select: play / pause, a seek bar
 * with a time popover and a loaded (buffered) band, a spinner while it waits for data, mute with a vertical volume
 * slider (the speaker icon follows the level), playback speed, quality and fullscreen.
 * `speeds` lists the playback rates offered (1 is normal speed). For several resolutions pass `sources`, e.g.
 * `[{ label: '1080p', src: '/hd.mp4' }, { label: '4K', src: '/uhd.mp4' }]`, instead of `src`: a quality menu appears
 * (starting at `defaultQuality`, else the first one) and switching keeps the position and whether it was playing.
 * Extra props go to the <video> element.
 * The controls float over the bottom of the video and fade out after `hideDelay` ms without pointer, touch or keyboard
 * activity while it plays (they stay while paused, hovered or focused; `autoHide={false}` keeps them always visible).
 * The controls wrap onto a second row on narrow screens so none of them (fullscreen included) is cut off. Fullscreen
 * uses the player element, with the vendor-prefixed and iOS video-only fallbacks where the standard API is missing.
 */
const Video = ({
	src,
	sources,
	defaultQuality,
	poster,
	title = 'Video',
	ratio = 'video',
	speeds = DEFAULT_SPEEDS,
	autoHide = true,
	hideDelay = 2500,
	className = '',
	children,
	...rest
}) => {
	const videoRef = useRef(null)
	const wrapRef = useRef(null)
	const [playing, setPlaying] = useState(false)
	const [time, setTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [buffered, setBuffered] = useState(0)
	const [buffering, setBuffering] = useState(false)
	const bufferTimer = useRef(null)
	const [muted, setMuted] = useState(false)
	const [volume, setVolume] = useState(1)
	const [speed, setSpeed] = useState(1)
	const [quality, setQuality] = useState(
		() => sources?.find(source => source.label === defaultQuality)?.label ?? sources?.[0]?.label
	)
	const resume = useRef(null) // where to continue after a quality switch reloads the video
	const [fullscreen, setFullscreen] = useState(false)
	const [awake, setAwake] = useState(true)
	const controlsRef = useRef(null)
	const hideTimer = useRef(null)
	const overControls = useRef(false)

	useEffect(() => {
		const onChange = () => setFullscreen(currentFullscreen() === wrapRef.current)
		document.addEventListener('fullscreenchange', onChange)
		document.addEventListener('webkitfullscreenchange', onChange)
		return () => {
			document.removeEventListener('fullscreenchange', onChange)
			document.removeEventListener('webkitfullscreenchange', onChange)
		}
	}, [])

	useEffect(() => () => clearTimeout(hideTimer.current), [])
	useEffect(() => () => clearTimeout(bufferTimer.current), [])

	// Playback stalled for lack of data: show the spinner only if it lasts, so short hiccups do not flash it
	const startBuffering = () => {
		clearTimeout(bufferTimer.current)
		bufferTimer.current = setTimeout(() => setBuffering(true), BUFFERING_DELAY)
	}
	const stopBuffering = () => {
		clearTimeout(bufferTimer.current)
		setBuffering(false)
	}

	// Any activity shows the controls and restarts the countdown; they stay while hovered or holding focus
	const wake = () => {
		setAwake(true)
		clearTimeout(hideTimer.current)
		if (!autoHide) return
		hideTimer.current = setTimeout(() => {
			if (!overControls.current && !controlsRef.current?.contains(document.activeElement)) setAwake(false)
		}, hideDelay)
	}
	const showControls = !autoHide || awake || !playing

	useEffect(() => {
		if (videoRef.current) videoRef.current.volume = volume
	}, [volume])

	useEffect(() => {
		if (videoRef.current) videoRef.current.playbackRate = speed
	}, [speed])

	// End (in seconds) of the loaded range that contains the playhead, 0 when nothing there is loaded yet
	const updateBuffered = video => {
		const ranges = video.buffered
		let end = 0
		for (let i = 0; i < (ranges?.length ?? 0); i++) {
			if (ranges.start(i) <= video.currentTime + 0.1 && ranges.end(i) >= video.currentTime) end = ranges.end(i)
		}
		setBuffered(end)
	}

	const current = sources?.find(source => source.label === quality)?.src ?? sources?.[0]?.src ?? src

	// Switching resolution reloads the media: remember where we were, then restore it once the new one has metadata
	const changeQuality = label => {
		const video = videoRef.current
		resume.current = { time: video.currentTime, play: !video.paused }
		setQuality(label)
		setPlaying(false)
		setBuffering(true)
	}

	const toggle = () => {
		const video = videoRef.current
		if (video.paused) video.play().catch(() => {})
		else video.pause()
	}

	const toggleFullscreen = () => {
		if (currentFullscreen()) {
			;(document.exitFullscreen ?? document.webkitExitFullscreen)?.call(document)
			return
		}
		const wrap = wrapRef.current
		const request = wrap?.requestFullscreen ?? wrap?.webkitRequestFullscreen
		// iPhone Safari can only fullscreen the <video> itself
		if (request) request.call(wrap)
		else videoRef.current?.webkitEnterFullscreen?.()
	}

	const toggleMute = () => {
		// unmuting from a slider dragged to zero would stay silent, so restore the volume too
		if (muted && volume === 0) setVolume(1)
		setMuted(m => !m)
	}

	const changeVolume = value => {
		setVolume(value)
		setMuted(value === 0)
	}

	return (
		<div
			ref={wrapRef}
			data-controls={showControls ? 'visible' : 'hidden'}
			onPointerMove={wake}
			onPointerDown={wake}
			onFocus={wake}
			onKeyDown={wake}
			className={`relative flex flex-col border border-app-border bg-black ${fullscreen ? 'overflow-hidden' : ''} ${
				!showControls ? 'cursor-none' : ''
			} ${className}`}
		>
			<video
				ref={videoRef}
				src={current}
				poster={poster}
				title={title}
				muted={muted}
				playsInline
				preload="metadata"
				className={`block w-full bg-black ${
					fullscreen ? 'min-h-0 flex-1 object-contain' : ratio === 'video' ? 'aspect-video' : ''
				}`}
				onClick={toggle}
				onPlay={() => {
					setPlaying(true)
					wake()
				}}
				onPause={() => {
					setPlaying(false)
					stopBuffering()
				}}
				onEnded={() => {
					setPlaying(false)
					stopBuffering()
				}}
				onWaiting={startBuffering}
				onPlaying={stopBuffering}
				onCanPlay={stopBuffering}
				onError={stopBuffering}
				onTimeUpdate={e => {
					setTime(e.currentTarget.currentTime)
					updateBuffered(e.currentTarget)
				}}
				onProgress={e => updateBuffered(e.currentTarget)}
				onSeeked={e => updateBuffered(e.currentTarget)}
				onLoadedMetadata={e => {
					const video = e.currentTarget
					setDuration(video.duration)
					video.playbackRate = speed
					if (resume.current) {
						const { time: at, play } = resume.current
						resume.current = null
						video.currentTime = at
						setTime(at)
						if (play) video.play().catch(() => {})
					}
					updateBuffered(video)
				}}
				{...rest}
			>
				{children}
			</video>
			{buffering && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center [--color-app-border:110_110_110] [--color-app-strong:255_255_255]">
					<Loader variant="spinner" size="lg" label="Buffering" />
				</div>
			)}
			<div
				ref={controlsRef}
				role="group"
				aria-label={`${title} controls`}
				onPointerEnter={() => {
					overControls.current = true
				}}
				onPointerLeave={() => {
					overControls.current = false
					wake()
				}}
				className={`absolute inset-x-0 bottom-0 flex flex-col [--color-app-bg:0_0_0] [--color-app-card:55_55_55] [--color-app-border:110_110_110] [--color-app-text:255_255_255] [--color-app-muted:200_200_200] [--color-app-strong:255_255_255] bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2 pb-1 pt-8 transition-opacity duration-200 ${
					showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
				}`}
			>
				<div className="flex items-center gap-1">
					<span className="w-10 shrink-0 text-center text-xs tabular-nums text-white/80">{format(time)}</span>
					<Slider
						aria-label="Seek"
						min={0}
						max={duration || 0}
						step="any"
						value={Math.min(time, duration || 0)}
						buffered={buffered}
						showValue={false}
						valueLabel={format}
						onChange={value => {
							videoRef.current.currentTime = value
							setTime(value)
						}}
						className="min-w-0 flex-1"
					/>
					<span className="w-10 shrink-0 text-center text-xs tabular-nums text-white/80">{format(duration)}</span>
				</div>
				<div className="flex flex-wrap items-center gap-x-1">
					<Button
						variant="flat"
						tooltip={playing ? 'Pause' : 'Play'}
						tooltipPlacement="top"
						aria-label={playing ? 'Pause' : 'Play'}
						onClick={toggle}
					>
						{playing ? <PauseIcon /> : <PlayIcon />}
					</Button>
					<div className="group relative flex">
						<Button variant="flat" aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={muted} onClick={toggleMute}>
							{muted || volume === 0 ? <VolumeOffIcon /> : volume < 0.5 ? <VolumeLowIcon /> : <VolumeIcon />}
						</Button>
						{/* Opens upward on hover or keyboard focus, like YouTube. It clears the seek bar above the button, and the
						    transparent padding below it keeps the pointer inside the group on the way up. */}
						<div className="absolute bottom-full left-1/2 hidden -translate-x-1/2 pb-8 group-focus-within:flex group-hover:flex">
							<div className="flex px-2 py-1 drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]">
								<Slider
									aria-label="Volume"
									orientation="vertical"
									min={0}
									max={1}
									step={0.05}
									value={muted ? 0 : volume}
									showValue={false}
									onChange={changeVolume}
								/>
							</div>
						</div>
					</div>
					<span className="flex-1" />
					{sources?.length > 1 && (
						<div className="w-24">
							<Select
								aria-label="Quality"
								value={quality}
								onChange={changeQuality}
								options={sources.map(source => ({ value: source.label, label: source.label }))}
								variant="flat"
								className="min-h-9 !py-1 text-xs font-semibold tracking-widest"
							/>
						</div>
					)}
					<div className="w-24">
						<Select
							aria-label="Playback speed"
							value={String(speed)}
							onChange={value => setSpeed(Number(value))}
							options={speeds.map(rate => ({ value: String(rate), label: `${rate}x` }))}
							variant="flat"
							className="min-h-9 !py-1 text-xs font-semibold tracking-widest"
						/>
					</div>
					<Button
						variant="flat"
						tooltip={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
						tooltipPlacement="top-end"
						aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
						onClick={toggleFullscreen}
					>
						{fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Video
