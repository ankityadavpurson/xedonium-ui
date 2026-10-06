// A tiny regex tokenizer for JS-like and shell snippets (no highlighter dependency).
// `highlight(code, language)` returns one array of { kind, text } segments per line; `kind` is null for plain text.

const JS_RULES = [
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

const SH_RULES = [
	['comment', /#[^\n]*/],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/],
	['keyword', /^(?:yarn|npm|npx|node|git|cd|pnpm|bun)\b/m],
	['attr', /(?<=\s)--?[A-Za-z][\w-]*/],
]

const compile = rules => new RegExp(rules.map(([, re]) => `(${re.source})`).join('|'), 'gm')
const JS = [JS_RULES, compile(JS_RULES)]
const SH = [SH_RULES, compile(SH_RULES)]

const GRAMMARS = {
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
}

/** Token kinds, in the order the default palette (`--xd-tok-*` in styles.css) defines them. */
export const TOKEN_KINDS = ['comment', 'string', 'keyword', 'tag', 'attr', 'number', 'fn']

const splitLines = segments => {
	const lines = [[]]
	segments.forEach(({ kind, text }) => {
		text.split('\n').forEach((part, i) => {
			if (i > 0) lines.push([])
			if (part) lines[lines.length - 1].push({ kind, text: part })
		})
	})
	return lines
}

const highlight = (code, language) => {
	const grammar = GRAMMARS[String(language ?? '').toLowerCase()]
	if (!grammar) return splitLines([{ kind: null, text: code }])
	const [rules, regex] = grammar
	const segments = []
	let last = 0
	for (const match of code.matchAll(regex)) {
		if (match.index > last) segments.push({ kind: null, text: code.slice(last, match.index) })
		const kind = rules[match.findIndex((group, i) => i > 0 && group !== undefined) - 1][0]
		segments.push({ kind, text: match[0] })
		last = match.index + match[0].length
	}
	if (last < code.length) segments.push({ kind: null, text: code.slice(last) })
	return splitLines(segments)
}

export default highlight
