import ThemeToggle from './ThemeToggle'

// Fills the space under the AppBar. Full-screen pages without the bar (Loader) pass `themeToggle`
// to get the toggle in the top-right corner.
const PageLayout = ({
	children,
	maxWidth = 'max-w-5xl',
	centerContent = false,
	themeToggle = false,
	outerClassName = '',
	innerClassName = '',
}) => {
	const centerClasses = centerContent ? 'flex flex-1 items-center justify-center' : ''

	return (
		<main className={`relative flex flex-1 flex-col bg-app-bg px-4 py-8 sm:py-10 ${outerClassName}`}>
			{themeToggle && (
				<div className="absolute right-4 top-4">
					<ThemeToggle />
				</div>
			)}
			<div className={`mx-auto w-full ${maxWidth} ${centerClasses} ${innerClassName}`}>{children}</div>
		</main>
	)
}

export default PageLayout
