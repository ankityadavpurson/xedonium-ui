import { useState } from 'react'
import { Calendar, Carousel, Pagination } from 'xedonium'

export default function Demo() {
	const [page, setPage] = useState(3)
	const [date, setDate] = useState(new Date())

	return (
		<div className="flex flex-wrap items-start gap-3">
			<Pagination page={page} pageCount={12} onChange={setPage} />
			<Calendar value={date} onChange={setDate} />
			<div className="w-80">
				<Carousel>
					{['One', 'Two', 'Three'].map(t => (
						<div key={t} className="flex h-40 items-center justify-center bg-app-bg text-lg font-semibold">
							Slide {t}
						</div>
					))}
				</Carousel>
			</div>
		</div>
	)
}
