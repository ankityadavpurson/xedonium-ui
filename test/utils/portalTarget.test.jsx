import { fireEvent, render, screen, within } from '@testing-library/react'
import FloatingPanel from '../../src/components/FloatingPanel'
import Portal from '../../src/components/Portal'
import Tooltip from '../../src/components/Tooltip'
import portalTarget from '../../src/utils/portalTarget'

const setFullscreen = element =>
	Object.defineProperty(document, 'fullscreenElement', { value: element, configurable: true })

describe('portalTarget', () => {
	afterEach(() => {
		delete document.fullscreenElement
		delete document.webkitFullscreenElement
	})

	it('is the body normally and the fullscreen element while fullscreen', () => {
		expect(portalTarget()).toBe(document.body)
		const player = document.createElement('div')
		setFullscreen(player)
		expect(portalTarget()).toBe(player)
		delete document.fullscreenElement
		Object.defineProperty(document, 'webkitFullscreenElement', { value: player, configurable: true })
		expect(portalTarget()).toBe(player)
	})

	it('ignores a fullscreen <video> (iOS), which cannot hold children', () => {
		setFullscreen(document.createElement('video'))
		expect(portalTarget()).toBe(document.body)
	})

	it('renders panels and portals into the fullscreen element', () => {
		const player = document.createElement('div')
		document.body.appendChild(player)
		setFullscreen(player)
		const anchor = { current: document.createElement('button') }
		render(
			<>
				<FloatingPanel open anchorRef={anchor}>
					<span>panel</span>
				</FloatingPanel>
				<Portal>
					<span>portal</span>
				</Portal>
			</>
		)
		expect(player).toContainElement(screen.getByText('panel'))
		expect(player).toContainElement(screen.getByText('portal'))
		player.remove()
	})

	it('keeps the tooltip inside the fullscreen element', () => {
		const player = document.createElement('div')
		document.body.appendChild(player)
		setFullscreen(player)
		render(
			<Tooltip text="Hint">
				<button>x</button>
			</Tooltip>
		)
		fireEvent.mouseEnter(screen.getByRole('button').parentElement)
		expect(within(player).getByText('Hint')).toBeInTheDocument()
		player.remove()
	})
})
