import { Markdown } from 'xedonium'

const source = `# Release notes

Xedonium **0.11** adds a *Markdown* component. It is ~~heavy~~ small, has no dependencies, and shows \`code\` inline.

## What you get

- Headings, paragraphs and **emphasis**
- Lists, including nested ones:
  - an inner item
  - another one
- [x] Task lists
- [ ] with unchecked items

1. Ordered lists
2. count for you

> Quotes are indented with a rule, and can hold *any* Markdown.

| Part | Status | Size |
|:-----|:------:|-----:|
| Parser | done | 4 kB |
| Styles | done | 1 kB |

\`\`\`jsx
import { Markdown } from 'xedonium'

export default () => <Markdown>{'# Hello'}</Markdown>
\`\`\`

---

Read the [docs](https://example.com/docs "Opens the docs"), or press the key. <b>HTML</b> stays plain text.`

export default function Demo() {
	return <Markdown>{source}</Markdown>
}
