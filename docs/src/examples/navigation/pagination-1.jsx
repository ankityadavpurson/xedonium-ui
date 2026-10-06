import { useState } from 'react'
import { Pagination } from 'xedonium'

const TOTAL = 240

export default function Demo() {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	return (
		<Pagination
			page={page}
			pageCount={Math.ceil(TOTAL / pageSize)}
			onChange={setPage}
			pageSize={pageSize}
			pageSizeOptions={[10, 25, 50]}
			onPageSizeChange={size => {
				setPageSize(size)
				setPage(1)
			}}
		/>
	)
}
