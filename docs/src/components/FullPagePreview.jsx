import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Select } from 'xedonium'
import { LOADER_VARIANTS } from '../loaderVariants'

/** Docs-only block: pick a variant and open LoadingScreen as a whole page (see pages/LoadingScreenPreview.jsx). */
const FullPagePreview = () => {
	const [variant, setVariant] = useState('fan')
	return (
		<div className="flex flex-col gap-2 border border-app-border bg-app-card p-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
				<div className="w-full sm:w-44">
					<Select label="Variant" value={variant} onChange={setVariant} options={LOADER_VARIANTS} />
				</div>
				<Link
					to={`/preview/loading-screen?variant=${variant}`}
					className="border border-app-strong bg-app-strong px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest text-app-bg transition hover:bg-app-text"
				>
					Preview
				</Link>
			</div>
			<p className="text-xs text-app-muted">Opens it on a page of its own, without the docs around it.</p>
		</div>
	)
}

export default FullPagePreview
