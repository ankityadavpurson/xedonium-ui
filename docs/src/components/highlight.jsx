import { Fragment } from 'react'

// A tiny regex tokenizer for the JS / JSX / shell snippets in these docs (no highlighter dependency).
// Colors come from the --tok-* variables in main.css (VS Code's Light Modern / Dark Modern), so they follow the theme.

const JS_RULES = [
	['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\[\s\S])*`/],
	// text between JSX tags is plain, so it must not be colored like code
	['text', /(?<=[^=]>)[^<>{}]+(?=[<{])/],
	['keyword', /=>/],
	// `<` / `>` and the tag names around them: components (capitalised) and HTML tags are colored apart
	['punct', /<\/?(?=[A-Za-z>])|(?<!=)\/?>/],
	['component', /(?<=<\/?)[A-Z][\w.]*/],
	['tag', /(?<=<\/?)[a-z][\w-]*/],
	['control', /\b(?:import|from|export|default|return|if|else|for|of|await)\b/],
	['keyword', /\b(?:const|let|var|function|new|true|false|null|undefined|async|in|typeof|void)\b/],
	['number', /\b\d+(?:\.\d+)?\b/],
	['attr', /\b[A-Za-z_][\w-]*(?==)/],
	['fn', /\b[A-Za-z_$][\w$]*(?=\()/],
	// object keys and members, then every other name
	['property', /(?<=[{,]\s*)[A-Za-z_$][\w$]*(?=\s*:)|(?<=\.)[A-Za-z_$][\w$]*/],
	['variable', /\b[A-Za-z_$][\w$]*\b/],
	['bracket', /[()[\]{}]/],
]

const SH_RULES = [
	['comment', /#[^\n]*/],
	['string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/],
	['keyword', /^(?:yarn|npm|npx|node|git|cd)\b/m],
	['attr', /(?<=\s)--?[A-Za-z][\w-]*/],
]

const compile = rules => new RegExp(rules.map(([, re]) => `(${re.source})`).join('|'), 'gm')
const COMPILED = { js: [JS_RULES, compile(JS_RULES)], bash: [SH_RULES, compile(SH_RULES)] }

const OPENERS = '([{'
const CLOSERS = ')]}'

// Which brackets have a partner: [index in `matches`] -> depth of the pair (1 = outermost), for those that do. The rest
// are left out, and do not count towards the depth of the others, so a half-typed bracket does not recolor everything
// after it.
const pairBrackets = (matches, kinds) => {
	// first find the partners, then number only the paired ones
	const partner = new Map()
	const stack = []
	matches.forEach((match, i) => {
		if (kinds[i] !== 'bracket') return
		if (OPENERS.includes(match[0])) stack.push(i)
		else if (stack.length && OPENERS.indexOf(matches[stack.at(-1)][0]) === CLOSERS.indexOf(match[0])) {
			const opener = stack.pop()
			partner.set(opener, i)
			partner.set(i, opener)
		}
	})
	const depths = new Map()
	let depth = 0
	matches.forEach((match, i) => {
		if (!partner.has(i)) return
		if (OPENERS.includes(match[0])) depths.set(i, ++depth).set(partner.get(i), depth)
		else depth--
	})
	return depths
}

/** Returns React nodes for `code`, wrapping recognised tokens in <span className="tok-…">. */
export const highlight = (code, lang = 'js') => {
	const [rules, regex] = COMPILED[lang] ?? COMPILED.js
	const matches = [...code.matchAll(regex)]
	const kinds = matches.map(match => rules[match.findIndex((group, i) => i > 0 && group !== undefined) - 1][0])
	const depths = pairBrackets(matches, kinds)
	const nodes = []
	let last = 0
	matches.forEach((match, i) => {
		if (match.index > last) nodes.push(code.slice(last, match.index))
		let kind = kinds[i]
		// paired brackets take one of three colors by nesting depth, like VS Code's bracket pair colorization; a bracket
		// with no partner is flagged
		if (kind === 'bracket') kind = depths.has(i) ? `b${depths.get(i) % 3}` : 'bx'
		nodes.push(
			<span key={match.index} className={`tok-${kind}`}>
				{match[0]}
			</span>
		)
		last = match.index + match[0].length
	})
	if (last < code.length) nodes.push(<Fragment key="end">{code.slice(last)}</Fragment>)
	return nodes
}
