import { useState } from 'react'
import { Checkbox } from 'xedonium'

export default function Demo() {
	const [agree, setAgree] = useState(false)
	const [admin, setAdmin] = useState(true)
	return (
		<div className="flex flex-col gap-3">
			<Checkbox label="I agree to love bananas" checked={agree} onChange={setAgree} />
			<Checkbox
				label="Boss Minion"
				description="Can command Minions and manage the banana budget"
				checked={admin}
				onChange={setAdmin}
			/>
		</div>
	)
}
