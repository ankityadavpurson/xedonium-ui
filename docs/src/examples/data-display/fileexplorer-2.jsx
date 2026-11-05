import { useState } from 'react'
import { CodeDisplay, FileExplorer, Modal, languageOf } from 'xedonium'

// A folder's entries come from a server one folder at a time; opening a file shows it in a full screen dialog
const server = {
	'': [
		{ id: 'gadgets', name: 'gadgets', type: 'folder', itemCount: 2 },
		{ id: 'todo', name: 'to-do.txt', type: 'file', size: 64 },
	],
	gadgets: [
		{ id: 'gadgets/freeze-ray.js', name: 'freeze-ray.js', type: 'file', size: 96 },
		{ id: 'gadgets/battery.js', name: 'battery.js', type: 'file', size: 71 },
	],
}
const contents = {
	todo: 'Buy more bananas.\nTeach Kevin to stop giggling.',
	'gadgets/freeze-ray.js': "import { charge } from './battery'\n\nconsole.log(charge(1, 2))",
	'gadgets/battery.js': 'export const charge = (a, b) => a + b',
}

export default function Demo() {
	const [tree, setTree] = useState(server[''])
	const [loading, setLoading] = useState(false)
	const [file, setFile] = useState(null)

	const openFolder = (path, folder) => {
		if (!folder || folder.children) return
		setLoading(true)
		setTimeout(() => {
			const load = nodes => nodes.map(node => (node.id === folder.id ? { ...node, children: server[folder.id] } : node))
			setTree(load)
			setLoading(false)
		}, 600)
	}

	return (
		<>
			<FileExplorer nodes={tree} loading={loading} onPathChange={openFolder} onSelect={setFile} />
			<Modal open={!!file} onClose={() => setFile(null)} title={file?.name} fullScreen>
				<CodeDisplay
					code={contents[file?.id] ?? ''}
					language={file ? languageOf(file.name) : undefined}
					lineNumbers
					maxHeight="80vh"
				/>
			</Modal>
		</>
	)
}
