import * as Xedonium from 'xedonium'
import { Flex } from 'xedonium'
import { Code } from '../components/Markdown'
import Markdown from '../components/Markdown'
import Page, { H2 } from '../pages/Page'

const ICONS = Object.entries(Xedonium).filter(([name]) => name.endsWith('Icon'))

const IconsPage = () => (
	<Page title="Icons" subtitle={`${ICONS.length} inline SVGs`}>
		<Markdown>
			Icons are inline SVGs that inherit `currentColor`. Pass `className` to size or color them (the defaults vary per
			icon).
		</Markdown>
		<H2>All icons</H2>
		<Flex wrap gap={6} className="text-app-text">
			{ICONS.map(([name, Icon]) => (
				<div key={name} className="flex w-28 flex-col items-center gap-2">
					<Icon className="h-6 w-6" />
					<Code>{name}</Code>
				</div>
			))}
		</Flex>
	</Page>
)

export default IconsPage
