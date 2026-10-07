import { act, fireEvent, render, screen, within } from '@testing-library/react'
import Carousel from '../../src/components/Carousel'
import CommandPalette from '../../src/components/CommandPalette'
import DataGrid from '../../src/components/DataGrid'
import NotificationCenter from '../../src/components/NotificationCenter'
import RackServer from '../../src/components/RackServer'
import Sound from '../../src/components/Sound'
import Video from '../../src/components/Video'

describe('Video', () => {
	const setup = (props = {}) => {
		const utils = render(<Video src="/v.mp4" title="Clip" {...props} />)
		const video = utils.container.querySelector('video')
		Object.defineProperty(video, 'paused', { value: true, writable: true, configurable: true })
		video.play = vi.fn().mockImplementation(() => {
			video.paused = false
			return Promise.resolve()
		})
		video.pause = vi.fn().mockImplementation(() => {
			video.paused = true
		})
		return { video, ...utils }
	}

	it('floats the controls, hides them after inactivity while playing and wakes them on activity', () => {
		vi.useFakeTimers()
		const { video, container } = setup({ hideDelay: 1000 })
		const wrap = container.firstChild
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		// paused: stays visible however long we wait
		act(() => vi.advanceTimersByTime(5000))
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		fireEvent.play(video)
		act(() => vi.advanceTimersByTime(999))
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		act(() => vi.advanceTimersByTime(2))
		expect(wrap).toHaveAttribute('data-controls', 'hidden')
		expect(screen.getByRole('group', { name: 'Clip controls' })).toHaveClass('opacity-0', 'pointer-events-none')
		fireEvent.pointerMove(wrap)
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		act(() => vi.advanceTimersByTime(1001))
		expect(wrap).toHaveAttribute('data-controls', 'hidden')
		fireEvent.pointerDown(wrap)
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		act(() => vi.advanceTimersByTime(1001))
		fireEvent.keyDown(wrap, { key: 'a' })
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		// pausing brings them back
		act(() => vi.advanceTimersByTime(1001))
		expect(wrap).toHaveAttribute('data-controls', 'hidden')
		fireEvent.pause(video)
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		vi.useRealTimers()
	})

	it('keeps the controls while the pointer is over them or focus is inside, and when autoHide is off', () => {
		vi.useFakeTimers()
		const { video, container, rerender } = setup({ hideDelay: 1000 })
		const wrap = container.firstChild
		const group = screen.getByRole('group', { name: 'Clip controls' })
		fireEvent.play(video)
		fireEvent.pointerEnter(group)
		act(() => vi.advanceTimersByTime(3000))
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		fireEvent.pointerLeave(group)
		act(() => vi.advanceTimersByTime(1001))
		expect(wrap).toHaveAttribute('data-controls', 'hidden')
		const full = screen.getByRole('button', { name: 'Fullscreen' })
		act(() => full.focus())
		act(() => vi.advanceTimersByTime(3000))
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		act(() => full.blur())
		rerender(<Video src="/v.mp4" title="Clip" autoHide={false} />)
		fireEvent.play(video)
		act(() => vi.advanceTimersByTime(10000))
		expect(wrap).toHaveAttribute('data-controls', 'visible')
		vi.useRealTimers()
	})

	it('shows the controls again when playback ends', () => {
		vi.useFakeTimers()
		const { video, container } = setup({ hideDelay: 500 })
		fireEvent.play(video)
		act(() => vi.advanceTimersByTime(600))
		expect(container.firstChild).toHaveAttribute('data-controls', 'hidden')
		fireEvent.ended(video)
		expect(container.firstChild).toHaveAttribute('data-controls', 'visible')
		vi.useRealTimers()
	})

	it('plays and pauses via button and clicking the video', async () => {
		const { video } = setup()
		fireEvent.click(screen.getByRole('button', { name: 'Play' }))
		expect(video.play).toHaveBeenCalled()
		fireEvent.play(video)
		expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
		fireEvent.click(video)
		expect(video.pause).toHaveBeenCalled()
		fireEvent.pause(video)
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('swallows play() rejections', async () => {
		const { video } = setup()
		video.play = vi.fn().mockRejectedValue(new Error('blocked'))
		fireEvent.click(video)
		await Promise.resolve()
		expect(video.play).toHaveBeenCalled()
	})

	it('shows time and duration and seeks', () => {
		const { video } = setup()
		Object.defineProperty(video, 'duration', { value: 125, configurable: true })
		Object.defineProperty(video, 'currentTime', { value: 65, writable: true, configurable: true })
		fireEvent.loadedMetadata(video)
		fireEvent.timeUpdate(video)
		expect(screen.getByText('2:05')).toBeInTheDocument()
		expect(screen.getByText('1:05')).toBeInTheDocument()
		fireEvent.change(screen.getByLabelText('Seek'), { target: { value: '90' } })
		expect(video.currentTime).toBe(90)
		expect(screen.getByText('1:30')).toBeInTheDocument()
	})

	it('formats non-finite durations as 0:00', () => {
		const { video } = setup()
		Object.defineProperty(video, 'duration', { value: Infinity, configurable: true })
		fireEvent.loadedMetadata(video)
		expect(screen.getAllByText('0:00')).toHaveLength(2)
	})

	it('sets the volume, unmutes with the slider and restores volume after muting at zero', () => {
		const { video } = setup()
		const slider = screen.getByLabelText('Volume')
		fireEvent.change(slider, { target: { value: '0.4' } })
		expect(video.volume).toBeCloseTo(0.4)
		fireEvent.click(screen.getByRole('button', { name: 'Mute' }))
		expect(slider).toHaveValue('0')
		fireEvent.change(slider, { target: { value: '0.6' } })
		expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument()
		fireEvent.change(slider, { target: { value: '0' } })
		expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Unmute' }))
		expect(video.volume).toBe(1)
		expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument()
	})

	it('has a vertical volume slider and a speaker icon that follows the level', () => {
		setup()
		const slider = screen.getByLabelText('Volume')
		expect(slider).toHaveAttribute('aria-orientation', 'vertical')
		expect(screen.queryByText(/%$/)).toBeNull()
		const mute = () => screen.getByRole('button', { name: /mute/i })
		const paths = () => mute().querySelectorAll('path').length
		expect(paths()).toBe(3) // high: speaker + two waves
		fireEvent.change(slider, { target: { value: '0.3' } })
		expect(paths()).toBe(2) // low: speaker + one wave
		fireEvent.change(slider, { target: { value: '0.5' } })
		expect(paths()).toBe(3)
		fireEvent.click(mute())
		expect(mute().querySelector('path[d="M23 9l-6 6"]')).toBeTruthy() // muted: speaker with a cross
		expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument()
		expect(slider).toHaveValue('0')
	})

	describe('quality', () => {
		const sources = [
			{ label: '1080p', src: '/hd.mp4' },
			{ label: '4K', src: '/uhd.mp4' },
		]

		it('has no quality menu for a single source', () => {
			setup()
			expect(screen.queryByRole('combobox', { name: 'Quality' })).toBeNull()
			setup({ src: undefined, sources: [sources[0]] })
			expect(screen.queryAllByRole('combobox', { name: 'Quality' })).toHaveLength(0)
		})

		it('starts at the default quality, falling back to the first source', () => {
			const { video, rerender } = setup({ src: undefined, sources })
			expect(video.getAttribute('src')).toBe('/hd.mp4')
			expect(screen.getByRole('combobox', { name: 'Quality' })).toHaveTextContent('1080p')
			rerender(<Video sources={sources} defaultQuality="4K" title="Clip" />)
		})

		it('honours defaultQuality', () => {
			const { video } = setup({ src: undefined, sources, defaultQuality: '4K' })
			expect(video.getAttribute('src')).toBe('/uhd.mp4')
		})

		it('switches source, then resumes the position and playback once the new one loads', () => {
			const { video } = setup({ src: undefined, sources })
			Object.defineProperty(video, 'currentTime', { value: 42, writable: true, configurable: true })
			fireEvent.play(video)
			video.paused = false
			fireEvent.click(screen.getByRole('combobox', { name: 'Quality' }))
			expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['1080p', '4K'])
			fireEvent.click(screen.getByRole('option', { name: '4K' }))
			expect(video.getAttribute('src')).toBe('/uhd.mp4')
			expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
			video.currentTime = 0
			video.paused = true
			video.play.mockClear()
			fireEvent.loadedMetadata(video)
			expect(video.currentTime).toBe(42)
			expect(video.play).toHaveBeenCalledTimes(1)
			// later loads do not jump or play again
			video.currentTime = 7
			fireEvent.loadedMetadata(video)
			expect(video.currentTime).toBe(7)
			expect(video.play).toHaveBeenCalledTimes(1)
		})

		it('keeps a paused video paused after switching', () => {
			const { video } = setup({ src: undefined, sources })
			Object.defineProperty(video, 'currentTime', { value: 5, writable: true, configurable: true })
			fireEvent.click(screen.getByRole('combobox', { name: 'Quality' }))
			fireEvent.click(screen.getByRole('option', { name: '4K' }))
			video.play.mockClear()
			fireEvent.loadedMetadata(video)
			expect(video.currentTime).toBe(5)
			expect(video.play).not.toHaveBeenCalled()
		})

		it('swallows a blocked resume', async () => {
			const { video } = setup({ src: undefined, sources })
			video.paused = false
			fireEvent.click(screen.getByRole('combobox', { name: 'Quality' }))
			fireEvent.click(screen.getByRole('option', { name: '4K' }))
			video.play = vi.fn().mockRejectedValue(new Error('blocked'))
			fireEvent.loadedMetadata(video)
			await Promise.resolve()
			expect(video.play).toHaveBeenCalled()
		})
	})

	it('shows a spinner when playback stalls and hides it when it resumes, pauses or fails', () => {
		vi.useFakeTimers()
		const { video } = setup()
		const spinner = () => screen.queryByRole('status')
		expect(spinner()).toBeNull()
		fireEvent.waiting(video)
		act(() => vi.advanceTimersByTime(299))
		expect(spinner()).toBeNull() // short stalls never flash the spinner
		act(() => vi.advanceTimersByTime(2))
		expect(spinner()).toHaveTextContent('Buffering')
		fireEvent.playing(video)
		expect(spinner()).toBeNull()
		for (const hide of [fireEvent.canPlay, fireEvent.pause, fireEvent.ended, fireEvent.error]) {
			fireEvent.waiting(video)
			act(() => vi.advanceTimersByTime(400))
			expect(spinner()).not.toBeNull()
			hide(video)
			expect(spinner()).toBeNull()
		}
		// a stall that ends before the delay never shows
		fireEvent.waiting(video)
		act(() => vi.advanceTimersByTime(100))
		fireEvent.playing(video)
		act(() => vi.advanceTimersByTime(1000))
		expect(spinner()).toBeNull()
		vi.useRealTimers()
	})

	it('shows how much is loaded on the seek bar', () => {
		const { video } = setup()
		Object.defineProperty(video, 'duration', { value: 100, configurable: true })
		Object.defineProperty(video, 'currentTime', { value: 10, writable: true, configurable: true })
		const ranges = [
			[0, 40],
			[70, 90],
		]
		Object.defineProperty(video, 'buffered', {
			value: { length: ranges.length, start: i => ranges[i][0], end: i => ranges[i][1] },
			configurable: true,
		})
		fireEvent.loadedMetadata(video)
		const seek = screen.getByLabelText('Seek')
		expect(seek.style.getPropertyValue('--xd-buffer')).toBe('40%')
		// the playhead moves into the second range, then nothing around it is loaded
		video.currentTime = 80
		fireEvent.progress(video)
		expect(seek.style.getPropertyValue('--xd-buffer')).toBe('90%')
		video.currentTime = 50
		fireEvent.seeked(video)
		fireEvent.timeUpdate(video)
		expect(seek.style.getPropertyValue('--xd-fill')).toBe('50%')
		expect(seek.style.getPropertyValue('--xd-buffer')).toBe('50%')
		video.currentTime = 20
		fireEvent.timeUpdate(video)
		expect(seek.style.getPropertyValue('--xd-buffer')).toBe('40%')
	})

	it('shows the time in a popover while scrubbing', () => {
		const { video } = setup()
		Object.defineProperty(video, 'duration', { value: 125, configurable: true })
		Object.defineProperty(video, 'currentTime', { value: 65, writable: true, configurable: true })
		fireEvent.loadedMetadata(video)
		fireEvent.timeUpdate(video)
		const seek = screen.getByLabelText('Seek')
		fireEvent.pointerDown(seek)
		expect(document.querySelector('.pointer-events-none.border')).toHaveTextContent('1:05')
		fireEvent.change(seek, { target: { value: '90' } })
		expect(document.querySelector('.pointer-events-none.border')).toHaveTextContent('1:30')
		fireEvent.pointerUp(window)
	})

	it('changes the playback speed and keeps it when new media loads', () => {
		const { video, rerender } = setup()
		const speed = screen.getByRole('combobox', { name: 'Playback speed' })
		expect(speed).toHaveTextContent('1x')
		fireEvent.click(speed)
		expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
			'0.5x',
			'0.75x',
			'1x',
			'1.25x',
			'1.5x',
			'2x',
		])
		fireEvent.click(screen.getByRole('option', { name: '1.5x' }))
		expect(video.playbackRate).toBe(1.5)
		video.playbackRate = 1
		fireEvent.loadedMetadata(video)
		expect(video.playbackRate).toBe(1.5)
		rerender(<Video src="/v.mp4" speeds={[1, 3]} />)
		fireEvent.click(screen.getByRole('combobox', { name: 'Playback speed' }))
		expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['1x', '3x'])
	})

	it('toggles mute', () => {
		setup()
		fireEvent.click(screen.getByRole('button', { name: 'Mute' }))
		expect(screen.getByRole('button', { name: 'Unmute' })).toHaveAttribute('aria-pressed', 'true')
		fireEvent.click(screen.getByRole('button', { name: 'Unmute' }))
		expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument()
	})

	it('enters and leaves fullscreen', () => {
		const { container } = setup({ ratio: 'none', className: 'k' })
		const wrap = container.firstChild
		wrap.requestFullscreen = vi.fn()
		document.exitFullscreen = vi.fn()
		fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }))
		expect(wrap.requestFullscreen).toHaveBeenCalled()
		Object.defineProperty(document, 'fullscreenElement', { value: wrap, configurable: true })
		fireEvent(document, new Event('fullscreenchange'))
		expect(screen.getByRole('button', { name: 'Exit fullscreen' })).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Exit fullscreen' }))
		expect(document.exitFullscreen).toHaveBeenCalled()
		Object.defineProperty(document, 'fullscreenElement', { value: null, configurable: true })
		fireEvent(document, new Event('fullscreenchange'))
		expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeInTheDocument()
		wrap.requestFullscreen = undefined
		fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }))
		delete document.fullscreenElement
		delete document.exitFullscreen
	})

	it('uses vendor-prefixed and iOS fullscreen fallbacks', () => {
		const { container, video } = setup()
		const wrap = container.firstChild
		wrap.webkitRequestFullscreen = vi.fn()
		fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }))
		expect(wrap.webkitRequestFullscreen).toHaveBeenCalled()
		wrap.webkitRequestFullscreen = undefined
		video.webkitEnterFullscreen = vi.fn()
		fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }))
		expect(video.webkitEnterFullscreen).toHaveBeenCalled()
		Object.defineProperty(document, 'webkitFullscreenElement', { value: wrap, configurable: true })
		document.webkitExitFullscreen = vi.fn()
		fireEvent(document, new Event('webkitfullscreenchange'))
		fireEvent.click(screen.getByRole('button', { name: 'Exit fullscreen' }))
		expect(document.webkitExitFullscreen).toHaveBeenCalled()
		delete document.webkitFullscreenElement
		delete document.webkitExitFullscreen
	})

	it('forwards extra props and children', () => {
		const { video } = setup({ controls: false, 'data-x': '1', children: <track kind="captions" /> })
		expect(video).toHaveAttribute('data-x', '1')
		expect(screen.getByRole('group', { name: 'Clip controls' })).toBeInTheDocument()
	})
})

describe('Sound', () => {
	const setup = (props = {}) => {
		const utils = render(<Sound src="/a.mp3" title="Track" artist="Band" {...props} />)
		const audio = utils.container.querySelector('audio')
		Object.defineProperty(audio, 'paused', { value: true, writable: true, configurable: true })
		audio.play = vi.fn().mockImplementation(() => {
			audio.paused = false
			return Promise.resolve()
		})
		audio.pause = vi.fn().mockImplementation(() => {
			audio.paused = true
		})
		return { audio, ...utils }
	}

	it('labels the track and plays or pauses', () => {
		const { audio } = setup()
		expect(screen.getByRole('group', { name: 'Track player' })).toBeInTheDocument()
		expect(screen.getByText('Band')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Play' }))
		expect(audio.play).toHaveBeenCalled()
		fireEvent.play(audio)
		fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
		expect(audio.pause).toHaveBeenCalled()
		fireEvent.pause(audio)
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
	})

	it('shows cover art when given, with a fallback icon if it fails', () => {
		const { container, rerender } = render(<Sound src="/a.mp3" title="Track" />)
		expect(container.querySelector('img')).toBeNull()
		rerender(<Sound src="/a.mp3" title="Track" art="/cover.jpg" artAlt="Cover" />)
		const img = screen.getByRole('img', { name: 'Cover' })
		expect(img).toHaveAttribute('src', '/cover.jpg')
		fireEvent.error(img)
		const fallback = screen.getByRole('img', { name: 'Cover' })
		expect(fallback.querySelector('svg')).toBeInTheDocument()
		rerender(<Sound src="/a.mp3" title="Track" art="/cover.jpg" />)
		expect(container.querySelector('[alt=""]') ?? container.querySelector('[role="img"]')).toBeTruthy()
	})

	it('works without an artist and swallows a blocked play()', async () => {
		const { audio } = setup({ artist: undefined })
		expect(screen.queryByText('Band')).toBeNull()
		audio.play = vi.fn().mockRejectedValue(new Error('blocked'))
		fireEvent.click(screen.getByRole('button', { name: 'Play' }))
		await Promise.resolve()
		expect(audio.play).toHaveBeenCalled()
	})

	it('shows times, seeks, shows a popover and the loaded band', () => {
		const { audio } = setup()
		Object.defineProperty(audio, 'duration', { value: 3725, configurable: true })
		Object.defineProperty(audio, 'currentTime', { value: 65, writable: true, configurable: true })
		const ranges = [[0, 600]]
		Object.defineProperty(audio, 'buffered', {
			value: { length: 1, start: i => ranges[i][0], end: i => ranges[i][1] },
			configurable: true,
		})
		fireEvent.loadedMetadata(audio)
		fireEvent.timeUpdate(audio)
		expect(screen.getByText('1:02:05')).toBeInTheDocument()
		expect(screen.getByText('1:05')).toBeInTheDocument()
		const seek = screen.getByLabelText('Seek')
		expect(seek.style.getPropertyValue('--xd-buffer')).not.toBe('')
		fireEvent.pointerDown(seek)
		fireEvent.change(seek, { target: { value: '90' } })
		expect(audio.currentTime).toBe(90)
		expect(document.querySelector('.pointer-events-none.border')).toHaveTextContent('1:30')
		fireEvent.pointerUp(window)
		fireEvent.progress(audio)
		fireEvent.seeked(audio)
	})

	it('formats non-finite durations as 0:00', () => {
		const { audio } = setup()
		Object.defineProperty(audio, 'duration', { value: Infinity, configurable: true })
		fireEvent.loadedMetadata(audio)
		expect(screen.getAllByText('0:00')).toHaveLength(2)
	})

	it('sets the volume, mutes, and restores the volume when unmuting from zero', () => {
		const { audio } = setup()
		const slider = screen.getByLabelText('Volume')
		const mute = () => screen.getByRole('button', { name: /mute/i })
		expect(mute().querySelectorAll('path')).toHaveLength(3)
		fireEvent.change(slider, { target: { value: '0.3' } })
		expect(audio.volume).toBeCloseTo(0.3)
		expect(mute().querySelectorAll('path')).toHaveLength(2)
		fireEvent.click(mute())
		expect(screen.getByRole('button', { name: 'Unmute' })).toHaveAttribute('aria-pressed', 'true')
		expect(slider).toHaveValue('0')
		fireEvent.change(slider, { target: { value: '0.6' } })
		expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument()
		fireEvent.change(slider, { target: { value: '0' } })
		fireEvent.click(screen.getByRole('button', { name: 'Unmute' }))
		expect(audio.volume).toBe(1)
	})

	it('changes the playback speed and accepts custom speeds', () => {
		const { audio, rerender } = setup()
		fireEvent.click(screen.getByRole('combobox', { name: 'Playback speed' }))
		fireEvent.click(screen.getByRole('option', { name: '1.5x' }))
		expect(audio.playbackRate).toBe(1.5)
		audio.playbackRate = 1
		fireEvent.loadedMetadata(audio)
		expect(audio.playbackRate).toBe(1.5)
		rerender(<Sound src="/a.mp3" speeds={[1, 3]} />)
		fireEvent.click(screen.getByRole('combobox', { name: 'Playback speed' }))
		expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['1x', '3x'])
	})

	it('shows a spinner when playback stalls and hides it when it resumes', () => {
		vi.useFakeTimers()
		const { audio } = setup()
		fireEvent.waiting(audio)
		act(() => vi.advanceTimersByTime(299))
		expect(screen.queryByRole('status')).toBeNull()
		act(() => vi.advanceTimersByTime(2))
		expect(screen.getByRole('status')).toHaveTextContent('Buffering')
		for (const hide of [fireEvent.playing, fireEvent.canPlay, fireEvent.pause, fireEvent.ended, fireEvent.error]) {
			fireEvent.waiting(audio)
			act(() => vi.advanceTimersByTime(400))
			expect(screen.queryByRole('status')).not.toBeNull()
			hide(audio)
			expect(screen.queryByRole('status')).toBeNull()
		}
		vi.useRealTimers()
	})

	it('forwards extra props and children to the audio element', () => {
		const { audio } = setup({ loop: true, 'data-x': '1', children: <source src="/a.ogg" type="audio/ogg" /> })
		expect(audio).toHaveAttribute('data-x', '1')
		expect(audio.loop).toBe(true)
		expect(audio.querySelector('source')).toBeInTheDocument()
	})
})

describe('Carousel', () => {
	const slides = ['One', 'Two', 'Three'].map(s => <div key={s}>{s}</div>)

	it('moves between slides and wraps when looping', () => {
		const onIndexChange = vi.fn()
		render(<Carousel onIndexChange={onIndexChange}>{slides}</Carousel>)
		const region = screen.getByRole('region', { name: 'Carousel' })
		fireEvent.click(screen.getByLabelText('Next slide'))
		expect(onIndexChange).toHaveBeenLastCalledWith(1)
		fireEvent.click(screen.getByLabelText('Previous slide'))
		fireEvent.click(screen.getByLabelText('Previous slide'))
		expect(onIndexChange).toHaveBeenLastCalledWith(2)
		fireEvent.click(screen.getByLabelText('Go to slide 2'))
		expect(onIndexChange).toHaveBeenLastCalledWith(1)
		fireEvent.keyDown(region, { key: 'ArrowRight' })
		fireEvent.keyDown(region, { key: 'ArrowLeft' })
		fireEvent.keyDown(region, { key: 'x' })
		expect(onIndexChange).toHaveBeenCalledTimes(6)
	})

	it('clamps and disables arrows when not looping', () => {
		render(
			<Carousel loop={false} defaultIndex={0}>
				{slides}
			</Carousel>
		)
		expect(screen.getByLabelText('Previous slide')).toBeDisabled()
		fireEvent.click(screen.getByLabelText('Next slide'))
		fireEvent.click(screen.getByLabelText('Next slide'))
		expect(screen.getByLabelText('Next slide')).toBeDisabled()
		fireEvent.click(screen.getByLabelText('Go to slide 3'))
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
		fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' })
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
	})

	it('can be controlled', () => {
		const onIndexChange = vi.fn()
		render(
			<Carousel index={1} onIndexChange={onIndexChange}>
				{slides}
			</Carousel>
		)
		fireEvent.click(screen.getByLabelText('Next slide'))
		expect(onIndexChange).toHaveBeenCalledWith(2)
		expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-current', 'true')
		const groups = screen.getAllByRole('group', { hidden: true })
		expect(groups[1]).not.toHaveAttribute('inert')
		expect(groups[0]).toHaveAttribute('inert')
	})

	it('renders a single slide without controls and handles no slides', () => {
		const { rerender } = render(<Carousel>{[<div key="a">Solo</div>]}</Carousel>)
		expect(screen.queryByLabelText('Next slide')).toBeNull()
		rerender(<Carousel>{[]}</Carousel>)
		expect(screen.getByRole('region')).toBeInTheDocument()
	})

	it('auto-plays and pauses on hover and focus', () => {
		vi.useFakeTimers()
		render(<Carousel autoPlay={1000}>{slides}</Carousel>)
		const region = screen.getByRole('region')
		act(() => vi.advanceTimersByTime(1000))
		expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-current', 'true')
		fireEvent.mouseEnter(region)
		act(() => vi.advanceTimersByTime(5000))
		expect(screen.getByLabelText('Go to slide 2')).toHaveAttribute('aria-current', 'true')
		fireEvent.mouseLeave(region)
		act(() => vi.advanceTimersByTime(1000))
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
		fireEvent.focus(region)
		act(() => vi.advanceTimersByTime(5000))
		expect(screen.getByLabelText('Go to slide 3')).toHaveAttribute('aria-current', 'true')
		fireEvent.blur(region)
		act(() => vi.advanceTimersByTime(1000))
		expect(screen.getByLabelText('Go to slide 1')).toHaveAttribute('aria-current', 'true')
	})
})

describe('RackServer', () => {
	it('injects styles once and spins the fans', () => {
		const frames = []
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => frames.push(cb))
		const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
		const first = render(<RackServer />)
		const second = render(<RackServer />)
		expect(document.querySelectorAll('#rack-server-styles')).toHaveLength(1)
		const t0 = performance.now()
		act(() => frames[0](t0))
		act(() => frames[0] && frames.shift()(t0 + 10000))
		act(() => frames.shift()(t0 + 11000))
		const rotations = [...first.container.querySelectorAll('g[transform]')].map(g => g.getAttribute('transform'))
		expect(rotations.length).toBe(2)
		expect(rotations.every(r => r.startsWith('rotate('))).toBe(true)
		first.unmount()
		second.unmount()
		expect(cancel).toHaveBeenCalled()
	})
})

describe('NotificationCenter', () => {
	const notifications = [
		{ id: 1, title: 'New', body: 'body', time: '1m' },
		{ id: 2, title: 'Old', read: true },
	]

	it('shows the unread badge and opens the list', () => {
		render(<NotificationCenter notifications={notifications} />)
		const bell = screen.getByRole('button', { name: 'Notifications, 1 unread' })
		fireEvent.click(bell)
		const dialog = screen.getByRole('dialog', { name: 'Notifications' })
		expect(within(dialog).getByText('body')).toBeInTheDocument()
		expect(within(dialog).getByText('1m')).toBeInTheDocument()
		expect(within(dialog).getByText('Unread')).toBeInTheDocument()
		expect(within(dialog).queryByText('Mark all read')).toBeNull()
		expect(within(dialog).queryByText('Clear')).toBeNull()
	})

	it('selects, marks read, marks all and clears', () => {
		const onSelect = vi.fn()
		const onMarkRead = vi.fn()
		const onMarkAllRead = vi.fn()
		const onClear = vi.fn()
		render(
			<NotificationCenter
				notifications={notifications}
				onSelect={onSelect}
				onMarkRead={onMarkRead}
				onMarkAllRead={onMarkAllRead}
				onClear={onClear}
				align="start"
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: /Notifications/ }))
		fireEvent.click(screen.getByText('New'))
		expect(onMarkRead).toHaveBeenCalledWith(1)
		expect(onSelect).toHaveBeenCalledWith(notifications[0])
		fireEvent.click(screen.getByText('Old'))
		expect(onMarkRead).toHaveBeenCalledTimes(1)
		fireEvent.click(screen.getByText('Mark all read'))
		expect(onMarkAllRead).toHaveBeenCalled()
		fireEvent.click(screen.getByText('Clear'))
		expect(onClear).toHaveBeenCalled()
	})

	it('selects without handlers and caps the badge at 9+', () => {
		const many = Array.from({ length: 12 }, (_, i) => ({ id: i, title: `n${i}` }))
		render(<NotificationCenter notifications={many} />)
		expect(screen.getByText('9+')).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText('n0'))
	})

	it('shows the empty state and closes on Escape and outside click', () => {
		render(<NotificationCenter notifications={[]} empty="Nothing here" />)
		const bell = screen.getByRole('button', { name: 'Notifications' })
		fireEvent.click(bell)
		expect(screen.getByText('Nothing here')).toBeInTheDocument()
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(bell).toHaveFocus()
		fireEvent.click(bell)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(bell)
		fireEvent.click(bell)
		expect(screen.queryByRole('dialog')).toBeNull()
	})
})

describe('CommandPalette', () => {
	const makeCommands = () => [
		{ key: 'new', label: 'New file', description: 'Create', group: 'File', shortcut: 'N', onSelect: vi.fn() },
		{ key: 'open', label: 'Open file', group: 'File', onSelect: vi.fn() },
		{ key: 'theme', label: 'Toggle theme', group: 'View', onSelect: vi.fn() },
		{ key: 'about', label: 'About' },
	]

	it('renders nothing while closed', () => {
		render(<CommandPalette open={false} onClose={() => {}} commands={makeCommands()} />)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('lists grouped commands with the first active and focuses the input', () => {
		render(<CommandPalette open onClose={() => {}} commands={makeCommands()} />)
		expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
		expect(screen.getByLabelText('Search commands')).toHaveFocus()
		expect(screen.getAllByText('File')).toHaveLength(1)
		expect(screen.getByText('View')).toBeInTheDocument()
		expect(screen.getByText('N')).toBeInTheDocument()
		expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
	})

	it('filters, shows the empty message, and resets on reopen', () => {
		const props = { onClose: () => {}, commands: makeCommands() }
		const { rerender } = render(<CommandPalette open {...props} empty="Zip" />)
		const input = screen.getByLabelText('Search commands')
		fireEvent.change(input, { target: { value: 'theme' } })
		expect(screen.getAllByRole('option')).toHaveLength(1)
		fireEvent.change(input, { target: { value: 'create' } })
		expect(screen.getByText('New file')).toBeInTheDocument()
		fireEvent.change(input, { target: { value: 'zzz' } })
		expect(screen.getByText('Zip')).toBeInTheDocument()
		fireEvent.keyDown(input, { key: 'Enter' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		rerender(<CommandPalette open={false} {...props} />)
		rerender(<CommandPalette open {...props} />)
		expect(screen.getByLabelText('Search commands')).toHaveValue('')
	})

	it('moves with arrow keys (wrapping) and runs with Enter', () => {
		const onClose = vi.fn()
		const commands = makeCommands()
		render(<CommandPalette open onClose={onClose} commands={commands} />)
		const input = screen.getByLabelText('Search commands')
		fireEvent.keyDown(input, { key: 'ArrowUp' })
		expect(screen.getAllByRole('option')[3]).toHaveAttribute('aria-selected', 'true')
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'ArrowDown' })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(commands[1].onSelect).toHaveBeenCalled()
		expect(onClose).toHaveBeenCalled()
		fireEvent.keyDown(input, { key: 'a' })
	})

	it('runs by click, highlights on hover, and tolerates commands without onSelect', () => {
		const onClose = vi.fn()
		const commands = makeCommands()
		render(<CommandPalette open onClose={onClose} commands={commands} />)
		fireEvent.mouseMove(screen.getByText('Toggle theme'))
		expect(screen.getAllByRole('option')[2]).toHaveAttribute('aria-selected', 'true')
		fireEvent.click(screen.getByText('Toggle theme'))
		expect(commands[2].onSelect).toHaveBeenCalled()
		fireEvent.click(screen.getByText('About'))
		expect(onClose).toHaveBeenCalledTimes(2)
	})

	it('closes on Escape and backdrop click and scrolls the active row into view', () => {
		const onClose = vi.fn()
		const scroll = vi.fn()
		Element.prototype.scrollIntoView = scroll
		render(<CommandPalette open onClose={onClose} commands={makeCommands()} placeholder="Find" />)
		expect(screen.getByPlaceholderText('Find')).toBeInTheDocument()
		expect(scroll).toHaveBeenCalled()
		fireEvent.keyDown(window, { key: 'Escape' })
		fireEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
		expect(onClose).toHaveBeenCalledTimes(2)
		delete Element.prototype.scrollIntoView
	})

	it('handles an empty command list', () => {
		render(<CommandPalette open onClose={() => {}} commands={[]} />)
		fireEvent.keyDown(screen.getByLabelText('Search commands'), { key: 'ArrowDown' })
		fireEvent.keyDown(screen.getByLabelText('Search commands'), { key: 'ArrowUp' })
		expect(screen.getByText('No matching commands')).toBeInTheDocument()
	})
})

describe('DataGrid', () => {
	const columns = [
		{ key: 'name', header: 'Name', sortable: true },
		{ key: 'age', header: 'Age', sortable: true, align: 'right' },
		{ key: 'city', header: 'City', render: r => <i>{r.city}</i>, accessor: r => r.city },
		{ key: 'note', header: 'Note' },
	]
	const rows = [
		{ id: 1, name: 'Cara', age: 30, city: 'Paris' },
		{ id: 2, name: 'Abe', age: 25, city: 'Rome', note: null },
		{ id: 3, name: 'Bea', age: null, city: 'Oslo' },
		{ id: 4, name: 'Dan', age: 41, city: 'Lima' },
		{ id: 5, name: 'Eve', age: 41, city: 'Cairo' },
	]

	it('applies per-column classes, width and responsive hiding', () => {
		const cols = [
			{ key: 'name', header: 'Name', className: 'cell-x', headerClassName: 'head-x', width: 120, minWidth: 90 },
			{ key: 'city', header: 'City', hideBelow: 'md' },
		]
		render(<DataGrid columns={cols} rows={rows} />)
		const head = screen.getByRole('columnheader', { name: 'Name' })
		expect(head).toHaveClass('head-x')
		expect(head).toHaveStyle({ width: '120px', 'min-width': '90px' })
		expect(screen.getByText('Cara')).toHaveClass('cell-x')
		expect(screen.getByRole('columnheader', { name: 'City' })).toHaveClass('hidden', 'md:table-cell')
		expect(screen.getByText('Paris')).toHaveClass('hidden', 'md:table-cell')
	})

	it('hides the footer when everything fits on one page, if asked', () => {
		const { rerender } = render(<DataGrid columns={columns} rows={rows} pageSize={10} />)
		expect(screen.getByText(`${rows.length} rows`)).toBeInTheDocument()
		rerender(<DataGrid columns={columns} rows={rows} pageSize={10} hideFooterWhenSinglePage />)
		expect(screen.queryByText(`${rows.length} rows`)).toBeNull()
		rerender(<DataGrid columns={columns} rows={rows} pageSize={2} hideFooterWhenSinglePage />)
		expect(screen.getByText(`${rows.length} rows`)).toBeInTheDocument()
	})

	it('shows skeleton rows and aria-busy while loading', () => {
		render(<DataGrid columns={columns} rows={rows} pageSize={3} loading />)
		expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
		expect(screen.queryByText('Cara')).toBeNull()
		expect(screen.getByText('Loading…')).toBeInTheDocument()
		expect(screen.getAllByRole('row')).toHaveLength(1 + 3)
	})
	const names = () =>
		screen
			.getAllByRole('row')
			.slice(1)
			.map(r => within(r).getAllByRole('cell')[0].textContent)

	it('lets the user change the page size and returns to page 1', () => {
		const onPageSizeChange = vi.fn()
		render(
			<DataGrid
				columns={columns}
				rows={rows}
				pageSize={2}
				pageSizeOptions={[2, 10]}
				onPageSizeChange={onPageSizeChange}
			/>
		)
		expect(names()).toEqual(['Cara', 'Abe'])
		fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))
		expect(names()).toEqual(['Bea', 'Dan'])
		fireEvent.click(screen.getByRole('combobox', { name: /per page/i }))
		fireEvent.click(screen.getByRole('option', { name: '10' }))
		expect(onPageSizeChange).toHaveBeenCalledWith(10)
		expect(names()).toHaveLength(5)
		// the selector stays available even though everything now fits on one page
		expect(screen.getByRole('combobox', { name: /per page/i })).toHaveTextContent('10')
	})

	it('renders rows and a count', () => {
		render(<DataGrid columns={columns} rows={rows} caption="People" />)
		expect(names()).toEqual(['Cara', 'Abe', 'Bea', 'Dan', 'Eve'])
		expect(screen.getByText('5 rows')).toBeInTheDocument()
		expect(screen.getByText('People')).toBeInTheDocument()
		expect(screen.getByRole('columnheader', { name: 'Note' })).not.toHaveAttribute('aria-sort')
	})

	it('cycles sorting asc -> desc -> none and sorts numbers/null last', () => {
		render(<DataGrid columns={columns} rows={rows} />)
		fireEvent.click(screen.getByRole('button', { name: /Name/ }))
		expect(names()).toEqual(['Abe', 'Bea', 'Cara', 'Dan', 'Eve'])
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
		fireEvent.click(screen.getByRole('button', { name: /Name/ }))
		expect(names()[0]).toBe('Eve')
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')
		fireEvent.click(screen.getByRole('button', { name: /Name/ }))
		expect(names()).toEqual(['Cara', 'Abe', 'Bea', 'Dan', 'Eve'])
		fireEvent.click(screen.getByRole('button', { name: /Age/ }))
		expect(names()).toEqual(['Abe', 'Cara', 'Dan', 'Eve', 'Bea'])
		fireEvent.click(screen.getByRole('button', { name: /Age/ }))
		expect(names()[0]).toBe('Bea')
		expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'none')
	})

	it('searches across accessor values, resets the page and shows the empty state', () => {
		render(<DataGrid columns={columns} rows={rows} searchable empty="Nope" />)
		const search = screen.getByLabelText('Search rows')
		fireEvent.change(search, { target: { value: 'ROME' } })
		expect(names()).toEqual(['Abe'])
		expect(screen.getByText('1 row')).toBeInTheDocument()
		fireEvent.change(search, { target: { value: 'zzz' } })
		expect(screen.getByText('Nope')).toHaveAttribute('colspan', '4')
	})

	it('paginates', () => {
		render(<DataGrid columns={columns} rows={rows} pageSize={2} />)
		expect(names()).toEqual(['Cara', 'Abe'])
		fireEvent.click(screen.getByText('Next'))
		expect(names()).toEqual(['Bea', 'Dan'])
		fireEvent.click(screen.getByRole('button', { name: /Name/ })) // sorting resets to page 1
		expect(names()).toEqual(['Abe', 'Bea'])
	})

	it('supports uncontrolled selection with select-all per page', () => {
		const onSelectionChange = vi.fn()
		render(<DataGrid columns={columns} rows={rows} pageSize={2} selectable onSelectionChange={onSelectionChange} />)
		fireEvent.click(screen.getByLabelText('Select row 1'))
		expect(onSelectionChange).toHaveBeenLastCalledWith([1])
		expect(screen.getByText('5 rows, 1 selected')).toBeInTheDocument()
		const all = screen.getByLabelText('Select all rows on this page')
		expect(all.indeterminate).toBe(true)
		fireEvent.click(all)
		expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2])
		fireEvent.click(all)
		expect(onSelectionChange).toHaveBeenLastCalledWith([])
		fireEvent.click(screen.getByLabelText('Select row 2'))
		fireEvent.click(screen.getByLabelText('Select row 2'))
		expect(screen.getAllByRole('row', { selected: false }).length).toBeGreaterThan(0)
	})

	it('supports controlled selection', () => {
		const onSelectionChange = vi.fn()
		render(<DataGrid columns={columns} rows={rows} selectable selected={[2]} onSelectionChange={onSelectionChange} />)
		expect(screen.getByLabelText('Select row 2')).toBeChecked()
		fireEvent.click(screen.getByLabelText('Select row 3'))
		expect(onSelectionChange).toHaveBeenCalledWith([2, 3])
		expect(screen.getByLabelText('Select row 3')).not.toBeChecked()
		fireEvent.click(screen.getByLabelText('Select row 2'))
		expect(onSelectionChange).toHaveBeenLastCalledWith([])
	})

	it('select-all is unchecked on an empty page and rowKey is configurable', () => {
		render(<DataGrid columns={columns} rows={[]} selectable />)
		expect(screen.getByLabelText('Select all rows on this page')).not.toBeChecked()
		expect(screen.getByText('0 rows')).toBeInTheDocument()
	})

	it('uses a custom rowKey', () => {
		render(
			<DataGrid
				columns={[{ key: 'name', header: 'N' }]}
				rows={[{ name: 'a' }, { name: 'b' }]}
				rowKey="name"
				selectable
			/>
		)
		expect(screen.getByLabelText('Select row a')).toBeInTheDocument()
	})
})
