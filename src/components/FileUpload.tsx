import { useId, useState } from 'react'

export interface FileUploadProps {
	label?: string
	/** Passed to the input, e.g. `image/*`. */
	accept?: string
	multiple?: boolean
	/** Receives an array of File objects. */
	onChange?: (files: File[]) => void
	disabled?: boolean
	/** Forget the selection after `onChange`, so the names are not listed and the same file can be chosen again. */
	clearOnSelect?: boolean
	/** Receives dropped files that do not match `accept`. */
	onReject?: (files: File[]) => void
}

// Same matching as the native picker: `.ext`, `type/*` and exact MIME types, comma separated
const matchesAccept = (file: File, accept?: string) => {
	const rules = (accept ?? '')
		.split(',')
		.map(rule => rule.trim().toLowerCase())
		.filter(Boolean)
	if (rules.length === 0) return true
	const name = file.name.toLowerCase()
	const type = file.type.toLowerCase()
	return rules.some(rule =>
		rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule
	)
}

/** Drop zone + file picker. `onChange` receives an array of File objects; selected names are listed below. */
const FileUpload = ({
	label = 'Choose files or drop them here',
	accept,
	multiple = false,
	onChange,
	disabled = false,
	clearOnSelect = false,
	onReject,
}: FileUploadProps) => {
	const id = useId()
	const [files, setFiles] = useState<File[]>([])
	const [dragging, setDragging] = useState(false)

	const update = (list: ArrayLike<File> | null, filter = false) => {
		let next = Array.from(list ?? [])
		if (filter) {
			const rejected = next.filter(file => !matchesAccept(file, accept))
			next = next.filter(file => matchesAccept(file, accept))
			if (rejected.length > 0) onReject?.(rejected)
			if (next.length === 0 && rejected.length > 0) return
		}
		setFiles(clearOnSelect ? [] : next)
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
					if (!disabled) update(multiple ? e.dataTransfer.files : Array.from(e.dataTransfer.files).slice(0, 1), true)
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
					onChange={e => {
						update(e.target.files)
						e.target.value = ''
					}}
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
