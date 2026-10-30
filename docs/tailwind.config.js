import preset from '../tailwind-preset.js'

const root = import.meta.dirname

export default {
	presets: [preset],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Archivo', 'Helvetica', 'Arial', 'sans-serif'],
				// what VS Code uses for code: Consolas on Windows, Menlo on macOS, Droid Sans Mono on Linux
				code: ['Consolas', 'Menlo', 'Monaco', '"Droid Sans Mono"', '"Courier New"', 'monospace'],
			},
		},
	},
	content: [`${root}/index.html`, `${root}/src/**/*.{js,jsx,ts,tsx}`, `${root}/../src/**/*.{js,jsx,ts,tsx}`],
}
