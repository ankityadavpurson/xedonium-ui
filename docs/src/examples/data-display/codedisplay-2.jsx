import { CodeDisplay } from 'xedonium'

const code = `// Custom palette
const answer = 42
export const greet = name => \`Hello \${name}\``

export default function Demo() {
	return (
		<CodeDisplay
			code={code}
			language="js"
			colors={{
				background: '#0f172a',
				text: '#e2e8f0',
				comment: '#64748b',
				keyword: '#f472b6',
				string: '#fbbf24',
				number: '#38bdf8',
			}}
		/>
	)
}
