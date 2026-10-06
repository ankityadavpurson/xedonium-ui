// Where floating UI (menus, tooltips) is rendered. In fullscreen only the fullscreen element and its children are
// visible, so portal into it; otherwise use <body>. (iOS fullscreens the <video> itself, which cannot hold children.)
const portalTarget = () => {
	const element = document.fullscreenElement ?? document.webkitFullscreenElement
	return element && element.tagName !== 'VIDEO' ? element : document.body
}

export default portalTarget
