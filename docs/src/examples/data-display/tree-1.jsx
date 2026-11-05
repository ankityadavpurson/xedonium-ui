import { useState } from 'react'
import { Tree } from 'xedonium'

export default function Demo() {
	const [selected, setSelected] = useState('button')
	return (
		<Tree
			label="Lair files"
			selected={selected}
			onSelect={setSelected}
			defaultExpanded={['src']}
			nodes={[
				{
					key: 'src',
					label: 'lair',
					children: [
						{ key: 'button', label: 'Banana.jsx' },
						{ key: 'hooks', label: 'gadgets', children: [{ key: 'esc', label: 'useFreezeRay.js' }] },
					],
				},
				{ key: 'readme', label: 'plans.md' },
			]}
		/>
	)
}
