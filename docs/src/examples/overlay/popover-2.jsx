import { useState } from 'react'
import { ActionMenu, DatePicker, Popover, Select } from 'xedonium'

// The container clips its own overflow, yet every panel opens in full: they are portalled to <body>
export default function Demo() {
	const [date, setDate] = useState(null)
	const [color, setColor] = useState('')

	return (
		<div className="flex h-24 flex-wrap items-start gap-4 overflow-hidden border border-dashed border-app-border p-3">
			<ActionMenu
				label="Actions"
				trigger="Menu"
				items={[
					{ key: 'a', label: 'Rename', onClick: () => {} },
					{ key: 'b', label: 'Duplicate', description: 'Make a copy', onClick: () => {} },
					{ key: 'c', label: 'Delete', tone: 'warning', onClick: () => {} },
				]}
			/>
			<Popover trigger="Popover" label="Popover" placement="bottom-start">
				<p className="m-0 w-48 max-w-full">Not clipped by the box around it.</p>
			</Popover>
			<Popover trigger="Opens up" label="Opens up" placement="top-start">
				<p className="m-0 w-48 max-w-full">Preferred side: top.</p>
			</Popover>
			<div className="w-44 max-w-full">
				<DatePicker value={date} onChange={setDate} />
			</div>
			<div className="w-40 max-w-full">
				<Select
					value={color}
					onChange={setColor}
					placeholder="Pick a color"
					options={[
						{ value: 'red', label: 'Red' },
						{ value: 'green', label: 'Green' },
						{ value: 'blue', label: 'Blue' },
					]}
				/>
			</div>
		</div>
	)
}
