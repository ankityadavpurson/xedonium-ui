import { Markdown } from 'xedonium'

const source = `# Minion report

Kevin found **3** *bananas*. They are ~~heavy~~ small, have no seeds, and a \`peel\` shows inline.

## What the Minions got

- Bananas, banana bread and **banana smoothies**
- Lists, including nested ones:
  - a nested banana
  - another one
- [x] Peel the bananas
- [ ] Steal the moon

1. Wake up
2. Eat a banana

> Bello! Quotes are indented with a rule, and can hold *any* Markdown.

| Minion | Mood | Bananas |
|:-------|:----:|--------:|
| Kevin | happy | 4 |
| Stuart | hungry | 1 |

\`\`\`jsx
import { Markdown } from 'xedonium'

export default () => <Markdown>{'# Bello!'}</Markdown>
\`\`\`

---

Read the [docs](https://example.com/docs "Opens the docs"), or press the key. <b>HTML</b> stays plain text.`

export default function Demo() {
	return <Markdown>{source}</Markdown>
}
