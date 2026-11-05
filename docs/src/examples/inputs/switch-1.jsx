import { useState } from 'react'
import { Switch } from 'xedonium'

export default function Demo() {
	const [on, setOn] = useState(true)
	return <Switch label="Banana alerts" checked={on} onChange={setOn} />
}
