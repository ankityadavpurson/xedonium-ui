import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { Button, RackServer } from 'xedonium'

export default function Home() {
	const { siteConfig } = useDocusaurusContext()
	return (
		<Layout title={siteConfig.title} description={siteConfig.tagline}>
			<main className="flex flex-col items-center gap-6 px-4 py-24 text-center">
				<RackServer />
				<h1 className="m-0 text-4xl font-semibold">{siteConfig.title}</h1>
				<p className="m-0 max-w-xl text-lg">{siteConfig.tagline}</p>
				<Link to="/docs/getting-started">
					<Button>Get started</Button>
				</Link>
			</main>
		</Layout>
	)
}
