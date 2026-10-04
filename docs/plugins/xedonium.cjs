const path = require('node:path')

const dist = path.resolve(__dirname, '../../dist')

// Consume the library's built output (run `yarn build` in the repo root first; the docs scripts do it for you)
// and style it with the library's Tailwind preset.
module.exports = function xedoniumPlugin() {
	return {
		name: 'xedonium',
		configureWebpack() {
			return {
				resolve: {
					alias: {
						'xedonium/styles.css': path.join(dist, 'styles.css'),
						xedonium: path.join(dist, 'xedonium.js'),
						// the library lives outside docs/, so pin React to one copy
						react: path.dirname(require.resolve('react/package.json')),
						'react-dom': path.dirname(require.resolve('react-dom/package.json')),
					},
				},
			}
		},
		configurePostCss(postcssOptions) {
			postcssOptions.plugins.push(require('tailwindcss')({ config: path.resolve(__dirname, '../tailwind.config.mjs') }))
			return postcssOptions
		},
	}
}
