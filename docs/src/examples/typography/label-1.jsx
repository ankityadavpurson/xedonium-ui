import { Input, Label } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex max-w-xs flex-col gap-4">
			<Label>Plain label (a span)</Label>
			<div className="flex flex-col gap-1">
				<Label htmlFor="email-example">Email</Label>
				<Input id="email-example" type="email" placeholder="you@example.com" />
			</div>
		</div>
	)
}
