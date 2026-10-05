import { Fragment } from 'react'

// A tiny regex tokenizer for the JS / JSX / shell snippets in these docs (no highlighter dependency).
// Colors come from the --tok-* variables in main.css, so they follow the light / dark theme.

const JS_RULES = [
	['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\[\s\S])*`/],
	['tag', /<\/?(?:[A-Z][\w.]*|[a-z][\w-]*)(?=[\s>/])|<\/?>|\/?>/],
	[
		'keyword',
		/\b(?:import|from|export|default|const|let|var|function|return|if|else|new|true|false|null|undefined|async|await|for|of|in|typeof|void)\b/,
	],
	['number', /\b\d+(?:\.\d+)?\b/],
	['attr', /\b[A-Za-z_][\w-]*(?==)/],
	['fn', /\b[A-Za-z_$][\w$]*(?=\()/],
]

const SH_RULES = [
	['comment', /#[^\n]*/],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/],
	['keyword', /^(?:yarn|npm|npx|node|git|cd)\b/m],
	['attr', /(?<=\s)--?[A-Za-z][\w-]*/],
]

const compile = rules => new RegExp(rules.map(([, re]) => `(${re.source})`).join('|'), 'gm')
const COMPILED = { js: [JS_RULES, compile(JS_RULES)], bash: [SH_RULES, compile(SH_RULES)] }

/** Returns React nodes for `code`, wrapping recognised tokens in <span className="tok-…">. */
export const highlight = (code, lang = 'js') => {
	const [rules, regex] = COMPILED[lang] ?? COMPILED.js
	const nodes = []
	let last = 0
	for (const match of code.matchAll(regex)) {
		if (match.index > last) nodes.push(code.slice(last, match.index))
		const kind = rules[match.findIndex((group, i) => i > 0 && group !== undefined) - 1][0]
		nodes.push(
			<span key={match.index} className={`tok-${kind}`}>
				{match[0]}
			</span>
		)
		last = match.index + match[0].length
	}
	if (last < code.length) nodes.push(<Fragment key="end">{code.slice(last)}</Fragment>)
	return nodes
}
