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
		{
			slug: 'markdown',
			name: 'Markdown',
			blocks: [
				{
					md: 'Renders GitHub-style Markdown with the library own components and no Markdown dependency: headings, paragraphs, `**bold**`, `*italic*`, `~~strikethrough~~`, links, images, ordered, unordered and nested lists, task lists (`- [x]`), quotes, tables with alignment, rules and fenced code (shown with `CodeDisplay`, so it is colored by language and can be copied). Pass the source as `children`.\n\n**Safe for text you do not control.** HTML in the source stays literal text (`<script>` is just text), and links and images whose URL is unsafe (`javascript:`, `data:` and other schemes) are shown as plain text; only `http`, `https`, `mailto`, `tel`, relative paths and `#anchors` pass. Nothing is ever injected as HTML.',
				},
				{
					example: 1,
				},
				{
					md: '**Links.** Links starting with `/` go through `linkComponent` / `linkProp` (for react-router: `linkComponent={Link} linkProp="to"`), the rest are plain `<a>`. Change which links count as internal with `isInternalLink`, and open external ones in a new tab with `openLinksInNewTab` (they always get `rel="noopener noreferrer"`). Headings get an `id` from their text so `#anchor` links work; turn it off with `headingIds={false}`.\n\nTry it below: edit the Markdown on the left and the result updates.',
				},
				{
					example: 2,
				},
			],
		},
	],
}
