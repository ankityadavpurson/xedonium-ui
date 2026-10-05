import { useState } from 'react'
import { Tabs } from 'xedonium'
import CodeBlock from './CodeBlock'

const MANAGERS = [
	{ key: 'npm', command: 'npm install xedonium' },
	{ key: 'yarn', command: 'yarn add xedonium' },
	{ key: 'pnpm', command: 'pnpm add xedonium' },
]

const STORAGE_KEY = 'xedonium-docs-package-manager'

const readChoice = () => {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		return MANAGERS.some(m => m.key === stored) ? stored : 'npm'
	} catch {
		return 'npm'
	}
}

/** Install command for npm, yarn or pnpm; the last choice is remembered between visits. */
const InstallTabs = () => {
	const [manager, setManager] = useState(readChoice)

	const choose = key => {
		setManager(key)
		try {
			window.localStorage.setItem(STORAGE_KEY, key)
		} catch {
			// storage blocked: the choice just isn't remembered
		}
	}

	return (
		<Tabs
			value={manager}
			onChange={choose}
			items={MANAGERS.map(({ key, command }) => ({
				key,
				label: key,
				content: <CodeBlock code={command} lang="bash" />,
			}))}
		/>
	)
}

export default InstallTabs
