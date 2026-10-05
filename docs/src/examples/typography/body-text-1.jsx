import { BodyText } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex flex-col gap-2">
			<BodyText>Body text uses text-sm and the app-text color.</BodyText>
			<BodyText as="div" className="font-semibold">
				Any element via the as prop, with extra classes.
			</BodyText>
		</div>
	)
}
