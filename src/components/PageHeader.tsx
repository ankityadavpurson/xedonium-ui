import type { ReactNode } from 'react'
import Label from './Label'

export interface PageHeaderProps {
	title?: ReactNode
	subtitle?: ReactNode
	/** This page's own actions, shown at the right. */
	children?: ReactNode
}

// Page title with that page's own actions; app-wide navigation lives in AppBar
const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => (
	<div className="mb-6 flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 className="text-2xl font-bold tracking-tight text-app-text sm:text-3xl">{title}</h1>
			{subtitle && (
				<Label as="p" className="mt-0.5">
					{subtitle}
				</Label>
			)}
		</div>
		{children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
	</div>
)

export default PageHeader
