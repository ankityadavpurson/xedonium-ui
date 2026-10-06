import { AppBar, Button, NotFoundPage, PageHeader, PageLayout } from 'xedonium'

// A whole page in miniature: AppBar on top, PageLayout filling the rest, PageHeader at the start of the content
export default function Demo() {
	return (
		<div className="flex h-80 flex-col overflow-auto border border-app-border">
			<AppBar
				brand="My App"
				hideBrandOnMobile
				links={[
					{ href: '#', label: 'Apps', active: true },
					{ href: '#admin', label: 'Admin' },
				]}
			/>
			<PageLayout maxWidth="max-w-2xl">
				<PageHeader title="Dashboard" subtitle="Everything at a glance">
					<Button variant="secondary">Action</Button>
				</PageHeader>
				<p className="m-0 text-sm text-app-text">Page content goes here.</p>
				<NotFoundPage className="!py-8" homeHref="#home" />
			</PageLayout>
		</div>
	)
}
