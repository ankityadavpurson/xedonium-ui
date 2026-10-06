import { Link } from 'react-router-dom'
import { Button, Card, Grid, Label, RackServer, useDocumentTitle } from 'xedonium'
import VersionBadge from '../components/VersionBadge'
import { categories, pages } from '../content'

const Home = () => {
	useDocumentTitle('Xedonium')
	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col items-center gap-4 py-6 text-center">
				<RackServer />
				<h1 className="m-0 text-3xl font-bold tracking-tight text-app-text sm:text-4xl">Xedonium</h1>
				<VersionBadge className="text-lg" />
				<p className="m-0 max-w-xl text-base text-app-text">
					Minimal, theme-aware React and Tailwind components. Square corners, semantic <code>app-*</code> color tokens,
					light and dark through <code>&lt;html data-theme&gt;</code>, and no runtime dependencies.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link to="/getting-started">
						<Button>Get started</Button>
					</Link>
					<Link to="/playground">
						<Button variant="secondary">Playground</Button>
					</Link>
				</div>
			</section>
			<section className="flex flex-col gap-4">
				<Label as="h2">{pages.length} components</Label>
				<Grid cols={3} gap={4}>
					{categories.map(category => (
						<Link key={category.slug} to={`/components/${category.slug}`} className="block">
							<Card
								title={category.label}
								subtitle={`${category.components.length} components`}
								className="h-full transition hover:border-app-strong"
							>
								<span className="text-xs text-app-muted">{category.description.split('. ')[0]}</span>
							</Card>
						</Link>
					))}
				</Grid>
			</section>
		</div>
	)
}

export default Home
