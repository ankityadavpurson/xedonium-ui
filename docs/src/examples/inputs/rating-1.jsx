import { useState } from 'react'
import { Rating } from 'xedonium'

export default function Demo() {
	const [stars, setStars] = useState(3)
	const [half, setHalf] = useState(2.5)

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<Rating label="Your rating" value={stars} onChange={setStars} />
				<span className="text-xs text-app-muted">{stars} of 5</span>
			</div>
			<div className="flex items-center gap-3">
				<Rating label="Half stars" value={half} onChange={setHalf} precision={0.5} size="lg" />
				<span className="text-xs text-app-muted">{half} of 5</span>
			</div>
			<Rating label="Average review" value={4.5} precision={0.5} readOnly size="sm" />
			<Rating label="Out of ten" defaultValue={7} max={10} />
			<div className="flex flex-wrap items-center gap-3">
				<Rating label="Gold" value={4} color="warning" readOnly />
				<Rating label="Danger" value={3} color="danger" readOnly />
				<Rating label="Success" value={5} color="success" readOnly />
				<Rating label="Custom" value={3.5} precision={0.5} color="#2563eb" readOnly />
			</div>
			<Rating label="Disabled" value={2} disabled />
		</div>
	)
}
