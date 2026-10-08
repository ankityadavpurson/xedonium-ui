import { fireEvent, render, screen, within } from '@testing-library/react'
import Markdown from '../../src/components/Markdown'
import { inlineText, parseInline, parseMarkdown, safeUrl } from '../../src/utils/markdown'

const types = nodes => nodes.map(n => n.type)

describe('safeUrl', () => {
	it.each([
		['https://example.com/a?b=1', 'https://example.com/a?b=1'],
		['http://example.com', 'http://example.com'],
		['mailto:me@example.com', 'mailto:me@example.com'],
		['tel:+123', 'tel:+123'],
		['/docs/page', '/docs/page'],
		['../up.png', '../up.png'],
		['#anchor', '#anchor'],
		['//cdn.example.com/x.png', '//cdn.example.com/x.png'],
		['  /trimmed  ', '/trimmed'],
	])('keeps %s', (url, expected) => expect(safeUrl(url)).toBe(expected))

	it.each([
		'javascript:alert(1)',
		'JaVaScRiPt:alert(1)',
		'java\nscript:alert(1)',
		' \tjavascript:x',
		'vbscript:x',
		'data:text/html,<b>x',
		'file:///etc/passwd',
	])('drops %j', url => expect(safeUrl(url)).toBe(''))

	it('allows data:image only for images', () => {
		expect(safeUrl('data:image/png;base64,AAAA', true)).toBe('data:image/png;base64,AAAA')
		expect(safeUrl('data:image/png;base64,AAAA')).toBe('')
		expect(safeUrl('data:text/html,<b>x', true)).toBe('')
	})
})

describe('parseInline', () => {
	it('parses emphasis, strong, strikethrough and combinations', () => {
		expect(parseInline('a **b** *c* _d_ __e__ ~~f~~')).toEqual([
			{ type: 'text', text: 'a ' },
			{ type: 'strong', children: [{ type: 'text', text: 'b' }] },
			{ type: 'text', text: ' ' },
			{ type: 'em', children: [{ type: 'text', text: 'c' }] },
			{ type: 'text', text: ' ' },
			{ type: 'em', children: [{ type: 'text', text: 'd' }] },
			{ type: 'text', text: ' ' },
			{ type: 'strong', children: [{ type: 'text', text: 'e' }] },
			{ type: 'text', text: ' ' },
			{ type: 'del', children: [{ type: 'text', text: 'f' }] },
		])
		expect(parseInline('***both***')).toEqual([
			{ type: 'strong', children: [{ type: 'em', children: [{ type: 'text', text: 'both' }] }] },
		])
		expect(parseInline('**bold with *em* inside**')[0].children.map(n => n.type)).toEqual(['text', 'em', 'text'])
	})

	it('keeps unmatched markers, snake_case and spaced asterisks literal', () => {
		expect(inlineText(parseInline('2 * 3 * 4'))).toBe('2 * 3 * 4')
		expect(inlineText(parseInline('snake_case_name'))).toBe('snake_case_name')
		expect(types(parseInline('**oops'))).toEqual(['text'])
		expect(types(parseInline('a ~~ b'))).toEqual(['text'])
		expect(types(parseInline('_ not em_'))).toEqual(['text'])
	})

	it('parses code spans, with backtick runs and trimmed padding, and nothing inside them', () => {
		expect(parseInline('use `a*b*c` here')[1]).toEqual({ type: 'code', text: 'a*b*c' })
		expect(parseInline('`` a`b ``')[0]).toEqual({ type: 'code', text: 'a`b' })
		expect(parseInline('`a\nb`')[0]).toEqual({ type: 'code', text: 'a b' })
		expect(types(parseInline('a ` b'))).toEqual(['text'])
		expect(inlineText(parseInline('a ` b'))).toBe('a ` b')
		expect(parseInline('**x `**` y**')[0].type).toBe('strong')
	})

	it('parses links with titles, angle destinations, nested brackets and emphasis inside', () => {
		expect(parseInline('[docs](/docs "The docs")')[0]).toEqual({
			type: 'link',
			href: '/docs',
			title: 'The docs',
			children: [{ type: 'text', text: 'docs' }],
		})
		expect(parseInline('[a](<https://x.test/a b>)')[0].href).toBe('https://x.test/a b')
		expect(parseInline('[a](https://x.test/(paren))')[0].href).toBe('https://x.test/(paren)')
		expect(parseInline("[a](/x 'single')")[0].title).toBe('single')
		expect(parseInline('[a](/x (round))')[0].title).toBe('round')
		expect(parseInline('[a **b** [c]](/x)')[0].children.map(n => n.type)).toEqual(['text', 'strong', 'text'])
		expect(parseInline('[a](/x\\)y)')[0].href).toBe('/x)y')
	})

	it('leaves malformed links and images as text', () => {
		for (const bad of ['[a]', '[a](', '[a](b', '[a](<b)', '[a](b "t)', '![a](b', '[a] (b)']) {
			expect(types(parseInline(bad))).not.toContain('link')
			expect(types(parseInline(bad))).not.toContain('image')
		}
	})

	it('parses images with alt text, titles and unsafe sources', () => {
		expect(parseInline('![A *cat*](/cat.png "Cat")')[0]).toEqual({
			type: 'image',
			src: '/cat.png',
			alt: 'A cat',
			title: 'Cat',
		})
		expect(parseInline('![x](javascript:alert(1))')[0]).toMatchObject({ type: 'image', src: '' })
	})

	it('parses autolinks, escapes and line breaks', () => {
		expect(parseInline('<https://x.test/a>')[0]).toMatchObject({ type: 'link', href: 'https://x.test/a' })
		expect(parseInline('<mailto:me@x.test>')[0]).toMatchObject({ href: 'mailto:me@x.test' })
		expect(inlineText(parseInline('\\*not em\\* \\[x\\] \\\\'))).toBe('*not em* [x] \\')
		expect(inlineText(parseInline('a\\qb'))).toBe('a\\qb')
		expect(types(parseInline('a  \nb'))).toEqual(['text', 'br', 'text'])
		expect(types(parseInline('a\\\nb'))).toEqual(['text', 'br', 'text'])
		expect(parseInline('a\nb')).toEqual([{ type: 'text', text: 'a b' }])
		expect(parseInline('<b>raw</b>')).toEqual([{ type: 'text', text: '<b>raw</b>' }])
	})

	it('describes every node as plain text', () => {
		expect(inlineText(parseInline('**a** [b `c`](/x) ![d](/y) e  \nf'))).toBe('a b c d e f')
	})
})

describe('parseMarkdown', () => {
	it('parses headings (with optional closing hashes) and paragraphs', () => {
		const blocks = parseMarkdown('# One\n\n## Two ##\n\n###### Six\n####### seven\n\n#\n\ntext\nmore')
		expect(blocks.map(b => b.type)).toEqual(['heading', 'heading', 'heading', 'paragraph', 'heading', 'paragraph'])
		expect(blocks.map(b => b.level)).toEqual([1, 2, 6, undefined, 1, undefined])
		expect(inlineText(blocks[1].children)).toBe('Two')
		expect(inlineText(blocks[3].children)).toBe('####### seven')
		expect(blocks[4].children).toEqual([])
		expect(inlineText(blocks[5].children)).toBe('text more')
	})

	it('parses thematic breaks and does not confuse them with lists', () => {
		expect(parseMarkdown('---\n***\n___\n- - -\n* * *').map(b => b.type)).toEqual(['hr', 'hr', 'hr', 'hr', 'hr'])
		expect(parseMarkdown('**bold** start')[0].type).toBe('paragraph')
	})

	it('parses fenced code with languages, tildes, longer fences, indentation and unterminated fences', () => {
		const [a, b, c, d] = parseMarkdown(
			'```js title\nconst a = 1\n\n```\n\n~~~\nplain\n~~~\n\n````\n```\n````\n\n  ```ts\n  x\n  y\n  ```'
		)
		expect(a).toEqual({ type: 'code', lang: 'js', text: 'const a = 1\n' })
		expect(b).toEqual({ type: 'code', lang: '', text: 'plain' })
		expect(c.text).toBe('```')
		expect(d).toEqual({ type: 'code', lang: 'ts', text: 'x\ny' })
		expect(parseMarkdown('```\nnever closed\nstill code')[0]).toEqual({
			type: 'code',
			lang: '',
			text: 'never closed\nstill code',
		})
		expect(parseMarkdown('``` not `a fence`')[0].type).toBe('paragraph')
	})

	it('parses blockquotes, nested, with lazy continuation lines', () => {
		const [quote] = parseMarkdown('> one\n> two\n>\n> > inner\n> - item')
		expect(quote.type).toBe('blockquote')
		expect(quote.children.map(b => b.type)).toEqual(['paragraph', 'blockquote', 'list'])
		expect(parseMarkdown('> first\nlazy line')[0].children).toHaveLength(1)
		expect(parseMarkdown('> a\n# heading').map(b => b.type)).toEqual(['blockquote', 'heading'])
	})

	it('parses unordered, ordered and nested lists', () => {
		const [list] = parseMarkdown('- one\n- two\n  - nested a\n  - nested b\n- three')
		expect(list).toMatchObject({ type: 'list', ordered: false, loose: false })
		expect(list.items).toHaveLength(3)
		expect(list.items[1].children.map(b => b.type)).toEqual(['paragraph', 'list'])
		expect(list.items[1].children[1].items).toHaveLength(2)
		const [ordered] = parseMarkdown('3. c\n4. d\n5) e')
		expect(ordered).toMatchObject({ ordered: true, start: 3 })
		expect(ordered.items).toHaveLength(3)
		expect(parseMarkdown('1. a\n2. b\n\n- x').map(b => b.type)).toEqual(['list', 'list'])
		expect(parseMarkdown('+ a\n+ b')[0].items).toHaveLength(2)
	})

	it('treats blank lines between items as a loose list and keeps multi-paragraph items together', () => {
		const [loose] = parseMarkdown('- a\n\n- b\n\n  more b\n- c')
		expect(loose.loose).toBe(true)
		expect(loose.items[1].children.map(b => b.type)).toEqual(['paragraph', 'paragraph'])
		expect(parseMarkdown('- a\n- b')[0].loose).toBe(false)
	})

	it('joins lazy continuation lines into the item and lets headings and fences end a list', () => {
		const [list] = parseMarkdown('- a\ncontinued\n- b')
		expect(inlineText(list.items[0].children[0].children)).toBe('a continued')
		expect(parseMarkdown('- a\n# H').map(b => b.type)).toEqual(['list', 'heading'])
		expect(parseMarkdown('- a\n\ntext').map(b => b.type)).toEqual(['list', 'paragraph'])
		expect(parseMarkdown('- a\n   under\n- b')[0].items[0].children).toHaveLength(1)
		expect(parseMarkdown('-\n- b')[0].items).toHaveLength(2)
	})

	it('does not let a number other than 1 or an empty item interrupt a paragraph', () => {
		expect(parseMarkdown('text\n2. not a list').map(b => b.type)).toEqual(['paragraph'])
		expect(parseMarkdown('text\n1. a list').map(b => b.type)).toEqual(['paragraph', 'list'])
		expect(parseMarkdown('text\n-').map(b => b.type)).toEqual(['paragraph'])
	})

	it('parses task list items and strips their markers', () => {
		const [list] = parseMarkdown('- [ ] todo\n- [x] done\n- [X] also done\n- plain\n- [ ]')
		expect(list.items.map(i => i.checked)).toEqual([false, true, true, null, false])
		expect(inlineText(list.items[0].children[0].children)).toBe('todo')
		expect(list.items[4].children[0].children).toEqual([])
	})

	it('parses tables with alignment, ragged rows and escaped pipes', () => {
		const [table] = parseMarkdown('| a | b | c | d |\n|:--|:-:|--:|---|\n| 1 | 2 | 3 | 4 |\n| x \\| y |\n\nafter')
		expect(table.align).toEqual(['left', 'center', 'right', null])
		expect(table.header.map(inlineText)).toEqual(['a', 'b', 'c', 'd'])
		expect(table.rows).toHaveLength(2)
		expect(inlineText(table.rows[1][0])).toBe('x | y')
		expect(table.rows[1][3]).toEqual([])
		expect(parseMarkdown('a | b\n--|--\n1 | 2')[0].type).toBe('table')
	})

	it('does not treat lookalikes as tables', () => {
		expect(parseMarkdown('a | b\nnot a delimiter')[0].type).toBe('paragraph')
		expect(parseMarkdown('a | b\n--|--|--')[0].type).toBe('paragraph')
		expect(parseMarkdown('a | b')[0].type).toBe('paragraph')
	})

	it('normalises line endings and tabs, and returns nothing for blank input', () => {
		expect(parseMarkdown('a\r\nb\r\n\r\nc').map(b => b.type)).toEqual(['paragraph', 'paragraph'])
		expect(parseMarkdown('- a\n\t- b')[0].items[0].children[1].type).toBe('list')
		expect(parseMarkdown('')).toEqual([])
		expect(parseMarkdown('  \n\n  ')).toEqual([])
	})
})

describe('Markdown', () => {
	it('renders headings with ids, and unique ids for repeated headings', () => {
		render(<Markdown>{'# Hello, World!\n## Hello, World!\n### 🚀\n#### Über uns'}</Markdown>)
		expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'hello-world')
		expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'hello-world-1')
		expect(screen.getByRole('heading', { level: 3 })).not.toHaveAttribute('id')
		expect(screen.getByRole('heading', { level: 4 })).toHaveAttribute('id', 'über-uns')
	})

	it('can leave ids off', () => {
		render(<Markdown headingIds={false}>{'# Title'}</Markdown>)
		expect(screen.getByRole('heading')).not.toHaveAttribute('id')
	})

	it('renders paragraphs, emphasis, strikethrough, code and breaks', () => {
		const { container } = render(<Markdown>{'a **b** *c* ~~d~~ `e`  \nnext'}</Markdown>)
		expect(container.querySelector('strong')).toHaveTextContent('b')
		expect(container.querySelector('em')).toHaveTextContent('c')
		expect(container.querySelector('del')).toHaveTextContent('d')
		expect(container.querySelector('code')).toHaveTextContent('e')
		expect(container.querySelector('br')).toBeInTheDocument()
	})

	it('renders lists: tight items without paragraphs, loose ones with, ordered start numbers, nesting', () => {
		const { container } = render(<Markdown>{'- a\n- b\n  - c\n\n3. x\n4. y\n\n- p\n\n- q'}</Markdown>)
		const [tight, ordered, loose] = [...container.querySelectorAll(':scope > div > ul, :scope > div > ol')]
		expect(tight.querySelector(':scope > li p')).toBeNull()
		expect(tight.querySelectorAll('li')).toHaveLength(3)
		expect(within(tight).getByText('c').closest('ul')).not.toBe(tight)
		expect(ordered.tagName).toBe('OL')
		expect(ordered).toHaveAttribute('start', '3')
		expect(loose.querySelectorAll('li p')).toHaveLength(2)
	})

	it('renders task items as disabled checkboxes with their state', () => {
		render(<Markdown>{'- [x] done\n- [ ] todo'}</Markdown>)
		const boxes = screen.getAllByRole('checkbox')
		expect(boxes[0]).toBeChecked()
		expect(boxes[1]).not.toBeChecked()
		expect(boxes[0]).toBeDisabled()
		expect(boxes[0]).toHaveAccessibleName('Done')
		expect(boxes[1]).toHaveAccessibleName('Not done')
	})

	it('keeps bullets on a list that mixes task items and plain ones, and drops them when every item is a task', () => {
		const { container } = render(<Markdown>{'- plain\n- [x] task\n\nbetween\n\n- [ ] a\n- [x] b'}</Markdown>)
		const [mixed, tasks] = container.querySelectorAll('ul')
		expect(mixed).toHaveClass('list-disc')
		expect(mixed.querySelectorAll('li')[1]).toHaveClass('-ml-6', 'list-none')
		expect(mixed.querySelectorAll('li')[0]).not.toHaveClass('-ml-6')
		expect(tasks).toHaveClass('list-none', 'pl-0')
		expect(tasks.querySelectorAll('li')[0]).not.toHaveClass('-ml-6')
	})

	it('renders blockquotes, rules and tables with alignment', () => {
		const { container } = render(<Markdown>{'> quoted\n\n---\n\n| a | b |\n|:-:|--:|\n| 1 | 2 |'}</Markdown>)
		expect(container.querySelector('blockquote')).toHaveTextContent('quoted')
		expect(container.querySelector('hr')).toBeInTheDocument()
		const headers = screen.getAllByRole('columnheader')
		expect(headers[0]).toHaveClass('text-center')
		expect(headers[1]).toHaveClass('text-right')
		expect(screen.getByText('2')).toHaveClass('text-right')
		expect(screen.getAllByRole('row')).toHaveLength(2)
	})

	it('renders fenced code through CodeDisplay, with its language', () => {
		const { container } = render(<Markdown>{'```js\nconst a = 1\n```\n\n```\nplain\n```'}</Markdown>)
		const blocks = container.querySelectorAll('figure')
		expect(blocks).toHaveLength(2)
		expect(blocks[0].querySelector('pre')).toHaveAttribute('data-language', 'js')
		expect(blocks[0]).toHaveTextContent('const a = 1')
		expect(blocks[1].querySelector('pre')).not.toHaveAttribute('data-language')
		expect(within(blocks[0]).getByRole('button', { name: /copy/i })).toBeInTheDocument()
	})

	it('renders images lazily with alt text and title, and shows the alt text when one fails to load', () => {
		const { container } = render(<Markdown>{'![A cat](/cat.png "Cat")'}</Markdown>)
		const img = screen.getByRole('img', { name: 'A cat' })
		expect(img).toHaveAttribute('src', '/cat.png')
		expect(img).toHaveAttribute('title', 'Cat')
		expect(img).toHaveAttribute('loading', 'lazy')
		fireEvent.error(img)
		expect(container.querySelector('img')).toBeNull()
		expect(container).toHaveTextContent('A cat')
	})

	it('sends links starting with / through linkComponent and linkProp, and the rest through plain anchors', () => {
		const Router = ({ to, children, ...rest }) => (
			<a data-router href={`#${to}`} {...rest}>
				{children}
			</a>
		)
		render(
			<Markdown linkComponent={Router} linkProp="to">
				{'[in](/docs "t") [out](https://example.com) [hash](#top) [proto](//cdn.test/x)'}
			</Markdown>
		)
		expect(screen.getByRole('link', { name: 'in' })).toHaveAttribute('data-router')
		expect(screen.getByRole('link', { name: 'in' })).toHaveAttribute('href', '#/docs')
		expect(screen.getByRole('link', { name: 'in' })).toHaveAttribute('title', 't')
		expect(screen.getByRole('link', { name: 'out' })).not.toHaveAttribute('data-router')
		expect(screen.getByRole('link', { name: 'out' })).toHaveAttribute('href', 'https://example.com')
		expect(screen.getByRole('link', { name: 'hash' })).not.toHaveAttribute('data-router')
		expect(screen.getByRole('link', { name: 'proto' })).not.toHaveAttribute('data-router')
	})

	it('lets isInternalLink decide, and opens links in a new tab on request', () => {
		const Router = ({ to, children }) => (
			<a data-router href={to}>
				{children}
			</a>
		)
		const { rerender } = render(
			<Markdown linkComponent={Router} linkProp="to" isInternalLink={href => href.startsWith('/app')}>
				{'[a](/app/home) [b](/plain)'}
			</Markdown>
		)
		expect(screen.getByRole('link', { name: 'a' })).toHaveAttribute('data-router')
		expect(screen.getByRole('link', { name: 'b' })).not.toHaveAttribute('data-router')
		expect(screen.getByRole('link', { name: 'b' })).not.toHaveAttribute('target')
		expect(screen.getByRole('link', { name: 'b' })).toHaveAttribute('rel', 'noopener noreferrer')
		rerender(<Markdown openLinksInNewTab>{'[b](https://b.test) [c](/inside)'}</Markdown>)
		expect(screen.getByRole('link', { name: 'b' })).toHaveAttribute('target', '_blank')
		expect(screen.getByRole('link', { name: 'c' })).not.toHaveAttribute('target')
	})

	describe('safety', () => {
		it('never interprets HTML: tags stay literal text', () => {
			const { container } = render(
				<Markdown>
					{'<script>window.__pwned = 1</script>\n\n<img src=x onerror="window.__pwned = 2">\n\n<b>bold?</b>'}
				</Markdown>
			)
			expect(container.querySelector('script')).toBeNull()
			expect(container.querySelector('b')).toBeNull()
			expect(screen.getByText(/<b>bold\?<\/b>/)).toBeInTheDocument()
			expect(container.querySelector('img')).toBeNull()
			expect(window.__pwned).toBeUndefined()
		})

		it('shows links with unsafe URLs as plain text', () => {
			const { container } = render(
				<Markdown>
					{'[click](javascript:alert(1)) [data](data:text/html,x) [ok](https://ok.test) <javascript:alert(1)>'}
				</Markdown>
			)
			expect(screen.getAllByRole('link')).toHaveLength(1)
			expect(screen.getByRole('link')).toHaveAttribute('href', 'https://ok.test')
			expect(container).toHaveTextContent('click')
			expect(container.innerHTML).not.toMatch(/href="javascript/i)
		})

		it('shows images with unsafe sources as their alt text', () => {
			const { container } = render(
				<Markdown>{'![fallback text](javascript:alert(1)) ![ok](data:image/png;base64,AAAA)'}</Markdown>
			)
			expect(container).toHaveTextContent('fallback text')
			expect(screen.getAllByRole('img')).toHaveLength(1)
			expect(container.innerHTML).not.toMatch(/src="javascript/i)
		})

		it('does not run event handlers written in attributes of Markdown links', () => {
			const { container } = render(<Markdown>{'[x](https://a.test" onclick="window.__pwned=3)'}</Markdown>)
			expect(container.querySelector('[onclick]')).toBeNull()
		})
	})

	it('renders nothing for empty input, takes a className, and accepts no children', () => {
		const { container, rerender } = render(<Markdown className="extra">{''}</Markdown>)
		expect(container.firstChild).toBeEmptyDOMElement()
		expect(container.firstChild).toHaveClass('extra')
		rerender(<Markdown />)
		expect(container.firstChild).toBeEmptyDOMElement()
	})
})
