import type { ReactNode } from 'react'
import Grid from './Grid'
import PageHeader from './PageHeader'
import StatCard, { type StatCardProps } from './StatCard'

export interface DashboardProps {
	title?: ReactNode
	subtitle?: ReactNode
	actions?: ReactNode
	stats?: StatCardProps[]
	/** Columns of the panel grid (1-3). */
	columns?: 1 | 2 | 3
	children?: ReactNode
}

/**
 * Dashboard page scaffold: header, a row of stat tiles, then your panels (Cards, charts, tables) in a grid.
 * stats: [{ label, value, delta?, trend?, hint? }]. `columns` sets the panel grid (1-3).
 */
const Dashboard = ({ title, subtitle, actions, stats = [], columns = 2, children }: DashboardProps) => (
	<div className="flex flex-col gap-6">
		{title && (
			<PageHeader title={title} subtitle={subtitle}>
				{actions}
			</PageHeader>
		)}
		{stats.length > 0 && (
			<Grid cols={Math.min(stats.length, 4) as 1 | 2 | 3 | 4} gap={4}>
				{stats.map(stat => (
					<StatCard key={String(stat.label)} {...stat} />
				))}
			</Grid>
		)}
		{children && (
			<Grid cols={columns} gap={4}>
				{children}
			</Grid>
		)}
	</div>
)

export default Dashboard
