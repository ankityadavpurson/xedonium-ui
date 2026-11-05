import { useRef, useState } from 'react'
import { Button, Input, Modal } from 'xedonium'

// A form dialog: full screen on phones, native validation off, and focus on the first field via `initialFocusRef`
export default function Demo() {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const nameRef = useRef(null)
	return (
		<>
			<Button onClick={() => setOpen(true)}>New mission</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="New mission"
				as="form"
				noValidate
				fullScreenBelow="sm"
				initialFocusRef={nameRef}
				onSubmit={event => {
					event.preventDefault()
					setOpen(false)
				}}
				footer={<Button type="submit">Create</Button>}
			>
				<div className="px-6 py-4">
					<Input ref={nameRef} aria-label="Mission name" placeholder="Mission name" value={name} onChange={setName} />
				</div>
			</Modal>
		</>
	)
}
