import { BodyText, HelperText, Input, Label, PageTitle, TextLink } from 'xedonium'

export default function Demo() {
	return (
		<div className="flex max-w-md flex-col gap-3">
			<PageTitle>Page title</PageTitle>
			<BodyText>
				Body text uses text-sm and the primary color. Read the{' '}
				<TextLink href="https://github.com/ankityadavpurson/xedonium-ui">source on GitHub</TextLink>.
			</BodyText>
			<HelperText>Helper text is smaller and muted, for hints and captions.</HelperText>
			<div className="flex flex-col gap-1">
				<Label htmlFor="pg-email">Email</Label>
				<Input id="pg-email" type="email" placeholder="you@example.com" />
			</div>
		</div>
	)
}
