import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRef, useState } from 'react'
import ActionMenu from '../../src/components/ActionMenu'
import AppBar from '../../src/components/AppBar'
import AppShell from '../../src/components/AppShell'
import ConfirmDialog from '../../src/components/ConfirmDialog'
import Drawer from '../../src/components/Drawer'
import FloatingPanel from '../../src/components/FloatingPanel'
import FocusTrap from '../../src/components/FocusTrap'
import Modal from '../../src/components/Modal'
import Popover from '../../src/components/Popover'
import { ThemeContext } from '../../src/theme/ThemeContext'

describe('FloatingPanel', () => {
	const Harness = props => {
		const anchorRef = useRef(null)
		return (
			<>
				<button ref={anchorRef}>anchor</button>
				<FloatingPanel anchorRef={anchorRef} data-testid="panel" {...props}>
					content
				</FloatingPanel>
			</>
		)
	}

	it('renders nothing when closed and a portalled panel when open', () => {
		const { rerender } = render(<Harness open={false} />)
		expect(screen.queryByTestId('panel')).toBeNull()
		rerender(<Harness open />)
		const panel = screen.getByTestId('panel')
		expect(panel.parentElement).toBe(document.body)
		expect(panel).toHaveStyle({ position: 'fixed', opacity: '1' })
		rerender(<Harness open={false} />)
		expect(screen.queryByTestId('panel')).toBeNull()
	})

	it('follows an anchor that moves between renders', () => {
		let top = 100
		const anchor = document.createElement('span')
		anchor.getBoundingClientRect = () => ({ left: 50, top, right: 60, bottom: top + 20, width: 10, height: 20 })
		const anchorRef = { current: anchor }
		const Panel = () => (
			<FloatingPanel open anchorRef={anchorRef} placement="bottom-start" data-testid="moving">
				x
			</FloatingPanel>
		)
		const { rerender } = render(<Panel />)
		expect(screen.getByTestId('moving')).toHaveStyle({ top: '124px' })
		top = 300
		rerender(<Panel />)
		expect(screen.getByTestId('moving')).toHaveStyle({ top: '324px' })
	})

	it('supports matchWidth, custom panelRef and style', () => {
		const panelRef = { current: null }
		render(<Harness open matchWidth panelRef={panelRef} style={{ color: 'red' }} className="k" />)
		expect(panelRef.current).toBe(screen.getByTestId('panel'))
		expect(screen.getByTestId('panel')).toHaveStyle({ color: 'red' })
	})

	it('re-measures on scroll and resize and hides when the anchor is clipped', () => {
		render(<Harness open />)
		const anchor = screen.getByText('anchor')
		anchor.getBoundingClientRect = () => ({
			left: 0,
			top: -900,
			right: 50,
			bottom: -800,
			width: 50,
			height: 100,
		})
		fireEvent.scroll(window)
		fireEvent.resize(window)
		expect(screen.getByTestId('panel')).toHaveStyle({ opacity: '0', pointerEvents: 'none' })
	})

	it('tolerates a missing anchor', () => {
		const NoAnchor = () => (
			<FloatingPanel open anchorRef={{ current: null }} data-testid="panel">
				x
			</FloatingPanel>
		)
		render(<NoAnchor />)
		expect(screen.getByTestId('panel')).toHaveStyle({ opacity: '0' })
	})

	it('observes the panel size where ResizeObserver exists', () => {
		const observe = vi.fn()
		const disconnect = vi.fn()
		globalThis.ResizeObserver = class {
			observe = observe
			disconnect = disconnect
		}
		const { unmount } = render(<Harness open />)
		expect(observe).toHaveBeenCalled()
		unmount()
		expect(disconnect).toHaveBeenCalled()
	})

	it('works without ResizeObserver', () => {
		const original = globalThis.ResizeObserver
		delete globalThis.ResizeObserver
		render(<Harness open />)
		expect(screen.getByTestId('panel')).toBeInTheDocument()
		globalThis.ResizeObserver = original
	})
})

describe('Popover', () => {
	it('toggles on click and dismisses via outside click', () => {
		render(
			<Popover trigger="Open" label="Details">
				<p>inside</p>
			</Popover>
		)
		const trigger = screen.getByRole('button', { name: 'Details' })
		expect(trigger).toHaveAttribute('aria-expanded', 'false')
		fireEvent.click(trigger)
		expect(screen.getByRole('dialog', { name: 'Details' })).toHaveTextContent('inside')
		expect(trigger).toHaveAttribute('aria-controls')
		fireEvent.mouseDown(screen.getByText('inside'))
		expect(screen.getByText('inside')).toBeInTheDocument()
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
		fireEvent.click(trigger)
		fireEvent.click(trigger)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('returns focus to the trigger on Escape and honours placement/align', () => {
		render(
			<>
				<Popover trigger="A" label="One" align="end" variant="warning" className="x">
					a
				</Popover>
				<Popover trigger="B" label="Two" placement="top-start">
					b
				</Popover>
			</>
		)
		fireEvent.click(screen.getByRole('button', { name: 'One' }))
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByText('a')).toBeNull()
		expect(screen.getByRole('button', { name: 'One' })).toHaveFocus()
		fireEvent.click(screen.getByRole('button', { name: 'Two' }))
		expect(screen.getByText('b')).toBeInTheDocument()
	})
})

describe('ActionMenu danger tone', () => {
	it('styles a danger item in red', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Menu"
				items={[{ key: 'd', label: 'Delete', tone: 'danger', onClick: () => {} }]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-red-700')
	})
})

describe('ActionMenu', () => {
	const makeItems = (onClick = vi.fn()) => [
		{ key: 'a', label: 'Alpha', description: 'first', badge: 3, onClick },
		{ key: 'b', label: 'Beta', tone: 'warning', hasDialog: true, onClick },
		{ key: 'c', label: 'Gamma', disabled: true, onClick },
	]

	it('shows an item icon before the label without changing its accessible name', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Menu"
				items={[{ key: 'a', label: 'Alpha', icon: <svg data-testid="icon" />, onClick: () => {} }]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
		expect(screen.getByRole('menuitem', { name: 'Alpha' })).toBeInTheDocument()
	})

	it('opens, runs an item and closes', () => {
		const onClick = vi.fn()
		render(<ActionMenu label="Actions" trigger="Menu" items={makeItems(onClick)} />)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(screen.getByRole('menu')).toBeInTheDocument()
		expect(screen.getByText('first')).toBeInTheDocument()
		expect(screen.getByText('3')).toBeInTheDocument()
		expect(screen.getByRole('menuitem', { name: /Beta/ })).toHaveAttribute('aria-haspopup', 'dialog')
		expect(screen.getByRole('menuitem', { name: /Gamma/ })).toBeDisabled()
		fireEvent.click(screen.getByRole('menuitem', { name: /Alpha/ }))
		expect(onClick).toHaveBeenCalledTimes(1)
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('closes on Escape (focusing the trigger) and outside click', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Menu"
				items={makeItems()}
				variant="warning"
				placement="bottom-end"
				className="c"
			/>
		)
		const trigger = screen.getByRole('button', { name: 'Actions' })
		fireEvent.click(trigger)
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('menu')).toBeNull()
		expect(trigger).toHaveFocus()
		fireEvent.click(trigger)
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('menu')).toBeNull()
		fireEvent.click(trigger)
		fireEvent.click(trigger)
		expect(screen.queryByRole('menu')).toBeNull()
	})
})

describe('ActionMenu link items', () => {
	const open = props => {
		render(<ActionMenu label="Actions" trigger="Menu" {...props} />)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
	}

	it('renders an item with an href as a real link, closes the menu and still calls onClick', () => {
		const onClick = vi.fn()
		open({ items: [{ key: 'a', label: 'Apps', href: '/apps', onClick }] })
		const link = screen.getByRole('menuitem', { name: 'Apps' })
		expect(link.tagName).toBe('A')
		expect(link).toHaveAttribute('href', '/apps')
		fireEvent.click(link)
		expect(onClick).toHaveBeenCalledTimes(1)
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('closes the menu for a link item without an onClick', () => {
		open({ items: [{ key: 'a', label: 'Apps', href: '/apps' }] })
		fireEvent.click(screen.getByRole('menuitem', { name: 'Apps' }))
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('uses linkComponent and linkProp for router links', () => {
		const RouterLink = ({ to, children, ...rest }) => (
			<a data-router="yes" data-to={to} {...rest}>
				{children}
			</a>
		)
		open({
			linkComponent: RouterLink,
			linkProp: 'to',
			items: [
				{ key: 'a', label: 'Health', href: '/health' },
				{ key: 'b', label: 'Site', href: 'https://example.com' },
			],
		})
		// absolute URLs are not router paths: they stay plain anchors
		expect(screen.getByRole('menuitem', { name: 'Site' })).toHaveAttribute('href', 'https://example.com')
		expect(screen.getByRole('menuitem', { name: 'Site' })).not.toHaveAttribute('data-router')
		const link = screen.getByRole('menuitem', { name: 'Health' })
		expect(link).toHaveAttribute('data-router', 'yes')
		expect(link).toHaveAttribute('data-to', '/health')
		expect(link).not.toHaveAttribute('href')
	})

	it('renders a disabled link without an href and ignores it', () => {
		const onClick = vi.fn()
		open({ items: [{ key: 'a', label: 'Apps', href: '/apps', disabled: true, onClick }] })
		const link = screen.getByRole('menuitem', { name: 'Apps' })
		expect(link).not.toHaveAttribute('href')
		expect(link).toHaveAttribute('aria-disabled', 'true')
		fireEvent.click(link)
		expect(onClick).not.toHaveBeenCalled()
	})
})

describe('ActionMenu keyboard and link target', () => {
	const items = [
		{ key: 'a', label: 'Alpha', onClick: () => {} },
		{ key: 'b', label: 'Beta', disabled: true, onClick: () => {} },
		{ key: 'c', label: 'Gamma', href: '/gamma' },
		{ key: 'd', label: 'Delta', onClick: () => {} },
	]
	const open = (extra = {}) => {
		render(
			<>
				<ActionMenu label="Actions" trigger="Menu" items={items} {...extra} />
				<button>after</button>
			</>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
	}
	const item = name => screen.getByRole('menuitem', { name })

	it('focuses the first enabled item when it opens', () => {
		open()
		expect(item('Alpha')).toHaveFocus()
	})

	it('moves between enabled items with the arrow keys, wrapping, and Home / End', () => {
		open()
		const menu = screen.getByRole('menu')
		fireEvent.keyDown(menu, { key: 'ArrowDown' })
		expect(item('Gamma')).toHaveFocus() // Beta is disabled
		fireEvent.keyDown(menu, { key: 'ArrowDown' })
		expect(item('Delta')).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'ArrowDown' })
		expect(item('Alpha')).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'ArrowUp' })
		expect(item('Delta')).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'Home' })
		expect(item('Alpha')).toHaveFocus()
		fireEvent.keyDown(menu, { key: 'End' })
		expect(item('Delta')).toHaveFocus()
	})

	it('chooses a link item with Space and closes on Tab, handing focus to the trigger', () => {
		open()
		const menu = screen.getByRole('menu')
		const click = vi.fn(event => event.preventDefault())
		fireEvent.keyDown(menu, { key: 'ArrowDown' })
		item('Gamma').addEventListener('click', click)
		fireEvent.keyDown(menu, { key: ' ' })
		expect(click).toHaveBeenCalledTimes(1)
		expect(screen.queryByRole('menu')).toBeNull()
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' })
		expect(screen.queryByRole('menu')).toBeNull()
		expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
	})

	it('shows an arrow only on external links', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Menu"
				items={[
					{ key: 'a', label: 'Absolute', href: 'https://example.com' },
					{ key: 'b', label: 'Blank', href: '/docs', target: '_blank' },
					{ key: 'c', label: 'Inside', href: '/inside' },
					{ key: 'd', label: 'Mail', href: 'mailto:a@b.c' },
					{ key: 'e', label: 'Forced', href: '/x', external: true },
					{ key: 'f', label: 'Off', href: 'https://example.com', external: false },
					{ key: 'g', label: 'Button', onClick: () => {} },
				]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		const hasArrow = name => screen.getByRole('menuitem', { name }).querySelector('svg') !== null
		expect(['Absolute', 'Blank', 'Forced'].map(hasArrow)).toEqual([true, true, true])
		expect(['Inside', 'Mail', 'Off', 'Button'].map(hasArrow)).toEqual([false, false, false, false])
	})

	it('opens a target="_blank" link safely and leaves other links alone', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Menu"
				items={[
					{ key: 'a', label: 'External', href: 'https://example.com', target: '_blank' },
					{ key: 'b', label: 'Internal', href: '/inside' },
				]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(item('External')).toHaveAttribute('target', '_blank')
		expect(item('External')).toHaveAttribute('rel', 'noopener noreferrer')
		expect(item('Internal')).not.toHaveAttribute('target')
		expect(item('Internal')).not.toHaveAttribute('rel')
	})
})

describe('Modal', () => {
	it('fills the screen below a breakpoint and passes form props through', () => {
		const { rerender } = render(
			<Modal open onClose={() => {}} title="T" as="form" noValidate method="post" fullScreenBelow="sm">
				<input aria-label="name" />
			</Modal>
		)
		const dialog = screen.getByRole('dialog')
		expect(dialog.tagName).toBe('FORM')
		expect(dialog).toHaveAttribute('novalidate')
		expect(dialog).toHaveAttribute('method', 'post')
		expect(dialog).toHaveClass('max-sm:h-[100dvh]', 'max-sm:max-w-none')
		expect(dialog.parentElement).toHaveClass('max-sm:px-0')
		rerender(
			<Modal open onClose={() => {}} title="T" fullScreenBelow="md">
				x
			</Modal>
		)
		expect(screen.getByRole('dialog')).toHaveClass('max-md:h-[100dvh]')
		rerender(
			<Modal open onClose={() => {}} title="T">
				x
			</Modal>
		)
		expect(screen.getByRole('dialog').className).not.toContain('max-sm:')
	})

	const Controlled = props => {
		const [open, setOpen] = useState(true)
		return (
			<>
				<button>opener</button>
				<Modal open={open} onClose={() => setOpen(false)} title="Hello" {...props}>
					<button>inner</button>
				</Modal>
			</>
		)
	}

	it('renders nothing while closed', () => {
		render(<Modal open={false} onClose={() => {}} title="x" />)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('renders title, children and footer, and closes by button, backdrop and Escape', () => {
		const { rerender } = render(<Controlled footer={<span>foot</span>} />)
		expect(screen.getByRole('dialog', { name: 'Hello' })).toBeInTheDocument()
		expect(screen.getByText('foot')).toBeInTheDocument()
		fireEvent.click(screen.getByLabelText('Close dialog'))
		expect(screen.queryByRole('dialog')).toBeNull()
		rerender(<Controlled key="2" />)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		rerender(<Controlled key="3" />)
		fireEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('ignores dismissal while busy or non-dismissible', () => {
		const onClose = vi.fn()
		const { rerender } = render(<Modal open onClose={onClose} title="t" busy />)
		fireEvent.keyDown(window, { key: 'Escape' })
		fireEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
		fireEvent.click(screen.getByLabelText('Close dialog'))
		expect(onClose).not.toHaveBeenCalled()
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true')
		rerender(<Modal open onClose={onClose} title="t" dismissible={false} />)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).not.toHaveBeenCalled()
		fireEvent.click(screen.getByLabelText('Close dialog'))
		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('supports tone, role, as=form and describedBy', () => {
		const onSubmit = vi.fn(e => e.preventDefault())
		render(
			<Modal
				open
				onClose={() => {}}
				title="t"
				tone="danger"
				role="alertdialog"
				as="form"
				onSubmit={onSubmit}
				describedBy="d"
			>
				<button type="submit">go</button>
			</Modal>
		)
		const dialog = screen.getByRole('alertdialog')
		expect(dialog.tagName).toBe('FORM')
		expect(dialog).toHaveAttribute('aria-describedby', 'd')
		fireEvent.click(screen.getByText('go'))
		expect(onSubmit).toHaveBeenCalled()
	})

	it('always uses the latest onClose', () => {
		const first = vi.fn()
		const second = vi.fn()
		const { rerender } = render(<Modal open onClose={first} title="t" />)
		rerender(<Modal open onClose={second} title="t" />)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(second).toHaveBeenCalled()
		expect(first).not.toHaveBeenCalled()
	})
})

describe('ConfirmDialog options', () => {
	it('can disable the confirm button, widen the dialog and restyle the button', () => {
		const onConfirm = vi.fn()
		const { rerender } = render(
			<ConfirmDialog
				open
				onClose={() => {}}
				onConfirm={onConfirm}
				confirmLabel="Go"
				confirmDisabled
				maxWidth="max-w-3xl"
			>
				Body
			</ConfirmDialog>
		)
		expect(screen.getByRole('button', { name: 'Go' })).toBeDisabled()
		expect(document.querySelector('.max-w-3xl')).not.toBeNull()
		rerender(
			<ConfirmDialog open onClose={() => {}} onConfirm={onConfirm} confirmLabel="Go" confirmVariant="warning">
				Body
			</ConfirmDialog>
		)
		expect(screen.getByRole('button', { name: 'Go' })).toBeEnabled()
	})
})

describe('ConfirmDialog', () => {
	it('confirms and cancels', () => {
		const onConfirm = vi.fn()
		const onClose = vi.fn()
		render(
			<ConfirmDialog open onClose={onClose} onConfirm={onConfirm} title="Sure?" confirmLabel="Yes" cancelLabel="No">
				Really?
			</ConfirmDialog>
		)
		expect(screen.getByRole('dialog')).toHaveTextContent('Really?')
		fireEvent.click(screen.getByText('Yes'))
		expect(onConfirm).toHaveBeenCalled()
		fireEvent.click(screen.getByText('No'))
		expect(onClose).toHaveBeenCalled()
	})

	it('shows busy state, errors and danger styling', () => {
		const { rerender } = render(
			<ConfirmDialog
				open
				onClose={() => {}}
				onConfirm={() => {}}
				title="t"
				tone="danger"
				busy
				busyLabel="Deleting"
				error="Oops"
			/>
		)
		expect(screen.getByRole('alertdialog')).toBeInTheDocument()
		expect(screen.getByText('Deleting')).toBeInTheDocument()
		expect(screen.getByRole('alert')).toHaveTextContent('Oops')
		expect(screen.getByText('Cancel')).toBeDisabled()
		rerender(<ConfirmDialog open onClose={() => {}} onConfirm={() => {}} title="t" busy />)
		expect(screen.getByText('Confirm', { selector: 'span' })).toBeInTheDocument()
	})
})

describe('initialFocusRef', () => {
	const Harness = ({ Dialog }) => {
		const ref = useRef(null)
		return (
			<Dialog open onClose={() => {}} title="T" initialFocusRef={ref}>
				<input aria-label="first" />
				<input ref={ref} aria-label="chosen" />
			</Dialog>
		)
	}

	it.each([
		['Modal', Modal],
		['Drawer', Drawer],
	])('%s focuses the chosen element on open', (_, Dialog) => {
		render(<Harness Dialog={Dialog} />)
		expect(screen.getByLabelText('chosen')).toHaveFocus()
	})
})

describe('Drawer', () => {
	it('ignores Escape, backdrop and close while busy, with an optional overlay', () => {
		const onClose = vi.fn()
		const { rerender } = render(
			<Drawer open onClose={onClose} title="Panel" busy>
				body
			</Drawer>
		)
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true')
		expect(screen.getByLabelText('Close')).toBeDisabled()
		fireEvent.keyDown(window, { key: 'Escape' })
		fireEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
		expect(onClose).not.toHaveBeenCalled()
		expect(screen.queryByText('Loading')).toBeNull()
		rerender(
			<Drawer open onClose={onClose} title="Panel" busy busyOverlay>
				body
			</Drawer>
		)
		expect(screen.getByText('Loading')).toBeInTheDocument()
		rerender(
			<Drawer open onClose={onClose} title="Panel" busyOverlay>
				body
			</Drawer>
		)
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(onClose).toHaveBeenCalledTimes(1)
		expect(screen.queryByText('Loading')).toBeNull()
	})

	it('opens in a portal, locks scroll, and restores it on close', () => {
		document.body.style.overflow = 'auto'
		const onClose = vi.fn()
		const { rerender } = render(
			<Drawer open onClose={onClose} title="Panel" footer={<span>foot</span>}>
				<button>inside</button>
			</Drawer>
		)
		expect(screen.getByRole('dialog', { name: 'Panel' })).toBeInTheDocument()
		expect(document.body.style.overflow).toBe('hidden')
		expect(screen.getByText('foot')).toBeInTheDocument()
		fireEvent.click(screen.getByLabelText('Close'))
		fireEvent.keyDown(window, { key: 'Escape' })
		fireEvent.click(document.querySelector('[aria-hidden="true"].absolute'))
		expect(onClose).toHaveBeenCalledTimes(3)
		rerender(
			<Drawer open={false} onClose={onClose} title="Panel">
				x
			</Drawer>
		)
		expect(document.body.style.overflow).toBe('auto')
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('supports left side and unpadded bodies', () => {
		render(
			<Drawer open onClose={() => {}} title="L" side="left" padded={false} width="max-w-xs">
				x
			</Drawer>
		)
		expect(screen.getByRole('dialog')).toHaveClass('left-0', 'max-w-xs')
	})
})

describe('FocusTrap', () => {
	it('moves focus in and wraps Tab; passes extra props', () => {
		const { rerender } = render(
			<>
				<button>before</button>
				<FocusTrap active={false} data-testid="trap">
					<button>one</button>
					<button>two</button>
				</FocusTrap>
			</>
		)
		screen.getByText('before').focus()
		rerender(
			<>
				<button>before</button>
				<FocusTrap data-testid="trap" className="c">
					<button>one</button>
					<button>two</button>
				</FocusTrap>
			</>
		)
		expect(screen.getByText('one')).toHaveFocus()
		screen.getByText('two').focus()
		fireEvent.keyDown(screen.getByTestId('trap'), { key: 'Tab' })
		expect(screen.getByText('one')).toHaveFocus()
	})
})

describe('AppBar', () => {
	const renderBar = props =>
		render(
			<ThemeContext.Provider value={{ activeTheme: 'dark', toggleTheme: () => {} }}>
				<AppBar brand="Xed" {...props} />
			</ThemeContext.Provider>
		)

	it('renders brand, links with active state, toggle and actions', () => {
		renderBar({
			logo: <i data-testid="logo" />,
			links: [
				{ href: '/a', label: 'A', active: true },
				{ href: '/b', label: 'B', 'data-x': '1' },
			],
			actions: <button>act</button>,
		})
		expect(screen.getByText('Xed').closest('a')).toHaveAttribute('href', '/')
		expect(screen.getByText('A')).toHaveAttribute('aria-current', 'page')
		expect(screen.getByText('B')).toHaveAttribute('data-x', '1')
		expect(screen.getByText('act')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Switch to light/ })).toBeInTheDocument()
	})

	it('supports router links, no theme toggle, hidden brand on mobile and no links', () => {
		const Custom = ({ to, children, ...p }) => (
			<a data-custom href={to} {...p}>
				{children}
			</a>
		)
		renderBar({
			linkComponent: Custom,
			linkProp: 'to',
			brandHref: '/home',
			themeToggle: false,
			hideBrandOnMobile: true,
		})
		expect(screen.getByText('Xed').closest('a')).toHaveAttribute('data-custom')
		expect(screen.getByText('Xed')).toHaveClass('hidden')
		expect(screen.queryByRole('navigation')).toBeNull()
		expect(screen.queryByRole('button')).toBeNull()
	})

	it('renders no outer header frame when embedded (e.g. inside AppShell)', () => {
		const { container } = renderBar({ embedded: true })
		expect(container.querySelector('header')).toBeNull()
		expect(container.firstChild).not.toHaveClass('sticky')
		expect(screen.getByText('Xed')).toBeInTheDocument()
	})

	it('has a single banner when embedded in AppShell', () => {
		render(
			<ThemeContext.Provider value={{ activeTheme: 'dark', toggleTheme: () => {} }}>
				<AppShell header={<AppBar brand="Xed" embedded />}>Main</AppShell>
			</ThemeContext.Provider>
		)
		expect(screen.getAllByRole('banner')).toHaveLength(1)
	})
})

describe('AppShell', () => {
	it('tells a sidebar render function whether it is in the drawer or an icon rail', () => {
		const seen = []
		const listeners = []
		const original = window.matchMedia
		window.matchMedia = query => ({
			matches: false,
			media: query,
			addEventListener: (_, cb) => listeners.push(cb),
			removeEventListener: () => {},
		})
		render(
			<AppShell
				header="h"
				sidebarCollapsedBelow="lg"
				sidebar={(close, ctx) => {
					seen.push(ctx)
					return <nav>side</nav>
				}}
			>
				Main
			</AppShell>
		)
		expect(seen).toContainEqual({ inDrawer: false, collapsed: true })
		fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
		expect(seen).toContainEqual({ inDrawer: true, collapsed: false })
		act(() => listeners.forEach(cb => cb({ matches: true })))
		expect(seen).toContainEqual({ inDrawer: false, collapsed: false })
		window.matchMedia = original
	})

	it('customises the mobile menu button', () => {
		const onClick = vi.fn()
		render(
			<AppShell
				header="h"
				sidebar={<nav>side</nav>}
				menuButtonVariant="flat"
				menuButtonProps={{ className: 'extra', 'aria-label': 'Navigation', onClick }}
			>
				Main
			</AppShell>
		)
		const button = screen.getByRole('button', { name: 'Navigation' })
		expect(button).toHaveClass('extra', 'bg-transparent')
		fireEvent.click(button)
		expect(onClick).toHaveBeenCalledTimes(1)
		expect(screen.getByRole('dialog')).toBeInTheDocument()
	})

	let mediaListener
	beforeEach(() => {
		mediaListener = undefined
		window.matchMedia = vi.fn(() => ({
			addEventListener: (_, fn) => (mediaListener = fn),
			removeEventListener: vi.fn(),
		}))
	})

	it('renders header and content without a sidebar', () => {
		render(<AppShell header="Head">Main</AppShell>)
		expect(screen.getByText('Head')).toBeInTheDocument()
		expect(screen.getByText('Main')).toBeInTheDocument()
		expect(screen.queryByLabelText('Open menu')).toBeNull()
	})

	it('moves the sidebar into a drawer that closes on desktop widths', () => {
		render(
			<AppShell header="Head" sidebar={<nav>side</nav>} sidebarTitle="Nav">
				Main
			</AppShell>
		)
		fireEvent.click(screen.getByLabelText('Open menu'))
		expect(screen.getByRole('dialog', { name: 'Nav' })).toBeInTheDocument()
		act(() => mediaListener({ matches: false }))
		expect(screen.getByRole('dialog')).toBeInTheDocument()
		act(() => mediaListener({ matches: true }))
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('passes a close callback to function sidebars', () => {
		render(
			<AppShell header="h" sidebar={close => <button onClick={close}>pick</button>}>
				x
			</AppShell>
		)
		fireEvent.click(screen.getByLabelText('Open menu'))
		fireEvent.click(screen.getAllByText('pick').at(-1))
		expect(screen.queryByRole('dialog')).toBeNull()
	})
})

describe('Drawer sides and animation', () => {
	it.each([
		['top', 'top-0'],
		['bottom', 'bottom-0'],
		['left', 'left-0'],
		['right', 'right-0'],
	])('opens from the %s edge', (side, cls) => {
		render(
			<Drawer open onClose={() => {}} title="Panel" side={side}>
				body
			</Drawer>
		)
		expect(screen.getByRole('dialog')).toHaveClass(cls)
	})

	it('sizes top and bottom drawers with height, not width', () => {
		render(
			<Drawer open onClose={() => {}} title="Panel" side="top" height="max-h-40" width="max-w-xs">
				body
			</Drawer>
		)
		expect(screen.getByRole('dialog')).toHaveClass('max-h-40')
		expect(screen.getByRole('dialog')).not.toHaveClass('max-w-xs')
	})

	it('unmounts at once when not animated', () => {
		const { rerender } = render(
			<Drawer open onClose={() => {}} title="Panel">
				body
			</Drawer>
		)
		rerender(
			<Drawer open={false} onClose={() => {}} title="Panel">
				body
			</Drawer>
		)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('stays mounted for the slide-out when animated, then unmounts', () => {
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
		try {
			const { rerender } = render(
				<Drawer open animated onClose={() => {}} title="Panel">
					body
				</Drawer>
			)
			// off-screen until the entrance frames have run
			expect(screen.getByRole('dialog')).toHaveClass('translate-x-full')
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(screen.getByRole('dialog')).toHaveClass('translate-x-0')
			rerender(
				<Drawer open={false} animated onClose={() => {}} title="Panel">
					body
				</Drawer>
			)
			expect(screen.getByRole('dialog')).toHaveClass('translate-x-full')
			act(() => {
				vi.advanceTimersByTime(250)
			})
			expect(screen.queryByRole('dialog')).toBeNull()
		} finally {
			vi.useRealTimers()
		}
	})
})

describe('ActionMenu headings', () => {
	it('groups items under a heading that is not a menu item', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Actions"
				items={[
					{ key: 'h', heading: 'Page' },
					{ key: 'a', label: 'Add site' },
					{ key: 'h2', heading: 'Account' },
					{ key: 'b', label: 'Sign out' },
					{ key: 'c', label: 'Help' },
				]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(screen.getAllByRole('menuitem')).toHaveLength(3)
		expect(screen.getByRole('group', { name: 'Page' })).toHaveTextContent('Add site')
		expect(screen.getByRole('group', { name: 'Account' })).toHaveTextContent('Sign out')
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
		expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus()
	})
})

describe('ActionMenu groups with items', () => {
	it('renders an item with items as a labelled group', () => {
		render(
			<ActionMenu
				label="Actions"
				trigger="Actions"
				items={[
					{ key: 'g', label: 'Page', items: [{ key: 'a', label: 'Add site' }] },
					{ key: 'b', label: 'Help' },
				]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
		expect(screen.getAllByRole('menuitem')).toHaveLength(2)
		expect(screen.getByRole('group', { name: 'Page' })).toHaveTextContent('Add site')
	})
})
