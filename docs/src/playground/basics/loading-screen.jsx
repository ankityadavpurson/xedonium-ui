import { useState } from 'react'
import { LoadingScreen, Select } from 'xedonium'

const VARIANTS = ['fan', 'spinner', 'dots', 'shimmer', 'inline', 'stacked', 'card'].map(value => ({
	value,
	label: value,
}))

// LoadingScreen fills its parent, so it is shown here inside a box with a fixed height
export default function Demo() {
	const [variant, setVariant] = useState('fan')

	return (
		<div className="flex flex-col gap-4">
			<div className="w-44">
				<Select label="Variant" value={variant} onChange={setVariant} options={VARIANTS} />
			</div>
			<div className="flex h-64 flex-col border border-app-border">
				<LoadingScreen variant={variant} description="Fetching your data" />
			</div>
		</div>
	)
}
