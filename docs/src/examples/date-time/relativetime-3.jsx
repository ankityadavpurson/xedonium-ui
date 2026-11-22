import { useState } from 'react'
import { RelativeTime } from 'xedonium'

const LOCALES = ['en', 'en-GB', 'fr', 'de', 'es', 'ja']

export default function Demo() {
	// the last banana heist: yesterday
	const [heist] = useState(() => Date.now() - 26 * 60 * 60 * 1000)

	return (
		<div className="flex flex-col gap-2 text-sm text-app-text">
			{LOCALES.map(locale => (
				<div key={locale} className="flex gap-3">
					<code className="w-12 text-app-muted">{locale}</code>
					<RelativeTime date={heist} locale={locale} />
				</div>
			))}
			<div className="flex gap-3">
				<code className="w-12 text-app-muted">plain</code>
				<RelativeTime date={heist} tooltip={false} />
			</div>
		</div>
	)
}
