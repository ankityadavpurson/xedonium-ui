import { FanFavicon } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-center gap-8">
			<FanFavicon size={32} label="Loading, small" />
			<FanFavicon label="Loading" />
			<FanFavicon size={96} label="Loading, large" />
		</div>
	)
}
