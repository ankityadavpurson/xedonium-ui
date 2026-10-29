import { fireEvent, render, screen } from '@testing-library/react'
import ContextMenu from '../../src/components/ContextMenu'

const setup = (props = {}) => {
	const onClick = vi.fn()
	const onOpenChange = vi.fn()
	render(
		<ContextMenu
			label="Actions"
			onOpenChange={onOpenChange}
			items={[
				{ key: 'copy', label: 'Copy', onClick },
				{ key: 'del', label: 'Delete', tone: 'danger' },
			]}
			{...props}
		>
			<div data-testid="area">area</div>
		</ContextMenu>
	)
	return { onClick, onOpenChange }
}

describe('ContextMenu', () => {
	it('is closed until the area is right-clicked', () => {
		setup()
		expect(screen.queryByRole('menu')).toBeNull()
		fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 })
		expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument()
	})

	it('cancels the browser menu', () => {
		setup()
		const allowed = fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 })
		expect(allowed).toBe(false)
	})

	it('runs an item and closes', () => {
		const { onClick, onOpenChange } = setup()
		fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 })
		fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }))
		expect(onClick).toHaveBeenCalledTimes(1)
		expect(screen.queryByRole('menu')).toBeNull()
		expect(onOpenChange).toHaveBeenLastCalledWith(false)
	})

	it('closes on Escape and on an outside click', () => {
		setup()
		fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 })
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
		expect(screen.queryByRole('menu')).toBeNull()
		fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 })
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('leaves the browser menu alone when disabled', () => {
		setup({ disabled: true })
		const allowed = fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 })
		expect(allowed).toBe(true)
		expect(screen.queryByRole('menu')).toBeNull()
	})
})
