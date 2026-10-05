import { Link } from 'react-router-dom'
import { Button, Card, Grid, RackServer, useDocumentTitle } from 'xedonium'
import { categories, pages } from '../content'

const Home = () => {
	useDocumentTitle('Xedonium')
	return (
		<div className="flex flex-col gap-10">
			<section className="flex flex-col items-start gap-4 py-6">
				<RackServer />
				<h1 className="m-0 text-3xl font-bold tracking-tight text-app-text sm:text-4xl">Xedonium</h1>
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
				<h2 className="m-0 text-xs font-semibold uppercase tracking-widest text-app-muted">
					{pages.length} components
				</h2>
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
