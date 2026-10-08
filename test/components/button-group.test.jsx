import { render, screen } from '@testing-library/react'
import Button from '../../src/components/Button'
import ButtonGroup from '../../src/components/ButtonGroup'

describe('ButtonGroup', () => {
	it('is a labelled group around its buttons', () => {
		render(
			<ButtonGroup aria-label="View">
				<Button>Day</Button>
				<Button>Week</Button>
			</ButtonGroup>
		)
		const group = screen.getByRole('group', { name: 'View' })
		expect(group).toHaveClass('inline-flex', 'flex-row')
		expect(group.querySelectorAll('button')).toHaveLength(2)
	})

	it('joins the buttons by default and raises the active one', () => {
		render(<ButtonGroup aria-label="a" />)
		const cls = screen.getByRole('group').className
		expect(cls).toContain('[&>*:not(:first-child)]:-ml-px')
		expect(cls).toContain('[&>*[aria-pressed=true]]:z-10')
	})

	it('stacks vertically with a top overlap instead', () => {
		render(<ButtonGroup orientation="vertical" aria-label="a" />)
		const group = screen.getByRole('group')
		expect(group).toHaveClass('flex-col')
		expect(group.className).toContain('-mt-px')
		expect(group.className).not.toContain('-ml-px')
	})

	it('keeps a gap and no shared borders when not attached', () => {
		render(<ButtonGroup attached={false} aria-label="a" />)
		const group = screen.getByRole('group')
		expect(group).toHaveClass('gap-2', 'flex-row')
		expect(group.className).not.toContain('-ml-px')
		render(<ButtonGroup attached={false} orientation="vertical" aria-label="b" />)
		expect(screen.getByRole('group', { name: 'b' })).toHaveClass('gap-2', 'flex-col')
	})

	it('stretches to the container and passes other props through', () => {
		render(<ButtonGroup fullWidth className="extra" data-x="1" aria-label="a" />)
		const group = screen.getByRole('group')
		expect(group).toHaveClass('flex', 'w-full', 'extra')
		expect(group.className).toContain('[&>*]:flex-1')
		expect(group).toHaveAttribute('data-x', '1')
	})
})
