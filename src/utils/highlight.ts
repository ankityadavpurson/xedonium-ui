// A tiny regex tokenizer for JS-like, shell, HTML / XML, CSS and Apache / nginx config snippets (no highlighter dependency).
// `highlight(code, language)` returns one array of { kind, text } segments per line; `kind` is null for plain text.

export type TokenKind = 'comment' | 'string' | 'keyword' | 'tag' | 'attr' | 'number' | 'fn'
export interface Segment {
	kind: TokenKind | null
	text: string
}
type Rule = [TokenKind, RegExp]
/** A custom tokenizer: one array of segments per line (see `highlight`). */
export type Highlighter = (code: string, language?: string | null) => Segment[][]

const JS_RULES: Rule[] = [
	['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\[\s\S])*`/],
	['tag', /<\/?(?:[A-Z][\w.]*|[a-z][\w-]*)(?=[\s>/])|<\/?>|\/?>/],
	[
		'keyword',
		/\b(?:import|from|export|default|const|let|var|function|return|if|else|new|true|false|null|undefined|async|await|for|of|in|typeof|void|class|extends|interface|type|enum|as|throw|try|catch|finally|switch|case|break|continue|while|do)\b/,
	],
	['number', /\b\d+(?:\.\d+)?\b/],
	['attr', /\b[A-Za-z_][\w-]*(?==)/],
	['fn', /\b[A-Za-z_$][\w$]*(?=\()/],
]

const SH_RULES: Rule[] = [
	['comment', /#[^\n]*/],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/],
	['keyword', /^(?:yarn|npm|npx|node|git|cd|pnpm|bun)\b/m],
	['attr', /(?<=\s)--?[A-Za-z][\w-]*/],
]

const QUOTED = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/

const HTML_RULES: Rule[] = [
	['comment', /<!--[\s\S]*?-->/],
	['tag', /<\/?[A-Za-z][\w:.-]*|<[!?][A-Za-z-]+|\??\/?>/],
	['attr', /[A-Za-z_:@][\w:.@-]*(?==)/],
	['string', new RegExp(String.raw`(?<==\s*)(?:${QUOTED.source})`)],
]

// Selectors are names followed by a `{` before any `;` or `}`; that keeps `#fff;` (a color) apart from `#main {`.
const CSS_RULES: Rule[] = [
	['comment', /\/\*[\s\S]*?\*\/|(?<![:\w])\/\/[^\n]*/],
	['string', QUOTED],
	['keyword', /@[\w-]+/],
	['tag', /(?<![\w(-])[.#]?[A-Za-z_-][\w-]*(?=[^;{}]*\{)/],
	['number', /#[0-9A-Fa-f]{3,8}(?![\w-])/],
	['number', /(?<![\w#-])-?(?:\d+(?:\.\d+)?|\.\d+)(?:[A-Za-z]+|%)?(?!\w)/],
	['fn', /[A-Za-z_-][\w-]*(?=\()/],
	['attr', /-{0,2}[A-Za-z][\w-]*(?=\s*:)/],
]

const APACHE_RULES: Rule[] = [
	['comment', /^[ \t]*#[^\n]*/],
	['string', QUOTED],
	['tag', /<\/?[A-Za-z]\w*|(?<=<[^<>\n]*)>/],
	['keyword', /(?<=^[ \t]*)[A-Za-z]\w*/],
	['attr', /\[[A-Za-z]+(?:=[\w:-]+)?(?:,[A-Za-z]+(?:=[\w:-]+)?)*\]|(?<=\s)[+-][A-Za-z]\w*/],
	['fn', /%\{[^}\n]*\}|%?\$\d/],
	['number', /(?<![\w.-])\d+(?![\w.])/],
]

const NGINX_RULES: Rule[] = [
	['comment', /#[^\n]*/],
	['string', QUOTED],
	['keyword', /(?<=(?:^|[{};])[ \t]*)[A-Za-z_]\w*(?=[\s;])/],
	['fn', /\$[A-Za-z_]\w*|\$\{\w+\}/],
	['number', /(?<![\w.$/-])\d+(?:\.\d+)?[kKmMgGsdhy]?(?![\w.])/],
]

// Keys are names followed by `:` and a space or line end, so `http://x` stays plain; `#` only starts a comment after whitespace.
const YAML_RULES: Rule[] = [
	['comment', /(?<=^|\s)#[^\n]*/],
	['fn', /\$\{\{[^}\n]*\}\}/],
	['string', QUOTED],
	['attr', /(?<=^[ \t]*(?:-[ \t]+)*)[\w.\/-]+(?=[ \t]*:(?:[ \t]|$))/],
	['keyword', /(?<=[\s:\[,-]|^)(?:true|false|null|yes|no|on|off)(?=[\s,\]]|$)/i],
	['number', /(?<=[\s:\[,-]|^)-?\d+(?:\.\d+)?(?=[\s,\]]|$)/],
]

const compile = (rules: Rule[]) => new RegExp(rules.map(([, re]) => `(${re.source})`).join('|'), 'gm')
const JS: [Rule[], RegExp] = [JS_RULES, compile(JS_RULES)]
const SH: [Rule[], RegExp] = [SH_RULES, compile(SH_RULES)]
const HTML: [Rule[], RegExp] = [HTML_RULES, compile(HTML_RULES)]
const CSS: [Rule[], RegExp] = [CSS_RULES, compile(CSS_RULES)]
const APACHE: [Rule[], RegExp] = [APACHE_RULES, compile(APACHE_RULES)]
const NGINX: [Rule[], RegExp] = [NGINX_RULES, compile(NGINX_RULES)]

const YAML: [Rule[], RegExp] = [YAML_RULES, compile(YAML_RULES)]

const GRAMMARS: Record<string, [Rule[], RegExp]> = {
	js: JS,
	jsx: JS,
	javascript: JS,
	ts: JS,
	tsx: JS,
	typescript: JS,
	json: JS,
	bash: SH,
	sh: SH,
	shell: SH,
	zsh: SH,
	html: HTML,
	htm: HTML,
	xml: HTML,
	svg: HTML,
	css: CSS,
	scss: CSS,
	apache: APACHE,
	htaccess: APACHE,
	nginx: NGINX,
	yaml: YAML,
	yml: YAML,
}

/** Language names (lowercase) that get syntax colors. */
export const HIGHLIGHTED_LANGUAGES = Object.keys(GRAMMARS)

/** Token kinds, in the order the default palette (`--xd-tok-*` in styles.css) defines them. */
export const TOKEN_KINDS: TokenKind[] = ['comment', 'string', 'keyword', 'tag', 'attr', 'number', 'fn']

const splitLines = (segments: Segment[]): Segment[][] => {
	const lines: Segment[][] = [[]]
	segments.forEach(({ kind, text }) => {
		text.split('\n').forEach((part, i) => {
			if (i > 0) lines.push([])
			if (part) lines[lines.length - 1].push({ kind, text: part })
		})
	})
	return lines
}

const highlight = (code: string, language?: string | null): Segment[][] => {
	const grammar = GRAMMARS[String(language ?? '').toLowerCase()]
	if (!grammar) return splitLines([{ kind: null, text: code }])
	const [rules, regex] = grammar
	const segments: Segment[] = []
	let last = 0
	for (const match of code.matchAll(regex)) {
		const start = match.index ?? 0
		if (start > last) segments.push({ kind: null, text: code.slice(last, start) })
		const kind = rules[match.findIndex((group, i) => i > 0 && group !== undefined) - 1][0]
		segments.push({ kind, text: match[0] })
		last = start + match[0].length
	}
	if (last < code.length) segments.push({ kind: null, text: code.slice(last) })
	return splitLines(segments)
}

export default highlight
