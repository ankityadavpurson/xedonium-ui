import { useState } from 'react'
import { Button, PasswordInput, PasswordStrengthInfo, passwordRules } from 'xedonium'

// Your own rules replace the built-in ones: mix ready-made rules (passwordRules) with a rule of your own
const rules = [
	passwordRules.minLength(10),
	passwordRules.digit,
	passwordRules.noSpaces,
	passwordRules.notContaining(['xedonium', 'password'], 'Not "password" or the product name'),
	{ label: 'A symbol such as ! or ?', test: password => /[!?@#$%&*]/.test(password), required: false },
]

export default function Demo() {
	const [password, setPassword] = useState('')
	const [valid, setValid] = useState(false)

	return (
		<div className="flex max-w-sm flex-col gap-3">
			<PasswordInput label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
			<PasswordStrengthInfo password={password} rules={rules} onResult={result => setValid(result.valid)} />
			<Button disabled={!valid}>Create account</Button>
		</div>
	)
}
