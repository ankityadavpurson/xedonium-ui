import { Button, useTheme } from 'xedonium'

export default function Demo() {
	const { activeTheme, themeMode, setThemeMode, toggleTheme } = useTheme()
	return (
		<div className="flex items-center gap-3">
			<span className="text-sm">
				Active theme: <strong>{activeTheme}</strong> (mode: {themeMode})
			</span>
			<Button variant="secondary" onClick={toggleTheme}>
				Toggle
			</Button>
			<Button variant="secondary" onClick={() => setThemeMode('system')}>
				Use device theme
			</Button>
		</div>
	)
}
