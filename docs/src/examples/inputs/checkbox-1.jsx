import { useState } from 'react'
import { Checkbox } from 'xedonium'

export default function Demo() {
	const [agree, setAgree] = useState(false)
	return <Checkbox label="I agree" checked={agree} onChange={setAgree} />
}
