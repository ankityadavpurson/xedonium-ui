import { useId, useState } from 'react'

/** Drop zone + file picker. `onChange` receives an array of File objects; selected names are listed below. */
const FileUpload = ({ label = 'Choose files or drop them here', accept, multiple = false, onChange, disabled = false }) => {
	const id = useId()
	const [files, setFiles] = useState([])
	const [dragging, setDragging] = useState(false)

	const update = list => {
		const next = [...list]
		setFiles(next)
		onChange?.(next)
	}

	return (
		<div className="flex flex-col gap-2">
			<label
				htmlFor={id}
				onDragOver={e => {
					e.preventDefault()
					if (!disabled) setDragging(true)
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={e => {
					e.preventDefault()
					setDragging(false)
					if (!disabled) update(multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]].filter(Boolean))
				}}
				className={`flex flex-col items-center justify-center gap-1 border border-dashed px-4 py-8 text-center text-sm text-app-muted transition focus-within:ring-2 focus-within:ring-app-strong ${
					dragging ? 'border-app-strong bg-app-soft/10' : 'border-app-border bg-app-bg'
				} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-app-strong'}`}
			>
				{label}
				<input
					id={id}
					type="file"
					accept={accept}
					multiple={multiple}
					disabled={disabled}
					className="sr-only"
					onChange={e => update(e.target.files)}
				/>
			</label>
			{files.length > 0 && (
				<ul className="m-0 list-none p-0 text-xs text-app-soft">
					{files.map(file => (
						<li key={`${file.name}-${file.size}`}>{file.name}</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default FileUpload
