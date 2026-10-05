import { Link } from 'react-router-dom'
import { PageHeader, useDocumentTitle } from 'xedonium'

const NotFound = () => {
	useDocumentTitle('Not found', 'Xedonium')
	return (
		<div className="flex flex-col gap-4">
			<PageHeader title="Page not found" subtitle="404" />
			<p className="m-0 text-sm text-app-text">
				That page does not exist.{' '}
				<Link to="/" className="underline underline-offset-2">
					Back to the docs home
				</Link>
				.
			</p>
		</div>
	)
}

export default NotFound
