import { Button, useTheme } from 'xedonium'

export default function Demo() {
	const { activeTheme, toggleTheme } = useTheme()
	return (
		<div className="flex items-center gap-3">
			<span className="text-sm">
				Active theme: <strong>{activeTheme}</strong>
			</span>
			<Button variant="secondary" onClick={toggleTheme}>
				Toggle
			</Button>
		</div>
	)
}
