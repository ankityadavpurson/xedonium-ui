import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import Loader from './Loader'
import Select from './Select'
import Slider from './Slider'
import PauseIcon from './icons/Pause'
import PlayIcon from './icons/Play'
import VolumeIcon from './icons/Volume'
import VolumeLowIcon from './icons/VolumeLow'
import VolumeOffIcon from './icons/VolumeOff'

const DEFAULT_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]
const BUFFERING_DELAY = 300 // ms a stall must last before the spinner shows

const format = seconds => {
	if (!Number.isFinite(seconds)) return '0:00'
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = Math.floor(seconds % 60)
	return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Audio player built from the library's own Button, Slider and Select: play / pause, a seek bar with a time popover and
 * a loaded (buffered) band, a spinner while it waits for data, mute with a volume slider (the speaker icon follows the
 * level) and playback speed. `title` and `artist` label the track. `speeds` lists the playback rates offered
 * (1 is normal speed). Extra props go to the <audio> element; pass <source> children for several formats.
 */
const Sound = ({ src, title = 'Audio', artist, speeds = DEFAULT_SPEEDS, className = '', children, ...rest }) => {
	const audioRef = useRef(null)
	const bufferTimer = useRef(null)
	const [playing, setPlaying] = useState(false)
	const [time, setTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [buffered, setBuffered] = useState(0)
	const [buffering, setBuffering] = useState(false)
	const [muted, setMuted] = useState(false)
	const [volume, setVolume] = useState(1)
	const [speed, setSpeed] = useState(1)

	useEffect(() => () => clearTimeout(bufferTimer.current), [])

	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume
	}, [volume])

	useEffect(() => {
		if (audioRef.current) audioRef.current.playbackRate = speed
	}, [speed])

	const startBuffering = () => {
		clearTimeout(bufferTimer.current)
		bufferTimer.current = setTimeout(() => setBuffering(true), BUFFERING_DELAY)
	}
	const stopBuffering = () => {
		clearTimeout(bufferTimer.current)
		setBuffering(false)
	}

	// End (in seconds) of the loaded range that contains the playhead, 0 when nothing there is loaded yet
	const updateBuffered = audio => {
		const ranges = audio.buffered
		let end = 0
		for (let i = 0; i < (ranges?.length ?? 0); i++) {
			if (ranges.start(i) <= audio.currentTime + 0.1 && ranges.end(i) >= audio.currentTime) end = ranges.end(i)
		}
		setBuffered(end)
	}

	const toggle = () => {
		const audio = audioRef.current
		if (audio.paused) audio.play().catch(() => {})
		else audio.pause()
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

	const shownVolume = muted ? 0 : volume

	return (
		<div className={`flex flex-col gap-2 border border-app-border bg-app-card p-3 ${className}`}>
			<audio
				ref={audioRef}
				src={src}
				muted={muted}
				preload="metadata"
				onPlay={() => setPlaying(true)}
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
					setDuration(e.currentTarget.duration)
					e.currentTarget.playbackRate = speed
					updateBuffered(e.currentTarget)
				}}
				{...rest}
			>
				{children}
			</audio>
			<div role="group" aria-label={`${title} player`} className="flex flex-col gap-2">
				<div className="flex items-center gap-3">
					<Button variant="secondary" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle}>
						{playing ? <PauseIcon /> : <PlayIcon />}
					</Button>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-semibold text-app-text">{title}</div>
						{artist && <div className="truncate text-xs text-app-muted">{artist}</div>}
					</div>
					{buffering && <Loader variant="spinner" size="sm" label="Buffering" />}
				</div>
				<div className="flex items-center gap-2">
					<span className="w-10 shrink-0 text-center text-xs tabular-nums text-app-muted">{format(time)}</span>
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
							audioRef.current.currentTime = value
							setTime(value)
						}}
						className="min-w-0 flex-1"
					/>
					<span className="w-10 shrink-0 text-center text-xs tabular-nums text-app-muted">{format(duration)}</span>
				</div>
				<div className="flex flex-wrap items-center gap-x-1">
					<Button variant="flat" aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={muted} onClick={toggleMute}>
						{muted || volume === 0 ? <VolumeOffIcon /> : volume < 0.5 ? <VolumeLowIcon /> : <VolumeIcon />}
					</Button>
					<Slider
						aria-label="Volume"
						min={0}
						max={1}
						step={0.05}
						value={shownVolume}
						showValue={false}
						onChange={changeVolume}
						className="w-24"
					/>
					<span className="flex-1" />
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
				</div>
			</div>
		</div>
	)
}

export default Sound
