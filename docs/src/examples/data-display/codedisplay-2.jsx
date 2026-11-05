import { CodeDisplay } from 'xedonium'

const code = `// Custom palette
const bananas = 42
export const greet = name => \`Bello \${name}\``

export default function Demo() {
	return (
		<CodeDisplay
			code={code}
			language="js"
			colors={{
				background: '#0f172a',
				text: '#e2e8f0',
				comment: '#94a3b8',
				keyword: '#f472b6',
				string: '#fbbf24',
				number: '#38bdf8',
			}}
		/>
	)
}
