import { PageHeader, useDocumentTitle } from 'xedonium'

// Shared wrapper for the hand-written guide pages
const Page = ({ title, subtitle, children }) => {
	useDocumentTitle(title, 'Xedonium')
	return (
		<article className="flex flex-col gap-6">
			<PageHeader title={title} subtitle={subtitle} />
			{children}
		</article>
	)
}

export const H2 = ({ children }) => (
	<h2 className="m-0 mt-2 text-xs font-semibold uppercase tracking-widest text-app-muted">{children}</h2>
)

export default Page
