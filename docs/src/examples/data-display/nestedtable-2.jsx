import { useState } from 'react'
import { Button, NestedTable } from 'xedonium'

// Customer bills that open to the items bought, loaded when a bill is first opened
const bills = [
	{ id: 'B-1042', date: '12 Mar 2026', items: 3, total: 1840 },
	{ id: 'B-1051', date: '19 Mar 2026', items: 1, total: 420 },
	{ id: 'B-1067', date: '02 Apr 2026', items: 2, total: 960 },
]
const itemsOf = id =>
	[
		{ id: `${id}-1`, name: 'Basmati rice 5 kg', qty: 1, price: 620 },
		{ id: `${id}-2`, name: 'Sunflower oil 1 L', qty: 2, price: 180 },
		{ id: `${id}-3`, name: 'Tea 500 g', qty: 1, price: 860 },
	].slice(0, bills.find(bill => bill.id === id).items)

export default function Demo() {
	const [loading, setLoading] = useState([])
	const [loaded, setLoaded] = useState({})

	const load = bill => {
		if (loaded[bill.id]) return
		setLoading(keys => [...keys, bill.id])
		setTimeout(() => {
			setLoaded(items => ({ ...items, [bill.id]: itemsOf(bill.id) }))
			setLoading(keys => keys.filter(key => key !== bill.id))
		}, 700)
	}

	return (
		<NestedTable
			caption="Purchases"
			expandPosition="end"
			exclusive
			onExpand={load}
			loadingKeys={loading}
			rowLabel={bill => `bill ${bill.id}`}
			columns={[
				{ key: 'id', header: 'Bill' },
				{ key: 'date', header: 'Date of purchase' },
				{ key: 'items', header: 'Items', align: 'right' },
				{ key: 'total', header: 'Total', align: 'right', render: bill => `₹${bill.total}` },
			]}
			rows={bills}
			rowActions={bill => (
				<Button variant="flat" aria-label={`Print ${bill.id}`} onClick={() => window.alert(`Printing ${bill.id}`)}>
					Print
				</Button>
			)}
			renderDetails={bill => (
				<NestedTable
					nested
					caption={`Items of ${bill.id}`}
					columns={[
						{ key: 'name', header: 'Item' },
						{ key: 'qty', header: 'Qty', align: 'right' },
						{ key: 'price', header: 'Price', align: 'right', render: item => `₹${item.price}` },
					]}
					rows={loaded[bill.id] ?? []}
					empty="Loading items…"
				/>
			)}
		/>
	)
}
