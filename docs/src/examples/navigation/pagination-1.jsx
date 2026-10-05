import { useState } from 'react'
import { Pagination } from 'xedonium'

export default function Demo() {
	const [page, setPage] = useState(5)
	return <Pagination page={page} pageCount={12} onChange={setPage} />
}
