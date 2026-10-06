import { Loader } from 'xedonium'

const VARIANTS = ['fan', 'spinner', 'dots', 'shimmer', 'inline', 'stacked', 'card']

export default function Demo() {
	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{VARIANTS.map(variant => (
				<div key={variant} className="flex min-h-32 flex-col items-center gap-3 border border-app-border bg-app-bg p-4">
					<div className="flex w-full flex-1 items-center justify-center">
						<Loader variant={variant} description="Fetching your data" />
					</div>
					<code className="text-xs text-app-muted">{variant}</code>
				</div>
			))}
		</div>
	)
}
