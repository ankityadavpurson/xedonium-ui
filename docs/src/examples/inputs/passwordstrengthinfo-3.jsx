import { useState } from 'react'
import { Button, PasswordInput, PasswordStrengthInfo } from 'xedonium'

// The strength info appears while the password field has focus and tucks away when you leave it.
// The input and the info share a wrapper: focus anywhere inside it keeps the info open.
export default function Demo() {
	const [password, setPassword] = useState('')
	const [valid, setValid] = useState(false)

	return (
		<div className="flex max-w-sm flex-col gap-3">
			<div className="flex flex-col gap-3">
				<PasswordInput label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
				<PasswordStrengthInfo password={password} showOn="focus" onResult={result => setValid(result.valid)} />
			</div>
			<Button disabled={!valid}>Create account</Button>
		</div>
	)
}
