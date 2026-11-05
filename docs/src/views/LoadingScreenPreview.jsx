import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingScreen, Select, ThemeToggle, useDocumentTitle } from 'xedonium'
import { LOADER_VARIANTS } from '../loaderVariants'

const DOCS_PAGE = '/components/feedback/loading-screen'

/**
 * LoadingScreen as a whole page, without the docs chrome: /preview/loading-screen?variant=card.
 * Switch variants or theme from the floating bar; Escape (or Back) returns to the docs page.
 */
const LoadingScreenPreview = () => {
	const [params, setParams] = useSearchParams()
	const navigate = useNavigate()
	const { key } = useLocation()
	useDocumentTitle('LoadingScreen preview', 'Xedonium')

	const requested = params.get('variant')
	const variant = LOADER_VARIANTS.some(v => v.value === requested) ? requested : 'fan'

	// `key` is "default" when this page was opened directly (new tab, reload): there is no history to go back to
	const back = () => (key === 'default' ? navigate(DOCS_PAGE) : navigate(-1))

	useEffect(() => {
		const onKeyDown = event => event.key === 'Escape' && back()
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key])

	return (
		<div className="flex min-h-screen flex-col bg-app-bg">
			<div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-end justify-between gap-3 p-4">
				<Link
					to={DOCS_PAGE}
					onClick={event => {
						event.preventDefault()
						back()
					}}
					className="border border-app-border bg-app-card px-3 py-2 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:border-app-strong"
				>
					← Back to docs
				</Link>
				<div className="flex items-end gap-2">
					<div className="w-40">
						<Select
							label="Variant"
							value={variant}
							onChange={value => setParams({ variant: value }, { replace: true })}
							options={LOADER_VARIANTS}
						/>
					</div>
					<ThemeToggle />
				</div>
			</div>
			<LoadingScreen variant={variant} description="Fetching your data" />
		</div>
	)
}

export default LoadingScreenPreview
