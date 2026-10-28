import { describe, expect, it } from 'vitest'
import highlight, { HIGHLIGHTED_LANGUAGES } from '../../src/utils/highlight'

// [kind, text] pairs of every colored segment in the code
const colored = (code, language) =>
	highlight(code, language)
		.flat()
		.filter(segment => segment.kind)
		.map(segment => [segment.kind, segment.text])

describe('highlight', () => {
	it('stays plain for unknown languages and matches names case-insensitively', () => {
		expect(colored('a { color: red }', 'brainfuck')).toEqual([])
		expect(colored('const a = 1', 'JS').length).toBeGreaterThan(0)
		expect(colored('a { color: red }', 'CSS').length).toBeGreaterThan(0)
	})

	it('lists the supported languages', () => {
		expect(HIGHLIGHTED_LANGUAGES).toEqual(
			expect.arrayContaining(['js', 'bash', 'html', 'css', 'apache', 'htaccess', 'nginx'])
		)
	})

	it('colors yaml keys, scalars, comments and actions expressions', () => {
		const code = '# ci\non: push\njobs:\n  - name: "Build"\n    run: echo ${{ github.ref }} # now\n    retries: 3\n    url: http://a#b\n'
		expect(colored(code, 'yml')).toEqual([
			['comment', '# ci'],
			['attr', 'on'],
			['attr', 'jobs'],
			['attr', 'name'],
			['string', '"Build"'],
			['attr', 'run'],
			['fn', '${{ github.ref }}'],
			['comment', '# now'],
			['attr', 'retries'],
			['number', '3'],
			['attr', 'url'],
		])
		expect(colored('on: true', 'yaml')).toEqual([
			['attr', 'on'],
			['keyword', 'true'],
		])
	})

	it('colors html tags, attributes, strings and comments', () => {
		expect(colored('<!-- note -->\n<a href="/x" class=\'y\'>Don\'t "quote"</a>', 'html')).toEqual([
			['comment', '<!-- note -->'],
			['tag', '<a'],
			['attr', 'href'],
			['string', '"/x"'],
			['attr', 'class'],
			['string', "'y'"],
			['tag', '>'],
			['tag', '</a'],
			['tag', '>'],
		])
		expect(colored('<svg viewBox="0 0 1 1"/>', 'svg').map(([kind]) => kind)).toEqual(['tag', 'attr', 'string', 'tag'])
	})

	it('colors css selectors, properties, units and at-rules', () => {
		expect(colored('@media (min-width: 600px) {\n  a:hover { width: 100%; margin: -1.5em 0 }\n}', 'css')).toEqual([
			['keyword', '@media'],
			['attr', 'min-width'],
			['number', '600px'],
			['tag', 'a'],
			['tag', 'hover'],
			['attr', 'width'],
			['number', '100%'],
			['attr', 'margin'],
			['number', '-1.5em'],
			['number', '0'],
		])
	})

	it('tells css selectors from hex colors', () => {
		expect(colored('#main {\n  color: #fff;\n  background: #0a0a0a\n}', 'css')).toEqual([
			['tag', '#main'],
			['attr', 'color'],
			['number', '#fff'],
			['attr', 'background'],
			['number', '#0a0a0a'],
		])
	})

	it('colors css functions, strings and comments', () => {
		expect(colored('a { background: url("x.png"); /* hi */ }\n// scss', 'scss')).toEqual([
			['tag', 'a'],
			['attr', 'background'],
			['fn', 'url'],
			['string', '"x.png"'],
			['comment', '/* hi */'],
			['comment', '// scss'],
		])
		expect(colored('a { background: url(http://x.test/a.png) }', 'css').some(([kind]) => kind === 'comment')).toBe(
			false
		)
	})

	it('colors apache directives, sections and rewrite flags', () => {
		expect(
			colored(
				'# comment\n<Directory "/var/www">\n  Options -Indexes\n  RewriteRule ^(.*)$ /$1 [L,R=301]\n</Directory>',
				'htaccess'
			)
		).toEqual([
			['comment', '# comment'],
			['tag', '<Directory'],
			['string', '"/var/www"'],
			['tag', '>'],
			['keyword', 'Options'],
			['attr', '-Indexes'],
			['keyword', 'RewriteRule'],
			['fn', '$1'],
			['attr', '[L,R=301]'],
			['tag', '</Directory'],
			['tag', '>'],
		])
	})

	it('colors nginx directives, variables and numbers', () => {
		expect(
			colored('server {\n  listen 80; # port\n  proxy_pass http://$host:8080;\n  allow 127.0.0.1;\n}', 'nginx')
		).toEqual([
			['keyword', 'server'],
			['keyword', 'listen'],
			['number', '80'],
			['comment', '# port'],
			['keyword', 'proxy_pass'],
			['fn', '$host'],
			['number', '8080'],
			['keyword', 'allow'],
		])
	})

	it('keeps one entry per line and the original text', () => {
		const code = '<div>\n  <p class="a">x</p>\n</div>'
		const lines = highlight(code, 'html')
		expect(lines).toHaveLength(3)
		expect(lines.map(line => line.map(segment => segment.text).join('')).join(String.fromCharCode(10))).toBe(code)
	})
})
