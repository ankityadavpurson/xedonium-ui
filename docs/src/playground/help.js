// Notes shown behind a ? button at the top right of a component's Playground examples, by component slug
const HELP = {
	networkconnection: {
		label: 'How to test the banner',
		md: [
			'- In DevTools, open the **Network** tab and choose **Offline** in the throttling menu. Switch it back to "No throttling" to recover.',
			'- Turn Wi-Fi off or switch on airplane mode, then turn it back on.',
			'- For **connected, but no internet**: keep the network on and block the `probeUrl` (DevTools, Network, right-click the request, **Block request URL**), or point it at a host that does not exist. It needs a `probeUrl`; without one only the offline case can be detected.',
			'- Without touching your network, set `status` yourself, as the buttons in the third demo do.',
		].join('\n'),
	},
}

export default HELP
