import { Carousel } from 'xedonium'

// Custom wording: the arrows use it for the aria-label and the tooltip, the dots for their aria-label
export default function Demo() {
	const orders = ['Order #1042', 'Order #1043', 'Order #1044']
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
