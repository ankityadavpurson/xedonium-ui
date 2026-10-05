import { PageTitle } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-col gap-3">
			<PageTitle>Page title</PageTitle>
			<PageTitle as="h2" className="text-xl sm:text-2xl">
				Smaller, rendered as an h2
			</PageTitle>
		</div>
	)
}
