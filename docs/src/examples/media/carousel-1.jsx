import { Carousel } from 'xedonium'

export default function Demo() {
	return (
		<Carousel label="Highlights">
			{['One', 'Two', 'Three'].map(name => (
				<div key={name} className="flex h-40 items-center justify-center text-2xl font-bold">
					{name}
				</div>
			))}
		</Carousel>
	)
}
