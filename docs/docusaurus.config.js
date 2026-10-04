// @ts-check
import { themes as prismThemes } from 'prism-react-renderer'

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Xedonium',
	tagline: 'Minimal, theme-aware React + Tailwind UI components',
	favicon: 'img/favicon.ico',
	future: { v4: true },

	url: 'https://xedonium.example.com',
	baseUrl: '/',

	onBrokenLinks: 'throw',
	i18n: { defaultLocale: 'en', locales: ['en'] },

	plugins: ['./plugins/xedonium.cjs'],
	themes: ['@docusaurus/theme-live-codeblock'],

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: { sidebarPath: './sidebars.js' },
				blog: false,
				theme: { customCss: './src/css/custom.css' },
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			colorMode: { respectPrefersColorScheme: true },
			navbar: {
				title: 'Xedonium',
				logo: { alt: 'Xedonium', src: 'img/logo.svg' },
				items: [{ type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' }],
			},
			footer: { style: 'dark', copyright: `MIT © ${new Date().getFullYear()} Xedonium. Built with Docusaurus.` },
			prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
			liveCodeBlock: { playgroundPosition: 'bottom' },
		}),
}

export default config
