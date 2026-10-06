import { buildFaviconHref } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			{['light', 'dark'].map(theme => (
				<figure key={theme} className="m-0 flex flex-col items-center gap-1">
					<img src={buildFaviconHref(theme)} alt="" width={48} height={48} />
					<figcaption className="text-xs text-app-muted">{theme}</figcaption>
				</figure>
			))}
		</div>
	)
}
