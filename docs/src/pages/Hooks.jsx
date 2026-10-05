import Markdown from '../components/Markdown'
import Page from './Page'

const notes = `- \`useTimedToast()\` returns \`{ toast, showToast(msg, type?) }\`; render \`<Toast toast={toast} />\` once.
- \`useEscapeKey(enabled, onEscape)\`, \`useDialogFocus(open, ref)\` (focus trap for dialogs) and \`useLeaveWarning\` (unsaved-changes prompt).
- \`useKeyboardShortcuts({ 'mod+k': fn })\`: \`mod\` is Cmd on macOS and Ctrl elsewhere; shortcuts without a modifier are ignored while typing in a field.
- \`useDismissable(open, ref, onDismiss)\`: calls \`onDismiss('outside' | 'escape')\` for outside clicks and Escape.
- \`useDocumentTitle(title, suffix)\`.
- \`ThemeProvider\` (\`storageKey\`, \`favicon\`, \`faviconTitle\`), \`useTheme()\` (\`{ activeTheme, toggleTheme }\`), \`useAppTheme\`, \`buildFaviconHref(theme)\`.`

const Hooks = () => (
	<Page title="Hooks & theme" subtitle="Utilities exported alongside the components">
		<Markdown>{notes}</Markdown>
	</Page>
)

export default Hooks
