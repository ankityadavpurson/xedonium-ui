import { lazy } from 'react'

// Page metadata is cheap and drives the sidebar and routes; each page loads when it is opened.
export const foundations = [
	{ path: '/foundations/theme', title: 'Theme', Page: lazy(() => import('./ThemePage')) },
	{ path: '/foundations/colors', title: 'Colors & tokens', Page: lazy(() => import('./ColorsPage')) },
	{ path: '/foundations/typography', title: 'Typography', Page: lazy(() => import('./TypographyPage')) },
	{ path: '/foundations/icons', title: 'Icons', Page: lazy(() => import('./IconsPage')) },
]
