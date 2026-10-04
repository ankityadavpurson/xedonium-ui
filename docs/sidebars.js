/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
	docs: [
		'intro',
		'getting-started',
		{ type: 'category', label: 'Components', items: ['components/button', 'components/field', 'components/overlays', 'components/navigation', 'components/loaders'] },
		'hooks',
	],
}

export default sidebars
