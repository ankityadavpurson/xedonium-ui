// First sentence-ish of a component page's first text block, without Markdown markers (for cards)
const summaryOf = component => {
	const md = component.blocks.find(block => block.md)?.md ?? ''
	const first = md
		.split('\n\n')[0]
		.replace(/[`*]/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
	return first.length > 110 ? `${first.slice(0, 107)}…` : first || 'Live example'
}

export default summaryOf
