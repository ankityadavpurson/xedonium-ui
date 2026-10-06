import { useId } from 'react'
import Button from './Button'
import ButtonLink from './ButtonLink'

/**
 * "Page not found" screen: a large status code, a title, a short explanation and the way out (a link home and,
 * with `onBack`, a "go back" button). It is not tied to 404: pass `code`, `title` and `description` for a 403, 500
 * or "coming soon" page. `children` render under the buttons (a search box, a list of suggestions...).
 * `homeHref={null}` hides the home link; `linkComponent` / `linkProp` swap in a router link, as in ButtonLink.
 * `fullScreen` centers it in the whole viewport, otherwise it fills the space it is given.
 */
const NotFoundPage = ({
	code = '404',
	title = 'Page not found',
	description = 'The page you are looking for does not exist or has moved.',
	homeHref = '/',
	homeLabel = 'Go home',
	onBack,
	backLabel = 'Go back',
	linkComponent,
	linkProp,
	fullScreen = false,
	className = '',
	children,
}) => {
	const titleId = useId()
	return (
		<section
			aria-labelledby={titleId}
			className={`flex flex-col items-center justify-center gap-4 px-4 py-16 text-center ${
				fullScreen ? 'min-h-screen' : ''
			} ${className}`}
		>
			<p aria-hidden="true" className="m-0 text-7xl font-bold tracking-widest text-app-border sm:text-8xl">
				{code}
			</p>
			<h1 id={titleId} className="m-0 text-xl font-semibold text-app-text sm:text-2xl">
				<span className="sr-only">{code}: </span>
				{title}
			</h1>
			{description && <p className="m-0 max-w-md text-sm text-app-muted">{description}</p>}
			{(homeHref !== null || onBack) && (
				<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
					{homeHref !== null && (
						<ButtonLink href={homeHref} linkComponent={linkComponent} linkProp={linkProp}>
							{homeLabel}
						</ButtonLink>
					)}
					{onBack && (
						<Button variant="secondary" onClick={onBack}>
							{backLabel}
						</Button>
					)}
				</div>
			)}
			{children}
		</section>
	)
}

export default NotFoundPage
