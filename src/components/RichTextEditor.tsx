import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type ClipboardEvent,
	type FormEvent,
	type KeyboardEvent,
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
	type RefObject,
} from 'react'
import useDismissable from '../hooks/useDismissable'
import useEscapeKey from '../hooks/useEscapeKey'
import type { SelectOption } from '../types'
import {
	applyStyle,
	caretIn,
	clearFormat,
	currentRange,
	emptyState,
	ensureBlocks,
	exitEmptyListItem,
	insertHr,
	insertHtml,
	insertImage,
	insertLink,
	insertTable,
	queryState,
	removeLink,
	setAlign,
	setBlock,
	toggleInline,
	toggleList,
	toggleQuote,
	type Alignment,
	type BlockTag,
	type EditorState,
	type InlineTag,
} from '../utils/richtext/commands'
import { htmlToMarkdown, markdownToHtml } from '../utils/richtext/convert'
import {
	captureSelection,
	createHistory,
	restoreSelection,
	type History,
	type SelectionPath,
} from '../utils/richtext/history'
import {
	columnWidth,
	ensureColumns,
	imageWidth,
	lastColumnIndex,
	MIN_SIZE,
	nearRightBorder,
	setColumnWidth,
	setImageWidth,
} from '../utils/richtext/resize'
import sanitizeHtml from '../utils/richtext/sanitize'
import FloatingPanel from './FloatingPanel'
import HelperText from './HelperText'
import Label from './Label'
import Select from './Select'
import Tooltip from './Tooltip'
import AlignCenterIcon from './icons/AlignCenter'
import AlignJustifyIcon from './icons/AlignJustify'
import AlignLeftIcon from './icons/AlignLeft'
import AlignRightIcon from './icons/AlignRight'
import BoldIcon from './icons/Bold'
import CodeIcon from './icons/Code'
import FileCodeIcon from './icons/FileCode2'
import HighlighterIcon from './icons/Highlighter'
import ImageIcon from './icons/Image'
import ItalicIcon from './icons/Italic'
import LinkIcon from './icons/Link'
import ListIcon from './icons/List'
import ListOrderedIcon from './icons/ListOrdered'
import MaximizeIcon from './icons/Maximize'
import MinimizeIcon from './icons/Minimize'
import MinusIcon from './icons/Minus'
import PaletteIcon from './icons/Palette'
import QuoteIcon from './icons/Quote'
import RedoIcon from './icons/Redo2'
import RemoveFormattingIcon from './icons/RemoveFormatting'
import StrikethroughIcon from './icons/Strikethrough'
import TableIcon from './icons/Table'
import UnderlineIcon from './icons/Underline'
import UndoIcon from './icons/Undo2'
import UnlinkIcon from './icons/Unlink'
import inputClass from './inputClass'
import toolbarButtonClass from './toolbarButtonClass'

export type ToolbarItem =
	| 'undo'
	| 'redo'
	| 'block'
	| 'bold'
	| 'italic'
	| 'underline'
	| 'strike'
	| 'code'
	| 'color'
	| 'highlight'
	| 'link'
	| 'unlink'
	| 'image'
	| 'ul'
	| 'ol'
	| 'quote'
	| 'codeblock'
	| 'hr'
	| 'table'
	| 'left'
	| 'center'
	| 'right'
	| 'justify'
	| 'fullscreen'
	| 'clear'
	/** A divider between groups of buttons. */
	| '|'

export interface RichTextEditorProps {
	/** The content (controlled): HTML, or Markdown when `format="markdown"`. */
	value?: string
	/** The initial content when uncontrolled. */
	defaultValue?: string
	/** Called with the new content as it is edited. Empty content is `''`. */
	onChange?: (value: string) => void
	/** What `value` holds: sanitized `html` (the default) or `markdown`. Markdown has no underline, colors or alignment. */
	format?: 'html' | 'markdown'
	/** The buttons, in order (`'|'` is a divider), or `false` for none. Defaults to all that the format supports. */
	toolbar?: ToolbarItem[] | false
	placeholder?: string
	label?: ReactNode
	/** Error message shown below the editor; sets the invalid style. */
	error?: ReactNode
	/** Hint shown under the editor while there is no `error`. */
	helperText?: ReactNode
	/** Minimum height of the writing area (default `12rem`). A number is px. */
	minHeight?: number | string
	/** Maximum height of the writing area; it scrolls beyond it. A number is px. */
	maxHeight?: number | string
	disabled?: boolean
	/** Show the content without the toolbar and without editing. */
	readOnly?: boolean
	/** Fill the whole window (controlled). The page behind does not scroll, and Escape leaves it. */
	fullScreen?: boolean
	/** Start full screen when `fullScreen` is not set. */
	defaultFullScreen?: boolean
	/** Called when the full screen button (or Escape) switches it. */
	onFullScreenChange?: (fullScreen: boolean) => void
	/**
	 * Called with an image file that was chosen with the Upload button or pasted; resolve with its URL to insert it.
	 * Without it the image is embedded in the content itself as a `data:` address (see `maxInlineImageSize`).
	 */
	onImageUpload?: (file: File) => Promise<string>
	/** Largest image, in bytes, that is embedded when there is no `onImageUpload` (default 2 MB). Bigger ones are refused. */
	maxInlineImageSize?: number
	/** Name for a hidden input that carries the value in a native `<form>`. */
	name?: string
	className?: string
}

export const DEFAULT_TOOLBAR: ToolbarItem[] = [
	'undo',
	'redo',
	'|',
	'block',
	'|',
	'bold',
	'italic',
	'underline',
	'strike',
	'code',
	'|',
	'color',
	'highlight',
	'|',
	'ul',
	'ol',
	'quote',
	'codeblock',
	'|',
	'left',
	'center',
	'right',
	'justify',
	'|',
	'link',
	'unlink',
	'image',
	'table',
	'hr',
	'|',
	'clear',
	'|',
	'fullscreen',
]

/** What Markdown has no way to write down. */
const NOT_IN_MARKDOWN = new Set<ToolbarItem>(['underline', 'color', 'highlight', 'left', 'center', 'right', 'justify'])

const TEXT_COLORS = ['#111827', '#6b7280', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777']
const HIGHLIGHTS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#e5e7eb']

const CONTENT_CLASS = [
	'[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
	'[&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:font-semibold [&_h5]:my-2 [&_h5]:text-sm [&_h5]:font-semibold [&_h6]:my-2 [&_h6]:text-sm [&_h6]:font-semibold',
	'[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5',
	'[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-app-border [&_blockquote]:pl-4 [&_blockquote]:text-app-muted',
	'[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:border [&_pre]:border-app-border [&_pre]:bg-app-card [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs',
	'[&_code]:border [&_code]:border-app-border [&_code]:bg-app-card [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] [&_pre_code]:border-0 [&_pre_code]:p-0',
	'[&_a]:underline [&_a]:underline-offset-2 [&_img]:my-2 [&_img]:h-auto [&_img]:max-w-full [&_img]:cursor-pointer [&_hr]:my-4 [&_hr]:border-app-border',
	'[&_table]:my-3 [&_table]:max-w-full [&_table:not([width])]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-app-border [&_td]:p-2 [&_th]:border [&_th]:border-app-border [&_th]:bg-app-card [&_th]:p-2 [&_th]:text-left',
].join(' ')

const size = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value)

/** True when the html has no text and nothing else worth keeping. */
const isBlank = (html: string) =>
	!/<(img|hr|table)/i.test(html) &&
	!html
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.trim()

/** Adds `https://` to what looks like a web address without a scheme. */
const withScheme = (url: string) => {
	const trimmed = url.trim()
	return trimmed && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(trimmed) && /^[^\s/]+\.[^\s/]+/.test(trimmed)
		? `https://${trimmed}`
		: trimmed
}

const plainTextToHtml = (text: string) =>
	text
		.split(/\n{2,}/)
		.map(
			paragraph =>
				`<p>${paragraph.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`
		)
		.join('')

type PanelKind = 'color' | 'highlight' | 'link' | 'image' | 'table'

interface ItemMeta {
	label: string
	shortcut?: string
	icon: ReactNode
}

const ICON = 'h-4 w-4'
const META: Record<Exclude<ToolbarItem, '|' | 'block'>, ItemMeta> = {
	undo: { label: 'Undo', shortcut: 'Ctrl+Z', icon: <UndoIcon className={ICON} /> },
	redo: { label: 'Redo', shortcut: 'Ctrl+Y', icon: <RedoIcon className={ICON} /> },
	bold: { label: 'Bold', shortcut: 'Ctrl+B', icon: <BoldIcon className={ICON} /> },
	italic: { label: 'Italic', shortcut: 'Ctrl+I', icon: <ItalicIcon className={ICON} /> },
	underline: { label: 'Underline', shortcut: 'Ctrl+U', icon: <UnderlineIcon className={ICON} /> },
	strike: { label: 'Strikethrough', icon: <StrikethroughIcon className={ICON} /> },
	code: { label: 'Inline code', icon: <CodeIcon className={ICON} /> },
	color: { label: 'Text color', icon: <PaletteIcon className={ICON} /> },
	highlight: { label: 'Highlight', icon: <HighlighterIcon className={ICON} /> },
	link: { label: 'Link', shortcut: 'Ctrl+K', icon: <LinkIcon className={ICON} /> },
	unlink: { label: 'Remove link', icon: <UnlinkIcon className={ICON} /> },
	image: { label: 'Image', icon: <ImageIcon className={ICON} /> },
	ul: { label: 'Bulleted list', icon: <ListIcon className={ICON} /> },
	ol: { label: 'Numbered list', icon: <ListOrderedIcon className={ICON} /> },
	quote: { label: 'Quote', icon: <QuoteIcon className={ICON} /> },
	codeblock: { label: 'Code block', icon: <FileCodeIcon className={ICON} /> },
	hr: { label: 'Horizontal rule', icon: <MinusIcon className={ICON} /> },
	table: { label: 'Table', icon: <TableIcon className={ICON} /> },
	left: { label: 'Align left', icon: <AlignLeftIcon className={ICON} /> },
	center: { label: 'Align center', icon: <AlignCenterIcon className={ICON} /> },
	right: { label: 'Align right', icon: <AlignRightIcon className={ICON} /> },
	justify: { label: 'Justify', icon: <AlignJustifyIcon className={ICON} /> },
	fullscreen: { label: 'Full screen', icon: <MaximizeIcon className={ICON} /> },
	clear: { label: 'Clear formatting', icon: <RemoveFormattingIcon className={ICON} /> },
}

const BLOCK_OPTIONS: SelectOption[] = [
	{ value: 'p', label: 'Paragraph' },
	{ value: 'h1', label: 'Heading 1' },
	{ value: 'h2', label: 'Heading 2' },
	{ value: 'h3', label: 'Heading 3' },
	{ value: 'h4', label: 'Heading 4' },
	{ value: 'pre', label: 'Code block' },
]

const INLINE: Partial<Record<ToolbarItem, InlineTag>> = {
	bold: 'strong',
	italic: 'em',
	underline: 'u',
	strike: 's',
	code: 'code',
}

const smallButton =
	'inline-flex h-8 items-center justify-center border border-app-border bg-app-bg px-3 text-xs font-semibold uppercase tracking-widest text-app-text transition hover:border-app-strong disabled:cursor-not-allowed disabled:opacity-50'

/** `2 MB`, `150 KB` or `20 bytes`. */
const readableSize = (bytes: number) =>
	bytes >= 1_000_000
		? `${Number((bytes / 1_000_000).toFixed(1))} MB`
		: bytes >= 1000
			? `${Math.round(bytes / 1000)} KB`
			: `${bytes} bytes`

interface ImageOverlayProps {
	image: HTMLImageElement
	wrapper: HTMLElement
	/** Called while and after the size changes, so the editor can follow along. */
	onSize: (done: boolean) => void
	onRemove: () => void
}

const WIDTH_PRESETS: [string, string | null][] = [
	['25%', '25%'],
	['50%', '50%'],
	['100%', '100%'],
	['Original', null],
]

/** A frame around the selected image with a corner handle to drag, and buttons for common widths. */
const ImageOverlay = ({ image, wrapper, onSize, onRemove }: ImageOverlayProps) => {
	const box = image.getBoundingClientRect()
	const origin = wrapper.getBoundingClientRect()
	const style = { top: box.top - origin.top, left: box.left - origin.left, width: box.width, height: box.height }

	const drag = (event: ReactMouseEvent) => {
		event.preventDefault()
		const startX = event.clientX
		const startWidth = imageWidth(image)
		const move = (next: MouseEvent) => {
			setImageWidth(image, startWidth + next.clientX - startX)
			onSize(false)
		}
		const up = () => {
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mouseup', up)
			onSize(true)
		}
		document.addEventListener('mousemove', move)
		document.addEventListener('mouseup', up)
	}

	return (
		<div
			role="group"
			aria-label="Image size"
			style={style}
			className="pointer-events-none absolute z-10 border-2 border-app-strong"
		>
			<div className="pointer-events-auto absolute -top-9 left-0 flex border border-app-border bg-app-card shadow-md">
				{WIDTH_PRESETS.map(([name, width]) => (
					<button
						key={name}
						type="button"
						aria-label={`Image width ${name}`}
						onMouseDown={event => event.preventDefault()}
						onClick={() => {
							setImageWidth(image, width)
							onSize(true)
						}}
						className="h-8 px-2 text-xs font-semibold text-app-text outline-none transition hover:bg-app-bg focus-visible:ring-2 focus-visible:ring-app-strong"
					>
						{name}
					</button>
				))}
				<button
					type="button"
					aria-label="Remove image"
					onMouseDown={event => event.preventDefault()}
					onClick={onRemove}
					className="h-8 border-l border-app-border px-2 text-xs font-semibold text-red-700 outline-none transition hover:bg-app-bg focus-visible:ring-2 focus-visible:ring-app-strong dark:text-red-400"
				>
					Remove
				</button>
			</div>
			<div
				role="separator"
				aria-label="Drag to resize the image"
				onMouseDown={drag}
				className="pointer-events-auto absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-nwse-resize border border-app-bg bg-app-strong"
			/>
		</div>
	)
}

/** A problem worth telling the reader about (not one thrown by the app's own upload). */
class ImageProblem extends Error {}

const readAsDataUrl = (file: File) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(String(reader.result))
		reader.onerror = () => reject(new ImageProblem('The image could not be read.'))
		reader.readAsDataURL(file)
	})

interface PanelProps {
	state: EditorState
	hasSelection: boolean
	/** Turns a chosen image file into an address: uploaded by the app, or embedded. */
	uploadImage: (file: File) => Promise<string>
	onDone: () => void
	onClose: () => void
	run: (command: (root: HTMLElement) => unknown) => void
}

const Swatches = ({
	colors,
	label,
	onPick,
}: {
	colors: string[]
	label: string
	onPick: (color: string | null) => void
}) => (
	<div className="flex flex-col gap-2">
		<div className="grid grid-cols-5 gap-1.5">
			{colors.map(color => (
				<button
					key={color}
					type="button"
					aria-label={`${label} ${color}`}
					onClick={() => onPick(color)}
					style={{ backgroundColor: color }}
					className="h-6 w-6 border border-app-border outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-app-strong"
				/>
			))}
		</div>
		<button type="button" onClick={() => onPick(null)} className={smallButton}>
			None
		</button>
	</div>
)

const LinkPanel = ({ state, hasSelection, onDone, onClose, run }: PanelProps) => {
	const [url, setUrl] = useState(state.link ?? '')
	const [text, setText] = useState('')
	const [problem, setProblem] = useState(false)
	const submit = (event: FormEvent) => {
		event.preventDefault()
		let ok = false
		run(root => {
			ok = insertLink(root, withScheme(url), text.trim() || undefined)
		})
		if (ok) onDone()
		else setProblem(true)
	}
	return (
		<form onSubmit={submit} className="flex w-72 flex-col gap-2">
			<Label htmlFor="rte-link-url">Address</Label>
			<input
				id="rte-link-url"
				autoFocus
				value={url}
				onChange={event => {
					setUrl(event.target.value)
					setProblem(false)
				}}
				placeholder="https://"
				aria-invalid={problem}
				className={inputClass(problem)}
			/>
			{!hasSelection && !state.link && (
				<>
					<Label htmlFor="rte-link-text">Text</Label>
					<input
						id="rte-link-text"
						value={text}
						onChange={event => setText(event.target.value)}
						className={inputClass()}
					/>
				</>
			)}
			{problem && (
				<span className="text-xs text-red-700 dark:text-red-400">Enter a web, mail or relative address.</span>
			)}
			<div className="flex gap-2">
				<button type="submit" className={smallButton}>
					{state.link ? 'Update' : 'Insert'}
				</button>
				<button type="button" onClick={onClose} className={smallButton}>
					Cancel
				</button>
			</div>
		</form>
	)
}

const ImagePanel = ({ uploadImage, onDone, onClose, run }: PanelProps) => {
	const [src, setSrc] = useState('')
	const [alt, setAlt] = useState('')
	const [problem, setProblem] = useState<string | null>(null)
	const [busy, setBusy] = useState(false)
	const insert = (address: string) => {
		let ok = false
		run(root => {
			ok = insertImage(root, address.trim(), alt.trim())
		})
		if (ok) onDone()
		else setProblem('Enter a web or relative address.')
	}
	const upload = async (file: File | undefined) => {
		if (!file) return
		setBusy(true)
		try {
			insert(await uploadImage(file))
		} catch (failure) {
			setProblem(failure instanceof ImageProblem ? failure.message : 'The upload failed.')
		} finally {
			setBusy(false)
		}
	}
	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				insert(src)
			}}
			className="flex w-72 flex-col gap-2"
		>
			<Label htmlFor="rte-image-src">Image address</Label>
			<input
				id="rte-image-src"
				autoFocus
				value={src}
				onChange={event => {
					setSrc(event.target.value)
					setProblem(null)
				}}
				placeholder="https://"
				className={inputClass(!!problem)}
			/>
			<Label htmlFor="rte-image-alt">Description</Label>
			<input id="rte-image-alt" value={alt} onChange={event => setAlt(event.target.value)} className={inputClass()} />
			{problem && <span className="text-xs text-red-700 dark:text-red-400">{problem}</span>}
			<div className="flex flex-wrap gap-2">
				<button type="submit" disabled={busy} className={smallButton}>
					Insert
				</button>
				<label className={`${smallButton} cursor-pointer`}>
					{busy ? 'Uploading...' : 'Upload'}
					<input type="file" accept="image/*" hidden onChange={event => void upload(event.target.files?.[0])} />
				</label>
				<button type="button" onClick={onClose} className={smallButton}>
					Cancel
				</button>
			</div>
		</form>
	)
}

const TablePanel = ({ onDone, onClose, run }: PanelProps) => {
	const [rows, setRows] = useState(3)
	const [columns, setColumns] = useState(3)
	const clamp = (value: string) => Math.min(20, Math.max(1, Number(value) || 1))
	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				run(root => insertTable(root, rows, columns))
				onDone()
			}}
			className="flex w-56 flex-col gap-2"
		>
			<div className="flex gap-2">
				<div className="flex flex-1 flex-col gap-1">
					<Label htmlFor="rte-table-rows">Rows</Label>
					<input
						id="rte-table-rows"
						autoFocus
						type="number"
						min={1}
						max={20}
						value={rows}
						onChange={event => setRows(clamp(event.target.value))}
						className={inputClass()}
					/>
				</div>
				<div className="flex flex-1 flex-col gap-1">
					<Label htmlFor="rte-table-columns">Columns</Label>
					<input
						id="rte-table-columns"
						type="number"
						min={1}
						max={20}
						value={columns}
						onChange={event => setColumns(clamp(event.target.value))}
						className={inputClass()}
					/>
				</div>
			</div>
			<div className="flex gap-2">
				<button type="submit" className={smallButton}>
					Insert
				</button>
				<button type="button" onClick={onClose} className={smallButton}>
					Cancel
				</button>
			</div>
		</form>
	)
}

/**
 * **Beta:** new and still being tested; its props and the HTML it produces may change before it is declared stable.
 *
 * A WYSIWYG editor with no dependencies: a formatting toolbar over an editable area. Edit rich text as `html` (the
 * default; always sanitized, so a script, an event handler or a `javascript:` link can never get in or out) or as
 * `markdown`. `value` / `onChange` carry that text; leave out `value` and use `defaultValue` for an uncontrolled editor.
 * `toolbar` chooses the buttons. Keyboard: Ctrl or Cmd + B, I, U, K (link), Z, Y.
 */
const RichTextEditor = ({
	value,
	defaultValue = '',
	onChange,
	format = 'html',
	toolbar,
	placeholder,
	label,
	error,
	helperText,
	minHeight = '12rem',
	maxHeight,
	disabled = false,
	readOnly = false,
	fullScreen: fullScreenProp,
	defaultFullScreen = false,
	onFullScreenChange,
	onImageUpload,
	maxInlineImageSize = 2_000_000,
	name,
	className = '',
}: RichTextEditorProps) => {
	const id = useId()
	const labelId = `${id}-label`
	const errorId = `${id}-error`
	const helperId = `${id}-helper`
	const editable = !disabled && !readOnly
	const markdown = format === 'markdown'

	const editorRef = useRef<HTMLDivElement>(null)
	const toolbarRef = useRef<HTMLDivElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const anchorRef = useRef<HTMLElement | null>(null)
	const saved = useRef<SelectionPath | null>(null)
	const history = useRef<History | null>(null)
	const lastEmitted = useRef<string | undefined>(undefined)
	const latest = useRef({ onChange, format, markdown })
	latest.current = { onChange, format, markdown }

	const [state, setState] = useState<EditorState>(emptyState)
	const [flags, setFlags] = useState({ undo: false, redo: false })
	const [empty, setEmpty] = useState(true)
	const [panel, setPanel] = useState<PanelKind | null>(null)
	const [hasSelection, setHasSelection] = useState(false)
	const [roving, setRoving] = useState(0)
	const [image, setImage] = useState<HTMLImageElement | null>(null)
	const [, setTick] = useState(0)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [innerFull, setInnerFull] = useState(defaultFullScreen)
	const fullScreen = fullScreenProp ?? innerFull
	const setFullScreen = (next: boolean) => {
		if (fullScreenProp === undefined) setInnerFull(next)
		onFullScreenChange?.(next)
		editorRef.current?.focus({ preventScroll: true })
	}
	const [text, setText] = useState('')

	const items = (toolbar === undefined ? DEFAULT_TOOLBAR : toolbar || []).filter(
		item => !markdown || !NOT_IN_MARKDOWN.has(item)
	)

	const toHtml = (text: string) => (latest.current.markdown ? markdownToHtml(text) : sanitizeHtml(text))

	const serialize = useCallback((): string => {
		const root = editorRef.current
		if (!root) return ''
		const html = sanitizeHtml(root.innerHTML)
		if (isBlank(html)) return ''
		return latest.current.markdown ? htmlToMarkdown(html) : html
	}, [])

	const emit = useCallback(() => {
		const next = serialize()
		if (next !== lastEmitted.current) {
			lastEmitted.current = next
			setText(next)
			latest.current.onChange?.(next)
		}
	}, [serialize])

	const refresh = useCallback(() => {
		const root = editorRef.current
		if (!root) return
		const range = currentRange(root)
		if (range) {
			saved.current = captureSelection(root)
			setHasSelection(!range.collapsed)
			const next = queryState(root)
			setState(previous => (JSON.stringify(previous) === JSON.stringify(next) ? previous : next))
		}
		setEmpty(isBlank(sanitizeHtml(root.innerHTML)))
		setFlags({ undo: !!history.current?.canUndo(), redo: !!history.current?.canRedo() })
	}, [])

	/** Called after the content changed: remember it for undo, tell the parent, refresh the toolbar. */
	const changed = useCallback(
		(coalesce: boolean) => {
			const root = editorRef.current
			if (!root) return
			ensureBlocks(root)
			history.current?.record({ html: root.innerHTML, selection: captureSelection(root) }, coalesce)
			emit()
			refresh()
		},
		[emit, refresh]
	)

	// load the content: at the start, and whenever a controlled `value` is changed from outside
	const load = useCallback((content: string) => {
		const root = editorRef.current
		if (!root) return
		root.innerHTML = toHtml(content)
		ensureBlocks(root)
		lastEmitted.current = content
		setText(content)
		history.current = createHistory({ html: root.innerHTML, selection: null })
		setEmpty(isBlank(sanitizeHtml(root.innerHTML)))
		setFlags({ undo: false, redo: false })
	}, [])

	useLayoutEffect(() => {
		try {
			document.execCommand('defaultParagraphSeparator', false, 'p')
		} catch {
			// not every browser has it; paragraphs are also fixed up after each edit
		}
		load(value ?? defaultValue)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (value !== undefined && value !== lastEmitted.current) load(value)
	}, [value, load])

	// a different format means a different text: show the same content in the new one
	const firstFormat = useRef(true)
	useEffect(() => {
		if (firstFormat.current) {
			firstFormat.current = false
			return
		}
		load(value ?? serialize())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [format])

	useEffect(() => {
		document.addEventListener('selectionchange', refresh)
		return () => document.removeEventListener('selectionchange', refresh)
	}, [refresh])

	const applySnapshot = useCallback(
		(snapshot: { html: string; selection: SelectionPath | null } | null) => {
			const root = editorRef.current
			if (!root || !snapshot) return
			root.innerHTML = snapshot.html
			if (!restoreSelection(root, snapshot.selection)) caretIn(root, true)
			emit()
			refresh()
		},
		[emit, refresh]
	)

	// the browser's own undo and redo would fight ours: take them over
	useEffect(() => {
		const root = editorRef.current
		if (!root) return undefined
		const onBeforeInput = (event: Event) => {
			const type = (event as InputEvent).inputType
			if (type !== 'historyUndo' && type !== 'historyRedo') return
			event.preventDefault()
			applySnapshot(type === 'historyUndo' ? (history.current?.undo() ?? null) : (history.current?.redo() ?? null))
		}
		root.addEventListener('beforeinput', onBeforeInput)
		return () => root.removeEventListener('beforeinput', onBeforeInput)
	}, [applySnapshot])

	/** Runs a command on the editor, with the selection it had before focus went to the toolbar or a panel. */
	const run = useCallback(
		(command: (root: HTMLElement) => unknown) => {
			const root = editorRef.current
			if (!root || !editable) return
			if (!currentRange(root)) {
				root.focus({ preventScroll: true })
				if (!restoreSelection(root, saved.current)) caretIn(root, true)
			} else if (document.activeElement !== root) root.focus({ preventScroll: true })
			command(root)
			ensureBlocks(root)
			changed(false)
		},
		[changed, editable]
	)

	// Escape leaves full screen, unless a picker is open (it takes the Escape first)
	useEscapeKey(fullScreen && panel === null, () => setFullScreen(false))
	// the page behind a full screen editor does not scroll
	useEffect(() => {
		if (!fullScreen) return undefined
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	}, [fullScreen])

	const undo = () => applySnapshot(history.current?.undo() ?? null)
	const redo = () => applySnapshot(history.current?.redo() ?? null)

	const closePanel = (refocus = true) => {
		setPanel(null)
		if (refocus) editorRef.current?.focus({ preventScroll: true })
	}
	const openPanel = (kind: PanelKind, anchor: HTMLElement) => {
		anchorRef.current = anchor
		setPanel(current => (current === kind ? null : kind))
	}
	useDismissable(panel !== null, [panelRef, anchorRef as RefObject<HTMLElement | null>], reason =>
		closePanel(reason === 'escape')
	)

	/** The image frame follows the image: measure again, and when the size is final remember it for undo. */
	const sized = (done: boolean) => {
		setTick(tick => tick + 1)
		if (done) changed(false)
	}

	const removeImage = () => {
		image?.remove()
		setImage(null)
		editorRef.current?.focus({ preventScroll: true })
		changed(false)
	}

	// keep the frame on the image when the writing area scrolls or the window changes size
	useEffect(() => {
		if (!image) return undefined
		const follow = () => setTick(tick => tick + 1)
		const root = editorRef.current
		root?.addEventListener('scroll', follow)
		window.addEventListener('resize', follow)
		return () => {
			root?.removeEventListener('scroll', follow)
			window.removeEventListener('resize', follow)
		}
	}, [image])

	/** A press on a column border starts dragging that column's width. */
	const onMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
		const cell = editable && (event.target as Element).closest?.('td, th')
		if (!cell || !nearRightBorder(cell, event.clientX)) return
		const table = cell.closest('table') as HTMLTableElement
		event.preventDefault()
		const index = lastColumnIndex(cell as HTMLTableCellElement)
		const startX = event.clientX
		const startWidth = columnWidth(ensureColumns(table)[index])
		const move = (next: MouseEvent) =>
			setColumnWidth(table, index, Math.max(MIN_SIZE, startWidth + next.clientX - startX))
		const up = () => {
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mouseup', up)
			changed(false)
		}
		document.addEventListener('mousemove', move)
		document.addEventListener('mouseup', up)
	}

	/** The pointer turns into a column resizer on a cell's right border. */
	const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
		const root = editorRef.current
		if (!root || !editable) return
		const cell = (event.target as Element).closest?.('td, th')
		root.style.cursor = cell && nearRightBorder(cell, event.clientX) ? 'col-resize' : ''
	}

	/** Clicking an image selects it for resizing; clicking anything else lets go. */
	const onClick = (event: ReactMouseEvent<HTMLDivElement>) => {
		const target = event.target as Element
		setImage(editable && target.tagName === 'IMG' ? (target as HTMLImageElement) : null)
	}

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (image && (event.key === 'Delete' || event.key === 'Backspace')) {
			event.preventDefault()
			return removeImage()
		}
		if (image && event.key === 'Escape') setImage(null)
		const mod = event.ctrlKey || event.metaKey
		if (mod && !event.altKey) {
			const key = event.key.toLowerCase()
			const inline: Record<string, InlineTag | undefined> = { b: 'strong', i: 'em', u: markdown ? undefined : 'u' }
			if (inline[key]) {
				event.preventDefault()
				run(root => toggleInline(root, inline[key] as InlineTag))
			} else if (key === 'k') {
				event.preventDefault()
				const button = toolbarRef.current?.querySelector<HTMLElement>('[data-item="link"]')
				if (button) openPanel('link', button)
			} else if (key === 'z') {
				event.preventDefault()
				if (event.shiftKey) redo()
				else undo()
			} else if (key === 'y') {
				event.preventDefault()
				redo()
			}
		} else if (event.key === 'Enter' && !event.shiftKey && !mod) {
			const root = editorRef.current
			if (root && exitEmptyListItem(root)) {
				event.preventDefault()
				changed(false)
			}
		}
	}

	/** An image file as an address: the app's own upload, or the image itself as a `data:` address. */
	const uploadImage = (file: File): Promise<string> => {
		if (onImageUpload) return onImageUpload(file)
		if (file.size > maxInlineImageSize) {
			return Promise.reject(new ImageProblem(`The image is larger than ${readableSize(maxInlineImageSize)}.`))
		}
		return readAsDataUrl(file)
	}

	const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
		const data = event.clipboardData
		if (!data) return
		event.preventDefault()
		const file = [...data.files].find(item => item.type.startsWith('image/'))
		if (file) {
			void uploadImage(file).then(
				url => run(root => insertImage(root, url)),
				() => undefined
			)
			return
		}
		const html = data.getData('text/html')
		const text = data.getData('text/plain')
		let clean = html ? sanitizeHtml(html) : plainTextToHtml(text)
		if (markdown) clean = markdownToHtml(htmlToMarkdown(clean))
		if (clean) run(root => insertHtml(root, clean))
	}

	const onToolbarKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const buttons = [
			...(toolbarRef.current?.querySelectorAll<HTMLButtonElement>('button[data-item]:not(:disabled)') ?? []),
		]
		const at = buttons.indexOf(document.activeElement as HTMLButtonElement)
		if (at < 0) return
		const next =
			event.key === 'ArrowRight'
				? (at + 1) % buttons.length
				: event.key === 'ArrowLeft'
					? (at - 1 + buttons.length) % buttons.length
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? buttons.length - 1
							: -1
		if (next < 0) return
		event.preventDefault()
		buttons[next].focus()
		setRoving(Number(buttons[next].dataset.index))
	}

	const toggles: Partial<Record<ToolbarItem, boolean>> = {
		bold: state.bold,
		italic: state.italic,
		underline: state.underline,
		strike: state.strike,
		code: state.code,
		ul: state.list === 'ul',
		ol: state.list === 'ol',
		quote: state.quote,
		codeblock: state.block === 'pre',
		link: state.link !== null,
		left: state.align === 'left',
		center: state.align === 'center',
		right: state.align === 'right',
		justify: state.align === 'justify',
		fullscreen: fullScreen,
	}

	const action = (item: ToolbarItem, anchor: HTMLElement) => {
		const inline = INLINE[item]
		if (inline) return run(root => toggleInline(root, inline))
		switch (item) {
			case 'undo':
				return undo()
			case 'redo':
				return redo()
			case 'color':
			case 'highlight':
			case 'link':
			case 'image':
			case 'table':
				return openPanel(item, anchor)
			case 'unlink':
				return run(root => removeLink(root))
			case 'ul':
			case 'ol':
				return run(root => toggleList(root, item))
			case 'quote':
				return run(root => toggleQuote(root))
			case 'codeblock':
				return run(root => setBlock(root, 'pre'))
			case 'hr':
				return run(root => insertHr(root))
			case 'left':
			case 'center':
			case 'right':
			case 'justify':
				return run(root => setAlign(root, item as Alignment))
			case 'fullscreen':
				return setFullScreen(!fullScreen)
			case 'clear':
				return run(root => clearFormat(root))
		}
	}

	const disabledItem = (item: ToolbarItem) =>
		(item === 'undo' && !flags.undo) || (item === 'redo' && !flags.redo) || (item === 'unlink' && state.link === null)

	let buttonIndex = -1
	const showToolbar = !readOnly && items.some(item => item !== '|')
	const panelProps: PanelProps = {
		state,
		hasSelection,
		uploadImage,
		onDone: () => closePanel(true),
		onClose: () => closePanel(true),
		run,
	}

	return (
		<div
			className={`flex flex-col gap-1.5 ${
				fullScreen ? 'fixed inset-0 z-[var(--xd-z-modal,80)] bg-app-bg p-3 sm:p-4' : ''
			} ${className}`}
			data-fullscreen={fullScreen || undefined}
		>
			{label && (
				<Label as="span" id={labelId}>
					{label}
				</Label>
			)}
			<div
				className={`flex flex-col border bg-app-bg text-sm text-app-text ${fullScreen ? 'min-h-0 flex-1' : ''} ${error ? 'border-red-500' : 'border-app-border'} ${
					disabled ? 'opacity-50' : 'focus-within:border-app-strong focus-within:ring-2 focus-within:ring-app-strong'
				}`}
			>
				{showToolbar && (
					<div
						ref={toolbarRef}
						role="toolbar"
						aria-label="Formatting"
						aria-controls={id}
						onKeyDown={onToolbarKeyDown}
						className="flex flex-wrap items-center gap-0.5 border-b border-app-border bg-app-card p-1"
					>
						{items.map((item, position) => {
							if (item === '|')
								return <span key={`${position}`} aria-hidden="true" className="mx-1 h-5 w-px bg-app-border" />
							if (item === 'block') {
								return (
									<div key="block" className="w-36">
										<Select
											variant="flat"
											aria-label="Text style"
											value={state.block}
											disabled={disabled}
											options={BLOCK_OPTIONS}
											onChange={tag => run(root => setBlock(root, tag as BlockTag))}
											className="!h-9 !py-0 text-xs"
										/>
									</div>
								)
							}
							const meta =
								item === 'fullscreen' && fullScreen
									? { label: 'Exit full screen', icon: <MinimizeIcon className={ICON} /> }
									: META[item]
							buttonIndex += 1
							const index = buttonIndex
							const pressed = toggles[item]
							return (
								<Tooltip
									key={item}
									text={'shortcut' in meta && meta.shortcut ? `${meta.label} (${meta.shortcut})` : meta.label}
								>
									<button
										type="button"
										data-item={item}
										data-index={index}
										aria-label={meta.label}
										aria-pressed={pressed === undefined ? undefined : pressed}
										aria-haspopup={
											['color', 'highlight', 'link', 'image', 'table'].includes(item) ? 'dialog' : undefined
										}
										aria-expanded={panel === item ? true : undefined}
										tabIndex={index === roving ? 0 : -1}
										disabled={disabled || disabledItem(item)}
										onMouseDown={event => event.preventDefault()}
										onFocus={() => setRoving(index)}
										onClick={event => action(item, event.currentTarget)}
										className={`${toolbarButtonClass(!!pressed || panel === item)} disabled:cursor-not-allowed disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-app-strong`}
									>
										{meta.icon}
									</button>
								</Tooltip>
							)
						})}
					</div>
				)}
				<div ref={wrapperRef} className={`relative overflow-hidden ${fullScreen ? 'min-h-0 flex-1' : ''}`}>
					{empty && placeholder && (
						<div aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-app-muted">
							{placeholder}
						</div>
					)}
					<div
						id={id}
						ref={editorRef}
						role="textbox"
						aria-multiline="true"
						aria-labelledby={label ? labelId : undefined}
						aria-label={label ? undefined : 'Rich text editor'}
						aria-invalid={!!error}
						aria-readonly={readOnly || undefined}
						aria-disabled={disabled || undefined}
						aria-describedby={error ? errorId : helperText ? helperId : undefined}
						contentEditable={editable}
						suppressContentEditableWarning
						spellCheck={editable}
						tabIndex={disabled ? -1 : 0}
						onInput={() => {
							setImage(null)
							changed(true)
						}}
						onClick={onClick}
						onMouseDown={onMouseDown}
						onMouseMove={onMouseMove}
						onKeyDown={onKeyDown}
						onPaste={onPaste}
						onKeyUp={refresh}
						onMouseUp={refresh}
						style={fullScreen ? undefined : { minHeight: size(minHeight), maxHeight: size(maxHeight) }}
						className={`overflow-y-auto break-words px-3 py-3 outline-none ${fullScreen ? 'h-full' : ''} ${CONTENT_CLASS}`}
					/>
					{image && image.isConnected && wrapperRef.current && (
						<ImageOverlay image={image} wrapper={wrapperRef.current} onSize={sized} onRemove={removeImage} />
					)}
				</div>
			</div>
			<FloatingPanel
				open={panel !== null}
				anchorRef={anchorRef as RefObject<HTMLElement | null>}
				panelRef={panelRef}
				role="dialog"
				aria-label={panel ? META[panel].label : undefined}
				className="border border-app-border bg-app-card p-3 text-sm text-app-text shadow-xl"
			>
				{(panel === 'color' || panel === 'highlight') && (
					<Swatches
						colors={panel === 'color' ? TEXT_COLORS : HIGHLIGHTS}
						label={panel === 'color' ? 'Text color' : 'Highlight'}
						onPick={color => {
							run(root => applyStyle(root, panel === 'color' ? 'color' : 'background-color', color))
							closePanel(true)
						}}
					/>
				)}
				{panel === 'link' && <LinkPanel {...panelProps} />}
				{panel === 'image' && <ImagePanel {...panelProps} />}
				{panel === 'table' && <TablePanel {...panelProps} />}
			</FloatingPanel>
			{error ? (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			) : (
				helperText && <HelperText id={helperId}>{helperText}</HelperText>
			)}
			{name && <input type="hidden" name={name} value={value ?? text} />}
		</div>
	)
}

export default RichTextEditor
