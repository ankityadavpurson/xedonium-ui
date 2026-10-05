import { Label, PageHeader, useDocumentTitle } from 'xedonium'

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
	<Label as="h2" className="mt-2">
		{children}
	</Label>
)

export default Page
