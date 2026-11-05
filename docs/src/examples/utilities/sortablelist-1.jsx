import { useState } from 'react'
import { SortableList } from 'xedonium'

export default function Demo() {
	const [items, setItems] = useState([
		{ key: 'a', label: 'Plan' },
		{ key: 'b', label: 'Steal the moon' },
		{ key: 'c', label: 'Eat bananas' },
	])
	return <SortableList items={items} onChange={setItems} renderItem={item => item.label} />
}
