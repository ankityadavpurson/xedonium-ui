export default {
	slug: 'typography',
	label: 'Typography',
	description: 'Text styles as components: page title, body, helper text, label and link.',
	components: [
		{
			slug: 'page-title',
			name: 'PageTitle',
			blocks: [
				{ md: 'Page heading. Bold with tight tracking: `text-2xl` on phones and `text-3xl` from the `sm` breakpoint.' },
				{ example: 1 },
			],
		},
		{
			slug: 'body-text',
			name: 'BodyText',
			blocks: [{ md: 'Body copy in `text-sm` and the primary text color.' }, { example: 1 }],
		},
		{
			slug: 'helper-text',
			name: 'HelperText',
			blocks: [
				{ md: 'Secondary text for hints, captions and descriptions: `text-xs` in the muted color.' },
				{ example: 1 },
			],
		},
		{
			slug: 'label',
			name: 'Label',
			blocks: [
				{
					md: 'Small, bold, uppercase, widely tracked label. Pass `htmlFor` to get a real `<label>` for a form control; without it you get a `<span>`.',
				},
				{ example: 1 },
			],
		},
		{
			slug: 'text-link',
			name: 'TextLink',
			blocks: [
				{
					md: 'Underlined inline link with a hover color. `linkComponent` / `linkProp` swap in a router link, like `AppBar`.',
				},
				{ example: 1 },
			],
		},
	],
}
