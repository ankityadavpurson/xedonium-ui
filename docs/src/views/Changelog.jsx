import { Link } from 'react-router-dom'
import { Markdown } from 'xedonium'
import changelog from '../../../CHANGELOG.md?raw'
import Page from './Page'

const REPO = 'https://github.com/ankityadavpurson/xedonium-ui/blob/main/'

// The page supplies its own title and intro, and repo-relative links (CONTRIBUTING.md#...) must point at GitHub
const body = changelog
	.replace(/^# Changelog\s+[\s\S]*?(?=^## )/m, '')
	.replace(/^## \[Unreleased\]\s*(?=^## )/m, '') // an empty Unreleased section right after a release
	.replace(/^## \[([^\]]+)\]/gm, '## $1')
	.replace(/\]\((?!https?:|\/|#)([^)]+)\)/g, `](${REPO}$1)`)

const Changelog = () => (
	<Page title="Changelog" subtitle="What changed in each release of Xedonium.">
		<Markdown linkComponent={Link} linkProp="to" openLinksInNewTab>
			{body}
		</Markdown>
	</Page>
)

export default Changelog
