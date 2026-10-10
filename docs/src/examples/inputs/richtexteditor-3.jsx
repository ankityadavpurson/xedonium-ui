import { useState } from 'react'
import { Button, RichTextEditor } from 'xedonium'

// A small toolbar, a size limit and an image upload. `onImageUpload` receives a pasted or chosen file and resolves with
// its address (here a local preview; in an app, upload the file and return its URL).
export default function Demo() {
	const [html, setHtml] = useState('')
	const [posted, setPosted] = useState(false)

	return (
		<form
			className="flex flex-col gap-3"
			onSubmit={event => {
				event.preventDefault()
				setPosted(true)
			}}
		>
			<RichTextEditor
				label="Comment"
				toolbar={['bold', 'italic', '|', 'ul', 'ol', '|', 'link', 'image']}
				value={html}
				onChange={value => {
					setHtml(value)
					setPosted(false)
				}}
				placeholder="Write a comment..."
				minHeight="8rem"
				maxHeight="16rem"
				helperText="Paste or choose an image to add it."
				onImageUpload={file => Promise.resolve(URL.createObjectURL(file))}
			/>
			<div className="flex items-center gap-3">
				<Button type="submit" disabled={html === ''}>
					Post
				</Button>
				{posted && <span className="text-sm text-app-muted">Posted.</span>}
			</div>
		</form>
	)
}
