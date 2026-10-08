import { useTheme } from '../theme/ThemeContext'
import Button from './Button'
import MonitorIcon from './icons/Monitor'
import Tooltip from './Tooltip'
import toolbarButtonClass from './toolbarButtonClass'

const MoonIcon = () => (
	<svg
		aria-hidden="true"
		focusable="false"
		className="h-4 w-4 text-app-soft"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
	>
		<path strokeLinecap="square" strokeLinejoin="miter" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
	</svg>
)

const SunIcon = () => (
	<svg
		aria-hidden="true"
		focusable="false"
		className="h-4 w-4 text-yellow-600"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.8"
	>
		<circle cx="12" cy="12" r="4" />
		<path
			strokeLinecap="square"
			d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
		/>
	</svg>
)

// Icon-only theme switch. With `allowSystem` on the ThemeProvider it cycles device / light / dark and shows a
// monitor icon while following the device. `variant="toolbar"` matches the borderless Home toolbar,
// the default matches the bordered secondary buttons used on Admin / Apps Health.
export interface ThemeToggleProps {
	/** `toolbar` is borderless (for an AppBar); the default is a bordered secondary button. */
	variant?: 'button' | 'toolbar'
}

const ThemeToggle = ({ variant = 'button' }: ThemeToggleProps) => {
	const { activeTheme, themeMode, allowSystem, toggleTheme } = useTheme()
	const isDark = activeTheme === 'dark'
	const following = allowSystem && themeMode === 'system'
	const next = allowSystem
		? themeMode === 'system'
			? 'light'
			: themeMode === 'light'
				? 'dark'
				: 'system'
		: isDark
			? 'light'
			: 'dark'
	const label = next === 'system' ? 'Follow the device theme' : `Switch to ${next} theme`
	const icon = following ? <MonitorIcon /> : isDark ? <MoonIcon /> : <SunIcon />

	if (variant === 'toolbar') {
		return (
			<Tooltip text={label}>
				<button type="button" onClick={toggleTheme} aria-label={label} className={toolbarButtonClass(false)}>
					{icon}
				</button>
			</Tooltip>
		)
	}

	return (
		<Button onClick={toggleTheme} tooltip={label} aria-label={label} variant="secondary">
			{icon}
		</Button>
	)
}

export default ThemeToggle
