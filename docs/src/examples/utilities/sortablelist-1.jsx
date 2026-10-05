import { useState } from 'react'
import { SortableList } from 'xedonium'

export default function Demo() {
	const [items, setItems] = useState([
		{ key: 'a', label: 'Design' },
		{ key: 'b', label: 'Build' },
		{ key: 'c', label: 'Ship' },
	])
	return <SortableList items={items} onChange={setItems} renderItem={item => item.label} />
}
