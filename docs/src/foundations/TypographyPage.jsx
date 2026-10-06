import { Link } from 'react-router-dom'
import { BodyText, HelperText, Label, PageTitle, TextLink } from 'xedonium'
import CodeBlock from '../components/CodeBlock'
import Markdown from '../components/Markdown'
import Page, { H2 } from '../pages/Page'

// Each style is a library component: preview, the JSX to copy, and the page that documents it
const TYPE_STYLES = [
	{
		name: 'Page title',
		to: '/components/typography/page-title',
		code: '<PageTitle>Page title</PageTitle>',
		preview: <PageTitle>Page title</PageTitle>,
	},
	{
		name: 'Body',
		to: '/components/typography/body-text',
		code: '<BodyText>Body text uses text-sm and the app-text color.</BodyText>',
		preview: <BodyText>Body text uses text-sm and the app-text color.</BodyText>,
	},
	{
		name: 'Helper text',
		to: '/components/typography/helper-text',
		code: '<HelperText>Helper text uses text-xs and app-muted.</HelperText>',
		preview: <HelperText>Helper text uses text-xs and app-muted.</HelperText>,
	},
	{
		name: 'Label',
		to: '/components/typography/label',
		code: '<Label>Label</Label>',
		preview: <Label>Label</Label>,
	},
	{
		name: 'Link',
		to: '/components/typography/text-link',
		code: '<TextLink href="#">Link</TextLink>',
		preview: <TextLink href="#">Link</TextLink>,
	},
]

const TypographyPage = () => (
	<Page title="Typography" subtitle="Type scale">
		<Markdown>
			The library inherits your font family. Each text style below is a component; click a name for its props and
			examples, or copy the markup.
		</Markdown>
		{TYPE_STYLES.map(({ name, to, code, preview }) => (
			<section key={name} className="flex flex-col gap-2">
				<H2>
					<Link to={to} className="underline-offset-2 hover:underline">
						{name}
					</Link>
				</H2>
				<div className="border border-app-border bg-app-bg p-4">{preview}</div>
				<CodeBlock code={code} />
			</section>
		))}
	</Page>
)

export default TypographyPage
