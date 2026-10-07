// Compile-time checks, run by `yarn typecheck` (not by vitest): the published prop types accept what they should and
// reject what they should. Every `@ts-expect-error` below fails the typecheck if the line starts to compile.
import { Accordion, Button, DataGrid, Loader, Select, Toast, useTimedToast } from '../src'
import type { AccordionProps, LoaderProps, SelectOption } from '../src'

const options: SelectOption[] = [{ value: 'a', label: 'A' }]

export const valid = (
	<>
		<Accordion items={[{ key: 'a', title: 'A' }]} gap="md" multiple />
		<Loader variant="spinner" size="sm" icon="🚀" iconMotion="bounce" />
		<Select value="a" onChange={value => value.toUpperCase()} options={options} variant="flat" />
		<Button variant="danger" tooltip="Hi" tooltipPlacement="top-end" onClick={() => {}} />
		<Toast position="top-center" toasts={[{ msg: 'Saved', type: 'success' }]} />
		<DataGrid<{ id: number; name: string }>
			rows={[{ id: 1, name: 'Ada' }]}
			columns={[{ key: 'name', header: 'Name', render: row => row.name.toUpperCase() }]}
		/>
	</>
)

export const props: [AccordionProps['gap'], LoaderProps['variant']] = ['lg', 'card']

export const invalid = (
	<>
		{/* @ts-expect-error gap is one of none | sm | md | lg */}
		<Accordion items={[]} gap="huge" />
		{/* @ts-expect-error variant is a fixed list */}
		<Loader variant="rainbow" />
		{/* @ts-expect-error items is required */}
		<Accordion />
		{/* @ts-expect-error unknown position */}
		<Toast position="somewhere" />
		{/* @ts-expect-error Select options need a value */}
		<Select options={[{ label: 'No value' }]} />
	</>
)

export const useIt = () => {
	const { showToast, hideToast } = useTimedToast(2000, { max: 3 })
	const id = showToast('Done', 'warning', { actions: [{ label: 'Undo', onClick: () => {} }] })
	hideToast(id)
	// @ts-expect-error not a toast type
	showToast('Done', 'purple')
}
