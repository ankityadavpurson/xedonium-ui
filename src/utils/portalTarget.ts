// Where floating UI (menus, tooltips) is rendered. In fullscreen only the fullscreen element and its children are
// visible, so portal into it; otherwise use <body>. (iOS fullscreens the <video> itself, which cannot hold children.)
const portalTarget = (): HTMLElement => {
	const element =
		document.fullscreenElement ??
		(document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement
	return element && element.tagName !== 'VIDEO' ? (element as HTMLElement) : document.body
}

export default portalTarget
