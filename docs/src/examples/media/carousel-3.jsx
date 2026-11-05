import { Carousel } from 'xedonium'

// Custom wording: the arrows use it for the aria-label and the tooltip, the dots for their aria-label
export default function Demo() {
	const orders = ['Banana order #1042', 'Banana order #1043', 'Banana order #1044']
	return (
		<Carousel
			label="Current orders"
			previousLabel="Previous order"
			nextLabel="Next order"
			dotLabel={index => `Go to order ${index + 1}`}
			className="max-w-md"
		>
			{orders.map(order => (
				<div key={order} className="flex h-32 items-center justify-center border border-app-border bg-app-card text-sm">
					{order}
				</div>
			))}
		</Carousel>
	)
}
