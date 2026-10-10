import { useState } from 'react'
import { CodeDisplay, FileExplorer, Modal, languageOf } from 'xedonium'

// A folder's entries come from a server one folder at a time; opening a file shows it in a full screen dialog
const server = {
	'': [
		{ id: 'src', name: 'src', type: 'folder', itemCount: 2 },
		{ id: 'notes', name: 'notes.txt', type: 'file', size: 64 },
	],
	src: [
		{ id: 'src/index.js', name: 'index.js', type: 'file', size: 96 },
		{ id: 'src/util.js', name: 'util.js', type: 'file', size: 71 },
	],
}
const contents = {
	notes: 'Remember to rotate the API keys.\nReview the pull request.',
	'src/index.js': "import { sum } from './util'\n\nconsole.log(sum(1, 2))",
	'src/util.js': 'export const sum = (a, b) => a + b',
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
