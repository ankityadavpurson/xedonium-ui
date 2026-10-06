import { ThemeToggle } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex items-center gap-3">
			<ThemeToggle />
			<ThemeToggle variant="toolbar" />
		</div>
	)
}
