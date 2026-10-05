import { Button, Card } from 'xedonium'

export default function Demo() {
	return (
		<Card
			title="Server"
			subtitle="eu-west-1"
			actions={<Button variant="secondary">Edit</Button>}
			footer="Updated 2 min ago"
		>
			Healthy, 3 of 3 checks passing.
		</Card>
	)
}
