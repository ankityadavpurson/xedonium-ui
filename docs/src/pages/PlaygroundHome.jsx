import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Grid, Label } from 'xedonium'
import { DemoBoundary } from '../components/Example'
import { categories, findPage, pathOf } from '../content'
import { exampleKey, lazyDemo } from '../exampleLoader'
import { BASICS, playgroundPath } from '../playground'
import summaryOf from '../summaryOf'
import Page from './Page'

const basics = BASICS.map(([category, component]) => findPage(category, component)).filter(Boolean)

// A live, small version of the component's first docs example (it loads on its own, without the editor)
const Preview = ({ category, component }) => {
	const Demo = lazyDemo(exampleKey(category, component, 1))
	return (
		<div data-preview className="max-h-56 overflow-auto border border-app-border bg-app-bg p-4">
			<DemoBoundary>
				<Suspense fallback={<p className="m-0 text-xs text-app-muted">Loading…</p>}>{Demo && <Demo />}</Suspense>
			</DemoBoundary>
		</div>
	)
}

// The Playground's front door: ten basic components to try first, and a way into every category.
// (The live editors themselves are on /playground/<category>, a separate chunk, so this page stays light.)
const PlaygroundHome = () => (
	<Page title="Playground" subtitle="Edit the code, see it run">
		<p className="m-0 max-w-2xl text-sm text-app-text">
			Every docs example is live here: open a component, change its code and the result updates as you type. Start with
			one of the basics below, or browse a whole category.
		</p>
		<section className="flex flex-col gap-4">
			<Label as="h2">Start with the basics</Label>
			<Grid cols={2} gap={4}>
				{basics.map(({ category, component }) => (
					<Card
						key={`${category.slug}/${component.slug}`}
						title={component.name}
						subtitle={category.label}
						className="h-full"
						footer={
							<div className="flex flex-wrap items-center gap-3">
								<Link to={playgroundPath(category, component)}>
									<Button variant="secondary">Open in Playground</Button>
								</Link>
								<Link
									to={pathOf(category, component)}
									className="text-xs font-semibold uppercase tracking-widest text-app-muted transition hover:text-app-text"
								>
									Docs
								</Link>
							</div>
						}
					>
						<div className="flex flex-col gap-3">
							<span className="text-xs text-app-muted">{summaryOf(component)}</span>
							<Preview category={category} component={component} />
						</div>
					</Card>
				))}
			</Grid>
		</section>
		<section className="flex flex-col gap-4">
			<Label as="h2">Browse by category</Label>
			<Grid cols={3} gap={3}>
				{categories.map(category => (
					<Link key={category.slug} to={`/playground/${category.slug}`} className="block">
						<Card
							title={category.label}
							subtitle={`${category.components.length} components`}
							className="h-full transition hover:border-app-strong"
						>
							<span className="text-xs text-app-muted">
								{category.components
									.map(c => c.name)
									.slice(0, 4)
									.join(', ')}
								…
							</span>
						</Card>
					</Link>
				))}
			</Grid>
		</section>
	</Page>
)

export default PlaygroundHome
