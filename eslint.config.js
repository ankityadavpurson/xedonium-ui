import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{ ignores: ['dist', 'docs/dist', 'coverage'] },
	js.configs.recommended,
	...tseslint.configs.recommended.map(config => ({ ...config, files: ['src/**/*.{ts,tsx}'] })),
	{
		files: ['src/**/*.{js,jsx,ts,tsx}', 'docs/src/**/*.{js,jsx}', 'test/**/*.{js,jsx}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.vitest },
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		settings: { react: { version: 'detect' } },
		plugins: { react, 'react-hooks': reactHooks },
		rules: {
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			'react/prop-types': 'off',
		},
	},
	{
		files: ['scripts/**/*.{js,mjs}', '*.config.js', 'docs/*.config.js', 'tailwind-preset.js'],
		languageOptions: { globals: globals.node },
	},
]
