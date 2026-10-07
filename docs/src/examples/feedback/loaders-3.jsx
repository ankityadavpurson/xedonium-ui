import { Loader } from 'xedonium'

const SVG =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" fill="#f5b301"/></svg>'
	)

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-10">
			<Loader variant="stacked" icon="🚀" iconMotion="bounce" label="Launching" />
			<Loader variant="inline" icon={SVG} label="Image or SVG URL" />
			<Loader variant="card" icon="⏳" iconMotion="pulse" label="Crunching" description="Emoji with pulse" />
			<Loader
				icon={
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
						<circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
						<path d="M12 7v5l3 2" />
					</svg>
				}
				label="Inline SVG element"
			/>
		</div>
	)
}
