import { useState } from 'react'
import { Switch } from 'xedonium'

export default function Demo() {
	const [on, setOn] = useState(false)
	return <Switch showState label="Nap mode" checked={on} onChange={setOn} />
}
