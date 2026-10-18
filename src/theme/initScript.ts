import type { ThemeMode } from '../types'
import { DEFAULT_THEME_STORAGE_KEY } from './constants'

export interface ThemeInitScriptOptions {
	/** Must match the `storageKey` of your ThemeProvider. */
	storageKey?: string
	/** Must match the `defaultTheme` of your ThemeProvider (default `system`). */
	defaultTheme?: ThemeMode
}

/**
 * JavaScript source that sets `<html data-theme>` before the first paint, using the same rules as ThemeProvider: the
 * saved choice, else `defaultTheme`, with `system` resolved from the device. Put it in an inline `<script>` in the
 * document head (for example `_document` in Next.js) so a stored or default theme shows without a flash while the app
 * hydrates. Values are JSON-encoded, so any `storageKey` is safe to embed.
 */
export const getThemeInitScript = ({
	storageKey = DEFAULT_THEME_STORAGE_KEY,
	defaultTheme = 'system',
}: ThemeInitScriptOptions = {}): string =>
	`(function(){try{var k=${JSON.stringify(storageKey)},d=${JSON.stringify(defaultTheme)},s=localStorage.getItem(k),` +
	`m=s==='light'||s==='dark'||s==='system'?s:d,` +
	`t=m==='light'||m==='dark'?m:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';` +
	`document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`
