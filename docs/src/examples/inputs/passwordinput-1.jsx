import { useState } from 'react'
import { PasswordInput } from 'xedonium'

export default function Demo() {
	const [password, setPassword] = useState('')
	return (
		<div className="max-w-sm">
			<PasswordInput
				label="Password"
				value={password}
				onChange={setPassword}
				autoComplete="new-password"
				error={password && password.length < 8 ? 'Use at least 8 characters' : ''}
			/>
		</div>
	)
}
