/** @type {import('tailwindcss').Config} */
export default {
	// follow the app's theme toggle rather than the OS setting
	darkMode: ['selector', '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				'app-bg': 'rgb(var(--color-app-bg) / <alpha-value>)',
				'app-card': 'rgb(var(--color-app-card) / <alpha-value>)',
				'app-border': 'rgb(var(--color-app-border) / <alpha-value>)',
				'app-text': 'rgb(var(--color-app-text) / <alpha-value>)',
				'app-muted': 'rgb(var(--color-app-muted) / <alpha-value>)',
				'app-soft': 'rgb(var(--color-app-soft) / <alpha-value>)',
				'app-strong': 'rgb(var(--color-app-strong) / <alpha-value>)',
			},
			keyframes: {
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(6px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				indeterminate: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(250%)' },
				},
			},
			animation: {
				'fade-up': 'fade-up 0.5s ease-out both',
				indeterminate: 'indeterminate 1.4s ease-in-out infinite',
			},
		},
	},
}
