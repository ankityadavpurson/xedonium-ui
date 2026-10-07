import preset from '../tailwind-preset.js'

const root = import.meta.dirname

export default {
	presets: [preset],
	content: [`${root}/index.html`, `${root}/src/**/*.{js,jsx,ts,tsx}`, `${root}/../src/**/*.{js,jsx,ts,tsx}`],
}
