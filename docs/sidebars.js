/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
	docs: [
		'intro',
		'getting-started',
		{
			type: 'category',
			label: 'Foundations',
			items: ['foundations/theme', 'foundations/colors', 'foundations/typography', 'foundations/icons'],
		},
		{
			type: 'category',
			label: 'Components',
			items: [
				'components/layout',
				'components/button',
				'components/inputs',
				'components/field',
				'components/navigation',
				'components/feedback',
				'components/overlays',
				'components/data-display',
				'components/media',
				'components/loaders',
				'components/utilities',
			],
		},
		'hooks',
	],
}

export default sidebars
