import { useId, useState } from 'react'

export interface FileUploadProps {
	label?: string
	/** Passed to the input, e.g. `image/*`. */
	accept?: string
	multiple?: boolean
	/** Receives an array of File objects. */
	onChange?: (files: File[]) => void
	disabled?: boolean
}

/** Drop zone + file picker. `onChange` receives an array of File objects; selected names are listed below. */
const FileUpload = ({
	label = 'Choose files or drop them here',
	accept,
	multiple = false,
	onChange,
	disabled = false,
}: FileUploadProps) => {
	const id = useId()
	const [files, setFiles] = useState<File[]>([])
	const [dragging, setDragging] = useState(false)

	const update = (list: ArrayLike<File> | null) => {
		const next = Array.from(list ?? [])
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
					if (!disabled) update(multiple ? e.dataTransfer.files : Array.from(e.dataTransfer.files).slice(0, 1))
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
