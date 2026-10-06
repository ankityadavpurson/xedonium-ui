import { Button, Card, StatCard } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-wrap items-stretch gap-3">
			<StatCard label="Visits" value="1,204" delta="+12%" trend="up" hint="vs last week" />
			<StatCard label="Errors" value="8" delta="-3" trend="down" />
			<StatCard label="Uptime" value="99.9%" />
			<Card
				title="Card"
				subtitle="With header and footer"
				actions={<Button variant="secondary">Edit</Button>}
				footer="Footer"
			>
				Body content
			</Card>
		</div>
	)
}
