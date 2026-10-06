import { useState } from 'react'
import { FileUpload } from 'xedonium'

export default function Demo() {
	const [files, setFiles] = useState([])

	return (
		<div className="flex flex-col gap-3">
			<FileUpload multiple onChange={setFiles} />
			<span className="text-xs text-app-muted">{files.length} file(s) picked</span>
		</div>
	)
}
