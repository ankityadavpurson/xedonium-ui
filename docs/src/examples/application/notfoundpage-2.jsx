import { Input, NotFoundPage } from 'xedonium'

// Any status: change the code, title and description, and add your own content under the buttons
export default function Demo() {
	return (
		<NotFoundPage
			code="403"
			title="You do not have access"
			description="Ask an admin to add you to this workspace, or search for something else."
			homeHref="#dashboard"
			homeLabel="Back to the dashboard"
		>
			<div className="mt-2 w-full max-w-xs">
				<Input value="" onChange={() => {}} placeholder="Search the docs" aria-label="Search" />
			</div>
		</NotFoundPage>
	)
}
