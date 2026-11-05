import { CodeDisplay } from 'xedonium'

const code = `import { Button } from 'xedonium'

export default function App() {
	return <Button>Bello!</Button>
}`

export default function Demo() {
	return <CodeDisplay code={code} language="jsx" lineNumbers />
}
