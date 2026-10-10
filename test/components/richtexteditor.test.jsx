import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import RichTextEditor from '../../src/components/RichTextEditor'

const editor = () => screen.getByRole('textbox')
const button = name => screen.getByRole('button', { name })
const html = () => editor().innerHTML

// select `from` to `to` characters of the n-th text node of the editor
const selectIn = (node, from = 0, to = from) => {
	const range = document.createRange()
	range.setStart(node, from)
	range.setEnd(node, to)
	const selection = window.getSelection()
	selection.removeAllRanges()
	selection.addRange(range)
	act(() => void fireEvent(document, new Event('selectionchange')))
}
const firstText = () => {
	const walker = document.createTreeWalker(editor(), NodeFilter.SHOW_TEXT)
	return walker.nextNode()
}
// the text style is a Select: open it and pick an option
const chooseStyle = name => {
	fireEvent.click(screen.getByRole('combobox', { name: 'Text style' }))
	fireEvent.click(screen.getByRole('option', { name }))
}
const press = (name, options) => act(() => void fireEvent.click(button(name), options))
const type = (key, init = {}) => act(() => void fireEvent.keyDown(editor(), { key, ...init }))

// happy-dom reports selection changes a moment later, outside of act(): the editor handles them, React just warns
const consoleError = console.error
beforeAll(() => {
	console.error = (...args) => {
		if (!String(args[0]).includes('not wrapped in act')) consoleError(...args)
	}
})
afterAll(() => {
	console.error = consoleError
})
afterEach(() => window.getSelection().removeAllRanges())

describe('RichTextEditor basics', () => {
	it('renders a labelled, multiline textbox with a toolbar', () => {
		render(<RichTextEditor label="Notes" helperText="Be kind" defaultValue="<p>hello</p>" />)
		const box = screen.getByRole('textbox', { name: 'Notes' })
		expect(box).toHaveAttribute('aria-multiline', 'true')
		expect(box).toHaveAttribute('contenteditable', 'true')
		expect(box).toHaveAttribute('aria-describedby')
		expect(screen.getByText('Be kind')).toBeInTheDocument()
		expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument()
		expect(box.innerHTML).toBe('<p>hello</p>')
	})

	it('has a default name without a label, and shows an error', () => {
		render(<RichTextEditor error="Required" helperText="ignored" />)
		expect(screen.getByRole('textbox', { name: 'Rich text editor' })).toHaveAttribute('aria-invalid', 'true')
		expect(screen.getByText('Required')).toBeInTheDocument()
		expect(screen.queryByText('ignored')).toBeNull()
	})

	it('shows the placeholder only while empty', () => {
		render(<RichTextEditor placeholder="Write here" />)
		expect(screen.getByText('Write here')).toBeInTheDocument()
		editor().innerHTML = '<p>x</p>'
		fireEvent.input(editor())
		expect(screen.queryByText('Write here')).toBeNull()
	})

	it('reports edits, with the empty document as an empty string', () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue="<p>a</p>" onChange={onChange} />)
		editor().innerHTML = '<p>ab</p>'
		fireEvent.input(editor())
		expect(onChange).toHaveBeenLastCalledWith('<p>ab</p>')
		editor().innerHTML = '<p><br></p>'
		fireEvent.input(editor())
		expect(onChange).toHaveBeenLastCalledWith('')
	})

	it('wraps loose typed text in a paragraph, and sanitizes what it was given', () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue={'<p onclick="x()">a</p><script>alert(1)</script>'} onChange={onChange} />)
		expect(html()).toBe('<p>a</p>')
		editor().innerHTML = 'typed'
		fireEvent.input(editor())
		expect(html()).toBe('<p>typed</p>')
		expect(onChange).toHaveBeenLastCalledWith('<p>typed</p>')
	})

	it('puts div lines into paragraphs', () => {
		render(<RichTextEditor />)
		editor().innerHTML = '<div>one</div><div>two</div>'
		fireEvent.input(editor())
		expect(html()).toBe('<p>one</p><p>two</p>')
	})

	it('can carry its value in a form', () => {
		const { container } = render(<RichTextEditor name="body" defaultValue="<p>x</p>" />)
		expect(container.querySelector('input[type=hidden]')).toHaveAttribute('name', 'body')
		expect(container.querySelector('input[type=hidden]').value).toBe('<p>x</p>')
		editor().innerHTML = '<p>xy</p>'
		fireEvent.input(editor())
		expect(container.querySelector('input[type=hidden]').value).toBe('<p>xy</p>')
	})
})

describe('controlled value', () => {
	it('shows a new value from outside, and does not reset what it just reported', () => {
		const onChange = vi.fn()
		const { rerender } = render(<RichTextEditor value="<p>one</p>" onChange={onChange} />)
		expect(html()).toBe('<p>one</p>')
		rerender(<RichTextEditor value="<p>two</p>" onChange={onChange} />)
		expect(html()).toBe('<p>two</p>')
		editor().innerHTML = '<p>two!</p>'
		fireEvent.input(editor())
		const node = editor().firstChild
		rerender(<RichTextEditor value="<p>two!</p>" onChange={onChange} />)
		expect(editor().firstChild).toBe(node)
	})
})

describe('formatting', () => {
	it('bolds the selection with the toolbar and with the keyboard', () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue="<p>hello world</p>" onChange={onChange} />)
		selectIn(firstText(), 0, 5)
		press('Bold')
		expect(onChange).toHaveBeenLastCalledWith('<p><strong>hello</strong> world</p>')
		expect(button('Bold')).toHaveAttribute('aria-pressed', 'true')
		type('b', { ctrlKey: true })
		expect(onChange).toHaveBeenLastCalledWith('<p>hello world</p>')
		type('i', { metaKey: true })
		expect(html()).toContain('<em>')
		type('u', { ctrlKey: true })
		expect(html()).toContain('<u>')
	})

	it('applies every kind of inline format and clears them', () => {
		render(<RichTextEditor defaultValue="<p>text</p>" />)
		for (const name of ['Italic', 'Underline', 'Strikethrough', 'Inline code']) {
			selectIn(firstText(), 0, 4)
			press(name)
		}
		expect(html()).toMatch(/<code>|<s>/)
		selectIn(firstText(), 0, 4)
		press('Clear formatting')
		expect(html()).toBe('<p>text</p>')
	})

	it('changes the block type with the select, lists, quote, code block and alignment', () => {
		render(<RichTextEditor defaultValue="<p>one</p>" />)
		selectIn(firstText(), 0, 1)
		chooseStyle('Heading 2')
		expect(html()).toBe('<h2>one</h2>')
		chooseStyle('Paragraph')
		selectIn(firstText(), 0, 1)
		press('Bulleted list')
		expect(html()).toBe('<ul><li>one</li></ul>')
		press('Numbered list')
		expect(html()).toBe('<ol><li>one</li></ol>')
		press('Numbered list')
		press('Quote')
		expect(html()).toBe('<blockquote><p>one</p></blockquote>')
		press('Quote')
		press('Code block')
		expect(html()).toBe('<pre>one</pre>')
		press('Code block')
		press('Align center')
		expect(html()).toContain('text-align: center')
		press('Align left')
		expect(html()).toBe('<p>one</p>')
		press('Align right')
		expect(html()).toContain('text-align: right')
	})

	it('inserts a rule, and removes a link', () => {
		render(<RichTextEditor defaultValue='<p>a <a href="/x">link</a></p>' />)
		selectIn(editor().querySelector('a').firstChild, 1)
		expect(button('Link')).toHaveAttribute('aria-pressed', 'true')
		press('Remove link')
		expect(html()).toBe('<p>a link</p>')
		expect(button('Remove link')).toBeDisabled()
		selectIn(firstText(), 1)
		press('Horizontal rule')
		expect(html()).toContain('<hr>')
	})

	it('puts an empty list item back into a paragraph on Enter', () => {
		render(<RichTextEditor defaultValue="<ul><li>a</li><li><br></li></ul>" />)
		selectIn(editor().querySelectorAll('li')[1], 0)
		type('Enter')
		expect(html()).toBe('<ul><li>a</li></ul><p><br></p>')
		type('Enter')
	})

	it('does nothing when there is no selection to work on and the editor cannot be edited', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" readOnly />)
		expect(screen.queryByRole('toolbar')).toBeNull()
		expect(editor()).toHaveAttribute('contenteditable', 'false')
		expect(editor()).toHaveAttribute('aria-readonly', 'true')
	})
})

describe('undo and redo', () => {
	it('walks back through the edits with the buttons and the keyboard', () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue="<p>text</p>" onChange={onChange} />)
		expect(button('Undo')).toBeDisabled()
		selectIn(firstText(), 0, 4)
		press('Bold')
		expect(html()).toBe('<p><strong>text</strong></p>')
		expect(button('Undo')).not.toBeDisabled()
		press('Undo')
		expect(html()).toBe('<p>text</p>')
		expect(onChange).toHaveBeenLastCalledWith('<p>text</p>')
		expect(button('Redo')).not.toBeDisabled()
		press('Redo')
		expect(html()).toBe('<p><strong>text</strong></p>')
		type('z', { ctrlKey: true })
		expect(html()).toBe('<p>text</p>')
		type('y', { ctrlKey: true })
		expect(html()).toBe('<p><strong>text</strong></p>')
		type('z', { ctrlKey: true, shiftKey: true })
		expect(html()).toBe('<p><strong>text</strong></p>')
		type('z', { ctrlKey: true })
		type('z', { metaKey: true, shiftKey: true })
		expect(html()).toBe('<p><strong>text</strong></p>')
	})

	it('takes over the browser undo events', () => {
		render(<RichTextEditor defaultValue="<p>text</p>" />)
		selectIn(firstText(), 0, 4)
		press('Italic')
		const event = new Event('beforeinput', { cancelable: true, bubbles: true })
		event.inputType = 'historyUndo'
		editor().dispatchEvent(event)
		expect(event.defaultPrevented).toBe(true)
		expect(html()).toBe('<p>text</p>')
		const redo = new Event('beforeinput', { cancelable: true, bubbles: true })
		redo.inputType = 'historyRedo'
		editor().dispatchEvent(redo)
		expect(html()).toBe('<p><em>text</em></p>')
		const other = new Event('beforeinput', { cancelable: true, bubbles: true })
		other.inputType = 'insertText'
		editor().dispatchEvent(other)
		expect(other.defaultPrevented).toBe(false)
	})
})

describe('pickers', () => {
	it('links the selection from the link panel, normalizing the address', async () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue="<p>visit us</p>" onChange={onChange} />)
		selectIn(firstText(), 6, 8)
		press('Link')
		const dialog = screen.getByRole('dialog', { name: 'Link' })
		expect(dialog).toBeInTheDocument()
		fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'example.com/a' } })
		fireEvent.submit(dialog.querySelector('form'))
		expect(onChange).toHaveBeenLastCalledWith('<p>visit <a href="https://example.com/a">us</a></p>')
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
	})

	it('opens from the keyboard, inserts a link with text at the caret, and refuses bad addresses', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		selectIn(firstText(), 1)
		type('k', { ctrlKey: true })
		const dialog = screen.getByRole('dialog', { name: 'Link' })
		fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'javascript:alert(1)' } })
		fireEvent.submit(dialog.querySelector('form'))
		expect(screen.getByText(/Enter a web, mail or relative address/)).toBeInTheDocument()
		fireEvent.change(screen.getByLabelText('Address'), { target: { value: '/docs' } })
		fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'Docs' } })
		fireEvent.submit(dialog.querySelector('form'))
		expect(html()).toBe('<p>a<a href="/docs">Docs</a></p>')
	})

	it('closes a panel with Cancel, a second click and Escape', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		selectIn(firstText(), 0, 1)
		press('Link')
		fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
		expect(screen.queryByRole('dialog')).toBeNull()
		press('Link')
		press('Link')
		expect(screen.queryByRole('dialog')).toBeNull()
		press('Table')
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		press('Table')
		fireEvent.mouseDown(document.body)
		expect(screen.queryByRole('dialog')).toBeNull()
	})

	it('inserts an image by address, and refuses a bad one', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		selectIn(firstText(), 1)
		press('Image')
		fireEvent.change(screen.getByLabelText('Image address'), { target: { value: 'javascript:x' } })
		fireEvent.submit(screen.getByRole('dialog').querySelector('form'))
		expect(screen.getByText('Enter a web or relative address.')).toBeInTheDocument()
		fireEvent.change(screen.getByLabelText('Image address'), { target: { value: '/pic.png' } })
		fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A pic' } })
		fireEvent.submit(screen.getByRole('dialog').querySelector('form'))
		expect(html()).toContain('<img src="/pic.png" alt="A pic">')
	})

	it('uploads an image file when it can', async () => {
		const onImageUpload = vi.fn().mockResolvedValueOnce('/uploaded.png').mockRejectedValueOnce(new Error('no'))
		render(<RichTextEditor defaultValue="<p>a</p>" onImageUpload={onImageUpload} />)
		selectIn(firstText(), 1)
		press('Image')
		const file = new File(['x'], 'a.png', { type: 'image/png' })
		const input = screen.getByRole('dialog').querySelector('input[type=file]')
		fireEvent.change(input, { target: { files: [file] } })
		await waitFor(() => expect(html()).toContain('/uploaded.png'))
		selectIn(firstText(), 1)
		press('Image')
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [file] } })
		expect(await screen.findByText('The upload failed.')).toBeInTheDocument()
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [] } })
	})

	it('inserts a table of the chosen size', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		selectIn(firstText(), 1)
		press('Table')
		fireEvent.change(screen.getByLabelText('Rows'), { target: { value: '2' } })
		fireEvent.change(screen.getByLabelText('Columns'), { target: { value: '4' } })
		fireEvent.submit(screen.getByRole('dialog').querySelector('form'))
		expect(editor().querySelectorAll('th')).toHaveLength(4)
		expect(editor().querySelectorAll('td')).toHaveLength(4)
		press('Table')
		fireEvent.change(screen.getByLabelText('Rows'), { target: { value: '999' } })
		fireEvent.change(screen.getByLabelText('Columns'), { target: { value: 'x' } })
		expect(screen.getByLabelText('Rows')).toHaveValue(20)
		expect(screen.getByLabelText('Columns')).toHaveValue(1)
	})

	it('colors and highlights text, and takes the color off', () => {
		render(<RichTextEditor defaultValue="<p>colorful</p>" />)
		selectIn(firstText(), 0, 5)
		press('Text color')
		fireEvent.click(screen.getByRole('button', { name: 'Text color #dc2626' }))
		expect(html()).toContain('color: #dc2626')
		selectIn(editor().querySelector('span').firstChild, 0, 5)
		press('Text color')
		fireEvent.click(screen.getByRole('button', { name: 'None' }))
		expect(html()).not.toContain('<span')
		selectIn(firstText(), 0, 5)
		press('Highlight')
		fireEvent.click(screen.getByRole('button', { name: 'Highlight #fef08a' }))
		expect(html()).toContain('background-color')
	})
})

describe('paste', () => {
	const paste = (data, files = []) => {
		const clipboardData = {
			files,
			getData: type => data[type] ?? '',
		}
		return fireEvent.paste(editor(), { clipboardData })
	}

	it('inserts sanitized html', () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue="<p>ab</p>" onChange={onChange} />)
		selectIn(firstText(), 1)
		paste({ 'text/html': '<b onclick="x()">X</b><script>alert(1)</script>' })
		expect(onChange).toHaveBeenLastCalledWith('<p>a<strong>X</strong>b</p>')
	})

	it('inserts blocks between the split halves of the current block', () => {
		render(<RichTextEditor defaultValue="<p>ab</p>" />)
		selectIn(firstText(), 1)
		paste({ 'text/html': '<h2>T</h2><p>one</p><p>two</p>' })
		expect(html()).toBe('<p>a</p><h2>T</h2><p>one</p><p>two</p><p>b</p>')
	})

	it('turns plain text into paragraphs and line breaks', () => {
		render(<RichTextEditor defaultValue="<p><br></p>" />)
		selectIn(editor().firstChild, 0)
		paste({ 'text/plain': 'one\nline <two>\n\nthree' })
		expect(html()).toBe('<p>one<br>line &lt;two&gt;</p><p>three</p>')
	})

	it('ignores an empty paste, and sends an image file to onImageUpload', async () => {
		const onImageUpload = vi.fn().mockResolvedValue('/p.png')
		render(<RichTextEditor defaultValue="<p>a</p>" onImageUpload={onImageUpload} />)
		selectIn(firstText(), 1)
		paste({})
		expect(html()).toBe('<p>a</p>')
		paste({}, [new File(['x'], 'p.png', { type: 'image/png' })])
		await waitFor(() => expect(html()).toContain('<img src="/p.png">'))
		onImageUpload.mockRejectedValueOnce(new Error('no'))
		paste({}, [new File(['x'], 'p.png', { type: 'image/png' })])
		await waitFor(() => expect(onImageUpload).toHaveBeenCalledTimes(2))
	})

	it('does nothing when the event carries no clipboard', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		fireEvent.paste(editor())
		expect(html()).toBe('<p>a</p>')
	})
})

describe('markdown format', () => {
	it('reads and writes Markdown, and hides what it cannot say', () => {
		const onChange = vi.fn()
		render(<RichTextEditor format="markdown" defaultValue={'# Title\n\nSome **bold**'} onChange={onChange} />)
		expect(html()).toBe('<h1>Title</h1><p>Some <strong>bold</strong></p>')
		expect(screen.queryByRole('button', { name: 'Underline' })).toBeNull()
		expect(screen.queryByRole('button', { name: 'Text color' })).toBeNull()
		expect(screen.queryByRole('button', { name: 'Align center' })).toBeNull()
		selectIn(editor().querySelector('p').firstChild, 0, 4)
		press('Italic')
		expect(onChange).toHaveBeenLastCalledWith('# Title\n\n*Some* **bold**')
		type('u', { ctrlKey: true })
		expect(html()).not.toContain('<u>')
	})

	it('drops styling from pasted html', () => {
		render(<RichTextEditor format="markdown" defaultValue="" />)
		selectIn(editor().firstChild, 0)
		fireEvent.paste(editor(), {
			clipboardData: { files: [], getData: type => (type === 'text/html' ? '<p style="color: red"><u>x</u></p>' : '') },
		})
		expect(html()).toBe('<p>x</p>')
	})

	it('shows the same content in the other format when `format` changes', () => {
		const { rerender } = render(<RichTextEditor defaultValue="<p>a <strong>b</strong></p>" />)
		rerender(<RichTextEditor format="markdown" defaultValue="<p>a <strong>b</strong></p>" />)
		expect(html()).toBe('<p>a <strong>b</strong></p>')
	})
})

describe('toolbar options', () => {
	it('shows only the chosen items, or none', () => {
		const { rerender } = render(<RichTextEditor toolbar={['bold', '|', 'link']} />)
		expect(screen.getAllByRole('button')).toHaveLength(2)
		rerender(<RichTextEditor toolbar={false} />)
		expect(screen.queryByRole('toolbar')).toBeNull()
		rerender(<RichTextEditor toolbar={[]} />)
		expect(screen.queryByRole('toolbar')).toBeNull()
	})

	it('moves between the buttons with the arrow keys', () => {
		render(<RichTextEditor toolbar={['bold', 'italic', 'strike']} />)
		button('Bold').focus()
		expect(button('Bold')).toHaveAttribute('tabindex', '0')
		expect(button('Italic')).toHaveAttribute('tabindex', '-1')
		fireEvent.keyDown(button('Bold'), { key: 'ArrowRight' })
		expect(document.activeElement).toBe(button('Italic'))
		expect(button('Italic')).toHaveAttribute('tabindex', '0')
		fireEvent.keyDown(button('Italic'), { key: 'End' })
		expect(document.activeElement).toBe(button('Strikethrough'))
		fireEvent.keyDown(button('Strikethrough'), { key: 'ArrowRight' })
		expect(document.activeElement).toBe(button('Bold'))
		fireEvent.keyDown(button('Bold'), { key: 'ArrowLeft' })
		expect(document.activeElement).toBe(button('Strikethrough'))
		fireEvent.keyDown(button('Strikethrough'), { key: 'Home' })
		expect(document.activeElement).toBe(button('Bold'))
		fireEvent.keyDown(button('Bold'), { key: 'a' })
		expect(document.activeElement).toBe(button('Bold'))
		fireEvent.keyDown(screen.getByRole('toolbar'), { key: 'ArrowRight' })
	})

	it('disables everything when disabled', () => {
		render(<RichTextEditor disabled />)
		expect(editor()).toHaveAttribute('contenteditable', 'false')
		expect(editor()).toHaveAttribute('aria-disabled', 'true')
		expect(button('Bold')).toBeDisabled()
		expect(screen.getByRole('combobox', { name: 'Text style' })).toBeDisabled()
	})

	it('sizes the writing area', () => {
		render(<RichTextEditor minHeight={100} maxHeight="20rem" />)
		expect(editor().style.minHeight).toBe('100px')
		expect(editor().style.maxHeight).toBe('20rem')
	})
})

describe('justify and full screen', () => {
	it('justifies text', () => {
		render(<RichTextEditor defaultValue="<p>one</p>" />)
		selectIn(firstText(), 0, 1)
		press('Justify')
		expect(html()).toContain('text-align: justify')
		expect(button('Justify')).toHaveAttribute('aria-pressed', 'true')
		press('Align left')
		expect(html()).toBe('<p>one</p>')
	})

	it('has no justify in Markdown', () => {
		render(<RichTextEditor format="markdown" />)
		expect(screen.queryByRole('button', { name: 'Justify' })).toBeNull()
	})

	it('goes full screen and back with the button, locking the page behind it', () => {
		const onFullScreenChange = vi.fn()
		const { container } = render(<RichTextEditor defaultValue="<p>a</p>" onFullScreenChange={onFullScreenChange} />)
		const root = container.firstChild
		expect(root).not.toHaveClass('fixed')
		press('Full screen')
		expect(root).toHaveClass('fixed', 'inset-0')
		expect(root).toHaveAttribute('data-fullscreen', 'true')
		expect(onFullScreenChange).toHaveBeenLastCalledWith(true)
		expect(document.body.style.overflow).toBe('hidden')
		expect(button('Exit full screen')).toHaveAttribute('aria-pressed', 'true')
		press('Exit full screen')
		expect(root).not.toHaveClass('fixed')
		expect(onFullScreenChange).toHaveBeenLastCalledWith(false)
		expect(document.body.style.overflow).toBe('')
	})

	it('leaves full screen with Escape, but lets an open picker take the Escape first', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" defaultFullScreen />)
		expect(button('Exit full screen')).toBeInTheDocument()
		press('Table')
		fireEvent.keyDown(document, { key: 'Escape' })
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(button('Exit full screen')).toBeInTheDocument()
		fireEvent.keyDown(window, { key: 'Escape' })
		expect(button('Full screen')).toBeInTheDocument()
	})

	it('can be controlled', () => {
		const onFullScreenChange = vi.fn()
		const { rerender } = render(<RichTextEditor fullScreen={false} onFullScreenChange={onFullScreenChange} />)
		press('Full screen')
		expect(onFullScreenChange).toHaveBeenCalledWith(true)
		expect(button('Full screen')).toBeInTheDocument()
		rerender(<RichTextEditor fullScreen onFullScreenChange={onFullScreenChange} minHeight={50} />)
		expect(button('Exit full screen')).toBeInTheDocument()
		expect(editor().style.minHeight).toBe('')
	})
})

describe('images without an upload handler', () => {
	const png = new File(['xyz'], 'a.png', { type: 'image/png' })

	it('offers Upload anyway, and embeds the image in the content', async () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue="<p>a</p>" onChange={onChange} />)
		selectIn(firstText(), 1)
		press('Image')
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [png] } })
		await waitFor(() => expect(html()).toContain('<img src="data:image/png;base64,'))
		expect(onChange).toHaveBeenLastCalledWith(expect.stringContaining('data:image/png'))
	})

	it('refuses an image over the size limit, telling the reader', async () => {
		render(<RichTextEditor defaultValue="<p>a</p>" maxInlineImageSize={2} />)
		selectIn(firstText(), 1)
		press('Image')
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [png] } })
		expect(await screen.findByText('The image is larger than 2 bytes.')).toBeInTheDocument()
		expect(document.querySelector('[contenteditable] img')).toBeNull()
	})

	it('words the limit in KB and MB', async () => {
		const { unmount } = render(<RichTextEditor defaultValue="<p>a</p>" maxInlineImageSize={1500} />)
		selectIn(firstText(), 1)
		press('Image')
		const big = new File(['x'.repeat(2000)], 'b.png', { type: 'image/png' })
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [big] } })
		expect(await screen.findByText('The image is larger than 2 KB.')).toBeInTheDocument()
		unmount()
		render(<RichTextEditor defaultValue="<p>a</p>" maxInlineImageSize={2_500_000} />)
		selectIn(firstText(), 1)
		press('Image')
		const huge = new File(['x'.repeat(2_600_000)], 'c.png', { type: 'image/png' })
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [huge] } })
		expect(await screen.findByText('The image is larger than 2.5 MB.')).toBeInTheDocument()
	})

	it('embeds a pasted image, and reports an unreadable one', async () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		selectIn(firstText(), 1)
		fireEvent.paste(editor(), { clipboardData: { files: [png], getData: () => '' } })
		await waitFor(() => expect(html()).toContain('data:image/png'))
		const reader = vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () {
			this.onerror?.()
		})
		press('Image')
		fireEvent.change(screen.getByRole('dialog').querySelector('input[type=file]'), { target: { files: [png] } })
		expect(await screen.findByText('The image could not be read.')).toBeInTheDocument()
		reader.mockRestore()
	})
})

describe('resizing images and tables', () => {
	const box = (width, extra = {}) => ({
		width,
		height: 50,
		left: 0,
		top: 0,
		right: width,
		bottom: 50,
		x: 0,
		y: 0,
		toJSON() {},
		...extra,
	})

	it('selects an image on click, with a frame and width buttons', () => {
		const onChange = vi.fn()
		render(<RichTextEditor defaultValue='<p>a<img src="/p.png" alt="p"></p>' onChange={onChange} />)
		expect(screen.queryByRole('group', { name: 'Image size' })).toBeNull()
		fireEvent.click(editor().querySelector('img'))
		expect(screen.getByRole('group', { name: 'Image size' })).toBeInTheDocument()
		fireEvent.click(screen.getByRole('button', { name: 'Image width 50%' }))
		expect(html()).toContain('<img src="/p.png" alt="p" width="50%">')
		expect(onChange).toHaveBeenLastCalledWith(expect.stringContaining('width="50%"'))
		fireEvent.click(screen.getByRole('button', { name: 'Image width Original' }))
		expect(html()).toContain('<img src="/p.png" alt="p">')
		fireEvent.click(editor().querySelector('p'))
		expect(screen.queryByRole('group', { name: 'Image size' })).toBeNull()
	})

	it('drags the corner handle to change the width, in one undo step', () => {
		render(<RichTextEditor defaultValue='<p><img src="/p.png"></p>' />)
		const image = editor().querySelector('img')
		image.getBoundingClientRect = () => box(200)
		fireEvent.click(image)
		const handle = screen.getByRole('separator', { name: 'Drag to resize the image' })
		fireEvent.mouseDown(handle, { clientX: 100 })
		fireEvent.mouseMove(document, { clientX: 160 })
		expect(image.getAttribute('width')).toBe('260')
		fireEvent.mouseMove(document, { clientX: -500 })
		expect(image.getAttribute('width')).toBe('24')
		fireEvent.mouseMove(document, { clientX: 140 })
		fireEvent.mouseUp(document)
		fireEvent.mouseMove(document, { clientX: 500 })
		expect(image.getAttribute('width')).toBe('240')
		press('Undo')
		expect(html()).toBe('<p><img src="/p.png"></p>')
	})

	it('removes the selected image with the button or the Delete key', () => {
		render(<RichTextEditor defaultValue='<p>a<img src="/p.png"><img src="/q.png"></p>' />)
		fireEvent.click(editor().querySelector('img'))
		fireEvent.click(screen.getByRole('button', { name: 'Remove image' }))
		expect(editor().querySelectorAll('img')).toHaveLength(1)
		fireEvent.click(editor().querySelector('img'))
		type('Delete')
		expect(editor().querySelectorAll('img')).toHaveLength(0)
		expect(screen.queryByRole('group', { name: 'Image size' })).toBeNull()
	})

	it('lets go of the image on Escape, typing and in a read-only editor', () => {
		const { rerender } = render(<RichTextEditor defaultValue='<p>a<img src="/p.png"></p>' />)
		fireEvent.click(editor().querySelector('img'))
		type('Escape')
		expect(screen.queryByRole('group', { name: 'Image size' })).toBeNull()
		fireEvent.click(editor().querySelector('img'))
		fireEvent.input(editor())
		expect(screen.queryByRole('group', { name: 'Image size' })).toBeNull()
		rerender(<RichTextEditor defaultValue='<p>a<img src="/p.png"></p>' readOnly />)
		fireEvent.click(editor().querySelector('img'))
		expect(screen.queryByRole('group', { name: 'Image size' })).toBeNull()
	})

	it('follows the image when the window changes size', () => {
		render(<RichTextEditor defaultValue='<p><img src="/p.png"></p>' />)
		const image = editor().querySelector('img')
		image.getBoundingClientRect = () => box(100)
		fireEvent.click(image)
		const frame = () => screen.getByRole('group', { name: 'Image size' })
		expect(frame()).toHaveStyle({ width: '100px' })
		image.getBoundingClientRect = () => box(150)
		act(() => void fireEvent(window, new Event('resize')))
		expect(frame()).toHaveStyle({ width: '150px' })
		fireEvent.scroll(editor())
	})

	it('shows a resize cursor on a column border, and drags the column', () => {
		const onChange = vi.fn()
		render(
			<RichTextEditor
				defaultValue="<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>"
				onChange={onChange}
			/>
		)
		const [a, b] = editor().querySelectorAll('th')
		a.getBoundingClientRect = () => box(100, { right: 100 })
		b.getBoundingClientRect = () => box(120, { left: 100, right: 220 })
		fireEvent.mouseMove(a, { clientX: 99 })
		expect(editor().style.cursor).toBe('col-resize')
		fireEvent.mouseMove(a, { clientX: 40 })
		expect(editor().style.cursor).toBe('')
		fireEvent.mouseMove(editor().querySelector('tbody td'), { clientX: 3 })
		fireEvent.mouseMove(editor())
		fireEvent.mouseDown(a, { clientX: 40 })
		expect(editor().querySelector('colgroup')).toBeNull()
		fireEvent.mouseDown(a, { clientX: 100 })
		fireEvent.mouseMove(document, { clientX: 150 })
		expect(editor().querySelector('table').getAttribute('width')).toBe('270')
		expect(editor().querySelectorAll('col')[0].getAttribute('width')).toBe('150')
		fireEvent.mouseUp(document)
		expect(onChange).toHaveBeenLastCalledWith(expect.stringContaining('<col width="150">'))
		press('Undo')
		expect(editor().querySelector('colgroup')).toBeNull()
	})

	it('does not resize columns when it cannot be edited', () => {
		render(<RichTextEditor readOnly defaultValue="<table><tr><td>a</td></tr></table>" />)
		const cell = editor().querySelector('td')
		cell.getBoundingClientRect = () => box(100, { right: 100 })
		fireEvent.mouseMove(cell, { clientX: 100 })
		fireEvent.mouseDown(cell, { clientX: 100 })
		expect(editor().style.cursor).toBe('')
		expect(editor().querySelector('colgroup')).toBeNull()
	})

	it('inserts new tables at the full width', () => {
		render(<RichTextEditor defaultValue="<p>a</p>" />)
		selectIn(firstText(), 1)
		press('Table')
		fireEvent.submit(screen.getByRole('dialog').querySelector('form'))
		expect(editor().querySelector('table')).toHaveAttribute('width', '100%')
	})
})
