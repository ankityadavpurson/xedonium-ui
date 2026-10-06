import { useState } from 'react'
import { TextArea } from 'xedonium'

export default function Demo() {
	const [bio, setBio] = useState('')
	return (
		<div className="max-w-sm">
			<TextArea label="Bio" value={bio} onChange={setBio} maxLength={120} placeholder="Tell us about yourself" />
		</div>
	)
}
