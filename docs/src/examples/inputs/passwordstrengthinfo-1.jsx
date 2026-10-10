import { useState } from 'react'
import { PasswordInput, PasswordStrengthInfo } from 'xedonium'

export default function Demo() {
	const [password, setPassword] = useState('')
	return (
		<div className="flex max-w-sm flex-col gap-3">
			<PasswordInput label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
			<PasswordStrengthInfo password={password} />
		</div>
	)
}
