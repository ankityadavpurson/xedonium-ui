import { useState } from 'react'
import { NumberField } from 'xedonium'

export default function Demo() {
	const [guests, setGuests] = useState(2)
	const [price, setPrice] = useState(9.5)

	return (
		<div className="flex max-w-xs flex-col gap-4">
			<NumberField label="Minions" value={guests} onChange={setGuests} min={1} max={10} helperText="Between 1 and 10" />
			<NumberField label="Banana price" value={price} onChange={setPrice} step={0.25} min={0} />
			<p className="m-0 text-xs text-app-muted">
				{guests} Minions, {price} per banana
			</p>
		</div>
	)
}
