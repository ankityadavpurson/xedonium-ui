import { Loader } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-col gap-6">
			{['fan', 'spinner', 'inline'].map(variant => (
				<div key={variant} className="flex flex-wrap items-center gap-8">
					<code className="w-16 text-xs text-app-muted">{variant}</code>
					<Loader variant={variant} size="sm" label="Loading, small" />
					<Loader variant={variant} size="md" label="Loading" />
					<Loader variant={variant} size="lg" label="Loading, large" />
				</div>
			))}
		</div>
	)
}
