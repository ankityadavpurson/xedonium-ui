import { useState } from 'react'
import { Checkbox } from 'xedonium'

export default function Demo() {
	const [agree, setAgree] = useState(false)
	const [admin, setAdmin] = useState(true)
	return (
		<div className="flex flex-col gap-3">
			<Checkbox label="I agree" checked={agree} onChange={setAgree} />
			<Checkbox label="Administrator" description="Can manage users and billing" checked={admin} onChange={setAdmin} />
		</div>
	)
}
