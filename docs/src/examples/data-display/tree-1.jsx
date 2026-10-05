import { useState } from 'react'
import { Tree } from 'xedonium'

export default function Demo() {
	const [selected, setSelected] = useState('button')
	return (
		<Tree
			label="Files"
			selected={selected}
			onSelect={setSelected}
			defaultExpanded={['src']}
			nodes={[
				{
					key: 'src',
					label: 'src',
					children: [
						{ key: 'button', label: 'Button.jsx' },
						{ key: 'hooks', label: 'hooks', children: [{ key: 'esc', label: 'useEscapeKey.js' }] },
					],
				},
				{ key: 'readme', label: 'README.md' },
			]}
		/>
	)
}
