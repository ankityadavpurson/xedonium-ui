import { Input, NotFoundPage } from 'xedonium'

// Any status: change the code, title and description, and add your own content under the buttons
export default function Demo() {
	return (
		<NotFoundPage
			code="403"
			title="Only Gru can go in here"
			description="Ask Gru to add you to the Minion crew, or go and look for bananas instead."
			homeHref="#lair"
			homeLabel="Back to the lair"
		>
			<div className="mt-2 w-full max-w-xs">
				<Input value="" onChange={() => {}} placeholder="Search for bananas" aria-label="Search" />
			</div>
		</NotFoundPage>
	)
}
