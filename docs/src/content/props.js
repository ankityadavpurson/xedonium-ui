// Props tables, keyed by page slug then component name. Row: [name, type, default, description].
// `yarn docs:check` (scripts/check-docs.mjs) fails if a documented prop is missing here or no longer exists.

const className = ['className', 'string', "''", 'Extra classes for the root element.']
const children = ['children', 'ReactNode', '', 'Content.']
const rest = ['...rest', '', '', 'Any other props are passed to the underlying element.']
const link = [
	['linkComponent', 'ElementType', "'a'", 'Component used for links, e.g. a router Link.'],
	['linkProp', 'string', "'href'", 'Name of the destination prop on `linkComponent` (e.g. "to" for react-router).'],
]
const gap = ['gap', '0 | 1 | 2 | 3 | 4 | 6 | 8', '', 'Spacing between children (Tailwind spacing steps).']
const as = ['as', 'ElementType', "'div'", 'Element or component to render.']
const fieldError = ['error', 'string', '', 'Error message shown below the control; sets the invalid style.']
const animate = [
	'animate',
	'boolean',
	'true',
	'Animate the chart in when it appears and glide it to new values when the data changes (skipped for users who prefer reduced motion).',
]
const smooth = [
	'smooth',
	'boolean',
	'false',
	'Draw curves instead of straight segments. They pass through every point and never overshoot it.',
]
const chartSeries = [
	['labels', 'string[]', '', 'Names of the x positions / categories.'],
	['series', '{ name, values: number[], color? }[]', '', 'One entry per series; `values` has one number per label.'],
	['height', 'number', '300', 'Chart height in px (width follows the container).'],
	['label', 'string', '', 'Accessible name for the chart.'],
	['legend', 'boolean', 'true', 'Show the legend when there are several series.'],
	className,
]

const props = {
	// Layout
	container: {
		Container: [['maxWidth', 'string', "'max-w-5xl'", 'Tailwind max-width class.'], className, as, children, rest],
	},
	'stack-flex': {
		Stack: [
			['direction', "'column' | 'row'", "'column'", 'Main axis.'],
			['gap', '0 | 1 | 2 | 3 | 4 | 6 | 8', '4', 'Spacing between children.'],
			['...Flex props', '', '', 'Everything `Flex` accepts.'],
		],
		Flex: [
			['direction', "'row' | 'column'", "'row'", 'Main axis.'],
			['gap', '0 | 1 | 2 | 3 | 4 | 6 | 8', '3', 'Spacing between children.'],
			['align', "'start' | 'center' | 'end' | 'stretch' | 'baseline'", '', 'Cross-axis alignment.'],
			['justify', "'start' | 'center' | 'end' | 'between' | 'around'", '', 'Main-axis distribution.'],
			['wrap', 'boolean', 'false', 'Allow items to wrap.'],
			['inline', 'boolean', 'false', 'Use inline-flex.'],
			className,
			as,
			children,
			rest,
		],
	},
	grid: {
		Grid: [
			['cols', '1 | 2 | 3 | 4 | 5 | 6 | 12', '2', 'Number of columns.'],
			gap,
			['responsive', 'boolean', 'true', 'Use fewer columns on small screens; `false` keeps `cols` everywhere.'],
			className,
			as,
			children,
			rest,
		],
	},
	divider: {
		Divider: [
			['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Direction of the rule.'],
			['label', 'string', '', 'Centered text (horizontal only).'],
			className,
		],
	},
	'pagelayout-and-pageheader': {
		PageLayout: [
			children,
			['maxWidth', 'string', "'max-w-5xl'", 'Tailwind max-width class for the content column.'],
			['centerContent', 'boolean', 'false', 'Vertically and horizontally center the content.'],
			['themeToggle', 'boolean', 'false', 'Show a floating theme toggle.'],
			['outerClassName', 'string', "''", 'Extra classes for the outer wrapper.'],
			['innerClassName', 'string', "''", 'Extra classes for the inner column.'],
		],
		PageHeader: [
			['title', 'ReactNode', '', 'Page title.'],
			['subtitle', 'ReactNode', '', 'Small uppercase line under the title.'],
			['children', 'ReactNode', '', 'Page actions, shown on the right.'],
		],
	},

	// Typography
	'page-title': {
		PageTitle: [['as', 'ElementType', "'h1'", 'Element to render.'], className, children, rest],
	},
	'body-text': {
		BodyText: [['as', 'ElementType', "'p'", 'Element to render.'], className, children, rest],
	},
	'helper-text': {
		HelperText: [['as', 'ElementType', "'p'", 'Element to render.'], className, children, rest],
	},
	label: {
		Label: [
			['htmlFor', 'string', '', 'id of the control this labels; renders a <label> when set.'],
			['as', 'ElementType', '', 'Element to render (default: label with htmlFor, otherwise span).'],
			className,
			children,
			rest,
		],
	},
	'text-link': {
		TextLink: [['href', 'string', '', 'Link destination.'], ...link, className, children, rest],
	},

	// Inputs
	button: {
		Button: [
			['variant', "'default' | 'secondary' | 'flat' | 'success' | 'danger' | 'warning'", "'default'", 'Visual style.'],
			['tooltip', 'string', '', 'Shows a styled Tooltip (use instead of the native `title`).'],
			['tooltipPlacement', 'string', "'bottom'", 'Tooltip placement (see Tooltip).'],
			['onClick', '(event) => void', '', 'Click handler.'],
			['type', 'string', "'button'", 'Native button type.'],
			['disabled', 'boolean', 'false', 'Disable the button.'],
			className,
			children,
			rest,
		],
	},
	'button-link': {
		ButtonLink: [
			['href', 'string', '', 'Link destination.'],
			[
				'variant',
				"'default' | 'secondary' | 'flat' | 'success' | 'danger' | 'warning'",
				"'default'",
				'Visual style (same as Button).',
			],
			['disabled', 'boolean', 'false', 'Sets aria-disabled, removes the tab stop and blocks navigation.'],
			...link,
			['onClick', '(event) => void', '', 'Click handler.'],
			className,
			children,
			rest,
		],
	},
	field: {
		Field: [
			['label', 'string', '', 'Label text.'],
			['value', 'string', '', 'Current value.'],
			['onChange', '(value: string) => void', '', 'Called with the new value.'],
			['placeholder', 'string', '', 'Placeholder text.'],
			fieldError,
			['type', 'string', "'text'", 'Native input type.'],
			['autoComplete', 'string', "'off'", 'Native autocomplete attribute.'],
			['required', 'boolean', 'true', 'Sets aria-required.'],
			['...inputProps', '', '', 'Passed to the <input>.'],
		],
	},
	input: {
		Input: [
			['value', 'string', '', 'Current value.'],
			['onChange', '(value: string) => void', '', 'Called with the new value.'],
			['invalid', 'boolean', 'false', 'Error style and aria-invalid.'],
			['type', 'string', "'text'", 'Native input type.'],
			className,
			rest,
		],
	},
	select: {
		Select: [
			['label', 'string', '', 'Label text.'],
			['value', 'string', '', 'Selected value.'],
			['onChange', '(value: string) => void', '', 'Called with the new value.'],
			['options', '{ value, label, disabled? }[]', '', 'Options to choose from.'],
			['placeholder', 'string', '', 'Text shown when nothing is selected.'],
			fieldError,
			['disabled', 'boolean', 'false', 'Disable the control.'],
			['name', 'string', '', 'Adds a hidden input so the value is submitted with a form.'],
			[
				'variant',
				"'default' | 'flat'",
				"'default'",
				'A bordered field, or a borderless flat trigger for toolbars and over media.',
			],
			className,
			rest,
		],
	},
	passwordinput: {
		PasswordInput: [
			['label', 'string', '', 'Label text.'],
			['value', 'string', '', 'Current value.'],
			['onChange', '(value: string) => void', '', 'Called with the new value.'],
			fieldError,
			['placeholder', 'string', '', 'Placeholder text.'],
			['autoComplete', 'string', "'current-password'", 'Native autocomplete hint.'],
			['disabled', 'boolean', 'false', 'Disable the input and toggle.'],
			className,
			rest,
		],
	},
	textarea: {
		TextArea: [
			['label', 'string', '', 'Label text.'],
			['value', 'string', "''", 'Current value.'],
			['onChange', '(value: string) => void', '', 'Called with the new value.'],
			fieldError,
			['rows', 'number', '4', 'Visible rows.'],
			['maxLength', 'number', '', 'Maximum length; also shows a character count.'],
			['resize', 'boolean', 'true', 'Allow vertical resizing.'],
			className,
			rest,
		],
	},
	multiselect: {
		MultiSelect: [
			['label', 'string', '', 'Label text.'],
			['value', 'string[]', '[]', 'Selected values.'],
			['onChange', '(value: string[]) => void', '', 'Called with the new array of values.'],
			['options', '{ value, label, disabled? }[]', '', 'Options to choose from.'],
			['placeholder', 'string', '', 'Text shown when nothing is selected.'],
			['searchable', 'boolean', 'false', 'Let the user type to filter the options.'],
			['clearable', 'boolean', 'true', 'Show a clear-all button while something is selected.'],
			['emptyText', 'string', "'No matches'", 'Text shown when a search matches nothing.'],
			[
				'filter',
				'(query, option) => boolean',
				'',
				'Custom matching; default is a case-insensitive "contains" on the label.',
			],
			fieldError,
			['disabled', 'boolean', 'false', 'Disable the control.'],
			['name', 'string', '', 'Adds a hidden input per selected value so they are submitted with a form.'],
			className,
			rest,
		],
	},
	searchselect: {
		SearchSelect: [
			['label', 'string', '', 'Label text.'],
			['value', 'string', '', 'Selected value.'],
			['onChange', '(value: string) => void', '', 'Called with the new value.'],
			['options', '{ value, label, disabled? }[]', '', 'Options to choose from.'],
			['placeholder', 'string', "'Search…'", 'Input placeholder.'],
			['emptyText', 'string', "'No matches'", 'Text shown when nothing matches.'],
			[
				'filter',
				'(query, option) => boolean',
				'',
				'Custom matching; default is a case-insensitive "contains" on the label.',
			],
			['onSearch', '(query: string) => void', '', 'Called as the user types (and with "" when the list closes).'],
			fieldError,
			['disabled', 'boolean', 'false', 'Disable the control.'],
			['name', 'string', '', 'Adds a hidden input so the value is submitted with a form.'],
			className,
			rest,
		],
	},
	checkbox: {
		Checkbox: [
			['label', 'ReactNode', '', 'Label text.'],
			['checked', 'boolean', '', 'Checked state.'],
			['onChange', '(checked: boolean) => void', '', 'Called with the new state.'],
			['indeterminate', 'boolean', 'false', 'Show the mixed state.'],
			['disabled', 'boolean', 'false', 'Disable the control.'],
			className,
			rest,
		],
	},
	radio: {
		Radio: [
			['label', 'ReactNode', '', 'Label text.'],
			['disabled', 'boolean', 'false', 'Disable the control.'],
			className,
			['...input props', '', '', 'name, value, checked, onChange and the rest go to the <input>.'],
		],
		RadioGroup: [
			['label', 'string', '', 'Group legend.'],
			['name', 'string', '', 'Shared input name (generated if omitted).'],
			['value', 'string', '', 'Selected value.'],
			['onChange', '(value: string) => void', '', 'Called with the chosen value.'],
			['options', '{ value, label, disabled? }[]', '', 'Radios to render.'],
			['direction', "'column' | 'row'", "'column'", 'Layout of the radios.'],
		],
	},
	switch: {
		Switch: [
			['checked', 'boolean', '', 'On/off state.'],
			['onChange', '(checked: boolean) => void', '', 'Called with the new state.'],
			['label', 'ReactNode', '', 'Label text.'],
			['disabled', 'boolean', 'false', 'Disable the control.'],
			className,
			rest,
		],
	},
	slider: {
		Slider: [
			['label', 'string', '', 'Label text.'],
			['value', 'number', '', 'Current value.'],
			['onChange', '(value: number) => void', '', 'Called with the new number.'],
			['min', 'number', '0', 'Minimum.'],
			['max', 'number', '100', 'Maximum.'],
			['step', 'number', '1', 'Step.'],
			['showValue', 'boolean', 'true', 'Show the value beside the label.'],
			[
				'buffered',
				'number',
				'',
				'Draws a lighter band from the thumb up to this value, like the loaded part of a video seek bar.',
			],
			['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'A vertical slider has its minimum at the bottom.'],
			['length', 'number', '112', 'Height in px of a vertical slider.'],
			[
				'valueLabel',
				'(value: number) => ReactNode',
				'',
				'Formats the value shown in a popover above the thumb while dragging or using the keyboard.',
			],
			className,
			rest,
		],
	},
	fileupload: {
		FileUpload: [
			['label', 'string', "'Choose files or drop them here'", 'Drop-zone text.'],
			['accept', 'string', '', 'Accepted file types (native `accept`).'],
			['multiple', 'boolean', 'false', 'Allow several files.'],
			['onChange', '(files: File[]) => void', '', 'Called with the selected files.'],
			['disabled', 'boolean', 'false', 'Disable the control.'],
		],
	},

	// Navigation
	appbar: {
		AppBar: [
			['brand', 'ReactNode', '', 'Brand name or element.'],
			['logo', 'ReactNode', '', 'Logo shown before the brand.'],
			['brandHref', 'string', "'/'", 'Where the brand links to.'],
			['links', '{ href, label, active?, ...linkProps }[]', '[]', 'Navigation links.'],
			['actions', 'ReactNode', '', 'Extra controls on the right.'],
			['themeToggle', 'boolean', 'true', 'Show the theme toggle.'],
			['hideBrandOnMobile', 'boolean', 'false', 'Hide the brand text on small screens.'],
			...link,
			['maxWidth', 'string', "'max-w-5xl'", 'Tailwind max-width class.'],
		],
	},
	tabs: {
		Tabs: [
			['items', '{ key, label, content?, disabled? }[]', '', 'Tabs; `content` is shown in the panel when active.'],
			['value', 'string', '', 'Active key (controlled).'],
			['defaultValue', 'string', 'first key', 'Initially active key (uncontrolled).'],
			['onChange', '(key: string) => void', '', 'Called when the active tab changes.'],
			className,
		],
	},
	breadcrumb: {
		Breadcrumb: [
			['items', '{ label, href? }[]', '', 'Trail items; the last one is the current page.'],
			...link,
			className,
		],
	},
	pagination: {
		Pagination: [
			['page', 'number', '', 'Current page (1-based).'],
			['pageCount', 'number', '', 'Total number of pages.'],
			['onChange', '(page: number) => void', '', 'Called with the new page.'],
			['siblings', 'number', '1', 'Page numbers shown each side of the current page.'],
			['pageSize', 'number', '', 'Current items per page (shown in the per-page select).'],
			[
				'pageSizeOptions',
				'number[]',
				'',
				'Choices for the per-page select; the select shows only with `onPageSizeChange` too.',
			],
			['onPageSizeChange', '(size: number) => void', '', 'Called with the chosen page size.'],
			['pageSizeLabel', 'string', "'Per page'", 'Label of the per-page select.'],
			className,
		],
	},
	stepper: {
		Stepper: [
			['steps', '{ label, description? }[]', '', 'Steps in order.'],
			['current', 'number', '0', 'Active step (0-based); earlier steps are marked done.'],
			className,
		],
	},

	// Feedback
	alert: {
		Alert: [
			['tone', "'info' | 'success' | 'warning' | 'danger'", "'info'", 'Color and ARIA role.'],
			['title', 'ReactNode', '', 'Bold heading.'],
			['onClose', '() => void', '', 'Makes the alert dismissible.'],
			['icon', 'ReactNode', 'InfoIcon', 'Leading icon.'],
			className,
			children,
		],
	},
	progress: {
		Progress: [
			['value', 'number', '', '0-100. Omit for an indeterminate bar or spinning ring.'],
			['label', 'string', '', 'Label and accessible name.'],
			['showValue', 'boolean', 'false', 'Show the percentage (beside the label, or inside the ring).'],
			['variant', "'linear' | 'circular'", "'linear'", 'A bar or a ring.'],
			['size', "'sm' | 'md' | 'lg'", "'md'", 'Ring size (32 / 64 / 96 px). Ignored by the linear bar.'],
			className,
		],
	},
	skeleton: {
		Skeleton: [
			['lines', 'number', '', 'Render a paragraph of this many text lines.'],
			['circle', 'boolean', 'false', 'Round placeholder (e.g. avatars).'],
			['className', 'string', "'h-4 w-full'", 'Size the placeholder with classes.'],
		],
	},
	loaders: {
		Loader: [
			[
				'variant',
				"'fan' | 'spinner' | 'dots' | 'shimmer' | 'inline' | 'stacked' | 'card'",
				"'fan'",
				'Loader style. fan renders FanFavicon; the others are described above.',
			],
			[
				'size',
				"'sm' | 'md' | 'lg'",
				"'md'",
				'Overall size (fan 32 / 64 / 96 px, ring 16 / 32 / 48 px; the text scales with it).',
			],
			[
				'label',
				'string',
				"'Loading'",
				'Loading text shown by every variant except spinner (which keeps it for screen readers only).',
			],
			['description', 'string', '', 'Helper line under the label (card variant only).'],
			[
				'icon',
				'string | ReactNode',
				'',
				'Custom mark instead of the built-in fan or ring: an emoji, an image URL or path (png, svg, data:…) or an element such as an inline <svg>. Ignored by dots and shimmer.',
			],
			['iconMotion', "'spin' | 'pulse' | 'bounce' | 'none'", "'spin'", 'How the custom icon animates.'],
			className,
		],
		FanFavicon: [
			['size', 'number', '64', 'Size in px.'],
			['theme', "'light' | 'dark'", '', 'Force a theme instead of following the page.'],
			['label', 'string', '', 'Accessible label.'],
		],
	},

	'loading-screen': {
		LoadingScreen: [
			['variant', 'string', "'fan'", 'Same as Loader.'],
			['size', "'sm' | 'md' | 'lg'", "'md'", 'Same as Loader.'],
			['label', 'string', "'Loading'", 'Same as Loader.'],
			['description', 'string', '', 'Same as Loader (card variant).'],
			['icon', 'string | ReactNode', '', 'Same as Loader.'],
			['iconMotion', "'spin' | 'pulse' | 'bounce' | 'none'", "'spin'", 'Same as Loader.'],
		],
	},

	// Overlay
	tooltip: {
		Tooltip: [
			['text', 'string', '', 'Tooltip text.'],
			['as', 'ElementType', "'span'", 'Wrapper element. Use "g" to put a tooltip on SVG shapes.'],
			[
				'followPointer',
				'boolean',
				'false',
				'Place the tooltip at the mouse pointer instead of beside the trigger (for large shapes).',
			],
			['children', 'ReactElement', '', 'The element that triggers it on hover and focus.'],
			[
				'placement',
				"'top' | 'bottom' | 'left' | 'right' | 'auto'",
				"'bottom'",
				'Preferred side, optionally with -start / -end (e.g. "top-start"). Flips when there is no room; auto picks the best fit.',
			],
			className,
		],
	},
	actionmenu: {
		ActionMenu: [
			['label', 'string', '', 'Accessible label of the trigger.'],
			['trigger', 'ReactNode', '', 'Trigger button content.'],
			['variant', 'string', "'secondary'", 'Button variant of the trigger (e.g. "warning").'],
			['items', '{ key, label, description?, badge?, tone?, disabled?, hasDialog?, onClick }[]', '', 'Menu entries.'],
			[
				'placement',
				'string',
				"'bottom-start'",
				'Where the menu opens, e.g. "bottom-end" or "top-start". Flips above or to the other edge when there is no room, and re-adjusts on scroll and resize.',
			],
			className,
		],
	},
	drawer: {
		Drawer: [
			['open', 'boolean', '', 'Whether the drawer is shown.'],
			['onClose', '() => void', '', 'Called on Escape, backdrop click or the close button.'],
			['title', 'ReactNode', '', 'Header title.'],
			['side', "'right' | 'left'", "'right'", 'Edge it slides from.'],
			['width', 'string', "'max-w-md'", 'Tailwind max-width class.'],
			['padded', 'boolean', 'true', 'Pad and scroll the body; false lets the content fill the drawer itself.'],
			['footer', 'ReactNode', '', 'Footer actions.'],
			children,
		],
	},
	popover: {
		Popover: [
			['trigger', 'ReactNode', '', 'Trigger button content.'],
			['label', 'string', '', 'Accessible label for the trigger and panel.'],
			['variant', 'string', "'secondary'", 'Button variant of the trigger.'],
			['align', "'start' | 'end'", "'start'", 'Shorthand for placement bottom-start / bottom-end.'],
			[
				'placement',
				'string',
				'',
				'top | bottom | left | right | auto, optionally with -start / -end. Overrides align.',
			],
			className,
			['children', 'ReactNode', '', 'Panel content.'],
		],
	},
	dialog: {
		Modal: [
			['open', 'boolean', '', 'Whether the dialog is shown.'],
			['onClose', '() => void', '', 'Called on Escape, backdrop click or the close button.'],
			['title', 'ReactNode', '', 'Header title.'],
			['tone', "'default' | 'danger'", "'default'", 'Header accent.'],
			['busy', 'boolean', 'false', 'Ignore dismissal while an action runs.'],
			['dismissible', 'boolean', 'true', 'Set false to ignore Escape and backdrop clicks only.'],
			['role', 'string', "'dialog'", 'ARIA role (e.g. "alertdialog").'],
			['describedBy', 'string', '', 'id of the element describing the dialog.'],
			['maxWidth', 'string', "'max-w-lg'", 'Tailwind max-width class.'],
			['as', 'ElementType', "'div'", 'Container element; use "form" with `onSubmit` for a form dialog.'],
			['footer', 'ReactNode', '', 'Footer actions.'],
			className,
			children,
			['...containerProps', '', '', 'Passed to the container element.'],
		],
		ConfirmDialog: [
			['open', 'boolean', '', 'Whether the dialog is shown.'],
			['onClose', '() => void', '', 'Called when cancelled or dismissed.'],
			['onConfirm', '() => void', '', 'Called when the confirm button is pressed.'],
			['title', 'ReactNode', '', 'Header title.'],
			['tone', "'default' | 'danger'", "'default'", 'Use "danger" for destructive actions.'],
			['busy', 'boolean', 'false', 'Shows a spinner on the confirm button and ignores dismissal.'],
			['confirmLabel', 'string', "'Confirm'", 'Confirm button text.'],
			['busyLabel', 'string', '', 'Confirm button text while busy.'],
			['cancelLabel', 'string', "'Cancel'", 'Cancel button text.'],
			['error', 'string', '', 'Error message shown in the dialog.'],
			children,
		],
	},
	toast: {
		Toast: [
			[
				'toasts',
				'{ id, msg, type?, link?, actions?, icon? }[]',
				'',
				'Toasts to stack, from `useTimedToast`. `type` is "success" (default), "danger" (or "error"), "warning" or "info"; `actions` is `{ label, onClick }[]`.',
			],
			['toast', '{ msg, type?, ... } | null', '', 'A single toast, when you do not need a stack.'],
			[
				'position',
				"'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
				"'bottom-right'",
				'Where the toasts appear on the screen.',
			],
			[
				'onClose',
				'(id) => void',
				'',
				'Adds a dismiss button to each toast, and dismisses it after an action is used (pass `hideToast`).',
			],
		],
	},

	// Data display
	badge: {
		Badge: [
			['badgeContent', 'ReactNode', '', 'Number or text shown in the badge.'],
			[
				'color',
				"'default' | 'secondary' | 'flat' | 'success' | 'danger' | 'warning' | 'info'",
				"'default'",
				'Badge color.',
			],
			['size', "'sm' | 'md'", "'md'", 'Size of a content badge.'],
			['variant', "'standard' | 'dot'", "'standard'", 'A content badge or a plain dot.'],
			['max', 'number', '99', 'Numbers above this show as "<max>+".'],
			['showZero', 'boolean', 'false', 'Show the badge when `badgeContent` is 0.'],
			[
				'invisible',
				'boolean',
				'',
				'Force the badge hidden (or shown); by default it hides when there is nothing to show.',
			],
			[
				'overlap',
				"'rectangular' | 'circular'",
				"'rectangular'",
				'Use `circular` so the badge sits on the edge of a round child.',
			],
			[
				'anchorOrigin',
				"{ vertical: 'top' | 'bottom', horizontal: 'left' | 'right' }",
				"{ vertical: 'top', horizontal: 'right' }",
				'Which corner the badge sits on.',
			],
			className,
			children,
			rest,
		],
	},
	chip: {
		Chip: [
			['selected', 'boolean', '', 'Filled style; also sets aria-pressed when `onClick` is given.'],
			['onClick', '(event) => void', '', 'Makes the chip a toggle button.'],
			['onRemove', '(event) => void', '', 'Adds a remove button.'],
			['removeLabel', 'string', '', 'Accessible name of the remove button (default "Remove <text>").'],
			['leading', 'ReactNode', '', 'Icon or avatar shown before the text.'],
			['size', "'sm' | 'md'", "'md'", 'Chip size.'],
			['disabled', 'boolean', 'false', 'Disable the chip and its buttons.'],
			className,
			children,
			rest,
		],
	},
	accordion: {
		Accordion: [
			['items', '{ key, title, content, disabled? }[]', '', 'Sections.'],
			['value', 'string[]', '', 'Open keys (controlled).'],
			['defaultValue', 'string[]', '[]', 'Initially open keys (uncontrolled).'],
			['onChange', '(keys: string[]) => void', '', 'Called with the new array of open keys.'],
			['multiple', 'boolean', 'false', 'Allow several sections open at once.'],
			[
				'gap',
				"'none' | 'sm' | 'md' | 'lg'",
				"'none'",
				'Space between items (0.5 / 1 / 1.5rem). Any gap gives each item its own border.',
			],
			className,
		],
	},
	codedisplay: {
		CodeDisplay: [
			['code', 'string', '', 'Code to show.'],
			['language', 'string', '', 'Caption shown in the header (no highlighting).'],
			['title', 'string', '', 'Header text; overrides `language` as the caption.'],
			['lineNumbers', 'boolean', 'false', 'Show line numbers.'],
			['copyable', 'boolean', 'true', 'Show a copy button.'],
			['wrap', 'boolean', 'false', 'Wrap long lines instead of scrolling.'],
			['maxHeight', 'number | string', '', 'Maximum height before the block scrolls.'],
			[
				'highlight',
				'boolean',
				'true',
				'Color the code by syntax. Colors apply for js, jsx, ts, tsx, json, bash and sh.',
			],
			[
				'colors',
				'{ comment?, string?, keyword?, tag?, attr?, number?, fn?, text?, background? }',
				'',
				'Override the theme-aware default colors with any CSS colors.',
			],
			className,
		],
	},
	card: {
		Card: [
			['title', 'ReactNode', '', 'Header title.'],
			['subtitle', 'ReactNode', '', 'Text under the title.'],
			['actions', 'ReactNode', '', 'Header actions.'],
			['footer', 'ReactNode', '', 'Footer content.'],
			['padded', 'boolean', 'true', 'Pad the body; false for edge-to-edge content.'],
			className,
			children,
		],
	},
	table: {
		Table: [
			['columns', '{ key, header, render?(row), align? }[]', '', 'Column definitions.'],
			['rows', 'object[]', '', 'Row data.'],
			['rowKey', 'string', "'id'", 'Field holding each row’s unique key.'],
			['empty', 'ReactNode', "'No data'", 'Shown when there are no rows.'],
			['caption', 'string', '', 'Screen-reader caption.'],
			className,
		],
	},
	datagrid: {
		DataGrid: [
			[
				'columns',
				'{ key, header, sortable?, render?(row), align?, accessor?(row) }[]',
				'',
				'Column definitions; `accessor` supplies the sort and search value.',
			],
			['rows', 'object[]', '', 'Row data.'],
			['rowKey', 'string', "'id'", 'Field holding each row’s unique key.'],
			['pageSize', 'number', '10', 'Rows per page (the starting size when `pageSizeOptions` is set).'],
			['pageSizeOptions', 'number[]', '', 'Adds a "Per page" select with these sizes.'],
			['onPageSizeChange', '(size: number) => void', '', 'Called when the user picks a page size.'],
			['searchable', 'boolean', 'false', 'Show a search box.'],
			['selectable', 'boolean', 'false', 'Show row checkboxes.'],
			['selected', 'Array', '', 'Selected row keys (controlled).'],
			['onSelectionChange', '(keys) => void', '', 'Called when the selection changes.'],
			['empty', 'ReactNode', "'No results'", 'Shown when nothing matches.'],
			['caption', 'string', '', 'Screen-reader caption.'],
			className,
		],
	},
	tree: {
		Tree: [
			['nodes', '{ key, label, children? }[]', '', 'Tree data.'],
			['selected', 'string', '', 'Selected node key.'],
			['onSelect', '(key) => void', '', 'Called when a node is selected.'],
			['defaultExpanded', 'string[]', '[]', 'Initially expanded keys (uncontrolled).'],
			['expanded', 'string[]', '', 'Expanded keys (controlled).'],
			['onExpandedChange', '(keys) => void', '', 'Called when expansion changes.'],
			['label', 'string', "'Tree'", 'Accessible name.'],
			[
				'renderLabel',
				'(node, depth) => ReactNode',
				'',
				'Custom row content, e.g. a link or different styling per level.',
			],
			className,
		],
	},
	timeline: {
		Timeline: [
			[
				'items',
				'{ key, title, description?, time?, tone? }[]',
				'',
				'Events; `tone` is default | success | warning | danger.',
			],
			className,
		],
	},
	list: {
		List: [
			[
				'items',
				'{ key, primary, secondary?, leading?, trailing?, onClick? }[]',
				'',
				'Rows; ones with `onClick` become buttons.',
			],
			['divided', 'boolean', 'true', 'Draw lines between rows.'],
			className,
		],
	},

	// Charts
	linechart: {
		LineChart: [
			...chartSeries.slice(0, 5),
			['area', 'boolean', 'false', 'Fill under each line.'],
			smooth,
			animate,
			className,
		],
	},
	areachart: { AreaChart: [...chartSeries.slice(0, 5), smooth, animate, className] },
	barchart: {
		BarChart: [
			...chartSeries.slice(0, 5),
			['stacked', 'boolean', 'false', 'Stack series instead of grouping them.'],
			animate,
			className,
		],
	},
	piechart: {
		PieChart: [
			['data', '{ label, value, color? }[]', '', 'Slices.'],
			['donut', 'boolean', 'false', 'Render a ring.'],
			['center', 'ReactNode', '', 'Text in the donut hole.'],
			['label', 'string', "'Pie chart'", 'Accessible name.'],
			animate,
			className,
		],
	},

	// Date & time
	calendar: {
		Calendar: [
			['value', 'Date | null', '', 'Selected date.'],
			['onChange', '(date: Date) => void', '', 'Called with the clicked date.'],
			['rangeStart', 'Date | null', '', 'Start of a highlighted range.'],
			['rangeEnd', 'Date | null', '', 'End of a highlighted range.'],
			['min', 'Date', '', 'Earliest selectable date.'],
			['max', 'Date', '', 'Latest selectable date.'],
			['weekStartsOn', '0 | 1', '0', 'First day of the week (0 = Sunday).'],
			['locale', 'string', '', 'Locale for month and weekday names.'],
			className,
		],
	},
	datepicker: {
		DatePicker: [
			['label', 'string', '', 'Label text.'],
			['value', 'Date | null', '', 'Selected date.'],
			['onChange', '(date: Date) => void', '', 'Called with the picked date.'],
			['min', 'Date', '', 'Earliest selectable date.'],
			['max', 'Date', '', 'Latest selectable date.'],
			['placeholder', 'string', "'Select date'", 'Text when no date is chosen.'],
			fieldError,
			['locale', 'string', '', 'Locale for formatting.'],
			['weekStartsOn', '0 | 1', '0', 'First day of the week.'],
		],
	},
	daterangepicker: {
		DateRangePicker: [
			['label', 'string', '', 'Label text.'],
			['value', '{ start, end }', '', 'Selected range (Dates or null).'],
			['onChange', '({ start, end }) => void', '', 'Called as the range is picked.'],
			['min', 'Date', '', 'Earliest selectable date.'],
			['max', 'Date', '', 'Latest selectable date.'],
			['placeholder', 'string', "'Select range'", 'Text when no range is chosen.'],
			fieldError,
			['locale', 'string', '', 'Locale for formatting.'],
			['weekStartsOn', '0 | 1', '0', 'First day of the week.'],
		],
	},
	timepicker: {
		TimePicker: [
			['label', 'string', '', 'Label text.'],
			['value', 'string', '', 'Time as 24-hour "HH:MM".'],
			['onChange', '(value: string) => void', '', 'Called with the new "HH:MM".'],
			['step', 'number', '900', 'Minute granularity in seconds (900 = every 15 minutes).'],
			['min', 'string', '', 'Earliest time ("HH:MM").'],
			['max', 'string', '', 'Latest time ("HH:MM").'],
			['hour12', 'boolean', 'false', 'Show a 12-hour clock with AM / PM (the value stays 24-hour).'],
			['placeholder', 'string', "'Select time'", 'Text when no time is chosen.'],
			fieldError,
			['disabled', 'boolean', 'false', 'Disable the control.'],
			className,
			rest,
		],
	},

	// Media
	avatar: {
		Avatar: [
			['src', 'string', '', 'Image URL; shown if it loads, otherwise children or initials are.'],
			['alt', 'string', "''", 'Alt text of the image. Leave empty when name already says who it is.'],
			['name', 'string', '', 'Person’s name (initials and accessible name, also for the link).'],
			['size', "'sm' | 'md' | 'lg'", "'md'", 'Size.'],
			['shape', "'circle' | 'rounded' | 'square'", "'circle'", 'Outline of the avatar.'],
			['href', 'string', '', 'Makes the avatar a link to this URL.'],
			['linkComponent', 'ElementType', "'a'", 'Component used for the link, e.g. a router Link.'],
			['linkProp', 'string', "'href'", 'Name of the destination prop on linkComponent (e.g. "to" for react-router).'],
			['children', 'ReactNode', '', 'Custom content (icon, <img>) shown instead of the initials.'],
			className,
			rest,
		],
	},
	sound: {
		Sound: [
			['src', 'string', '', 'Audio URL.'],
			['title', 'string', "'Audio'", 'Track title, also the accessible name of the player.'],
			['artist', 'string', '', 'Second line under the title.'],
			[
				'art',
				'string',
				'',
				'Cover art image URL, shown as a square beside the controls (with an icon if it fails to load).',
			],
			['artAlt', 'string', "''", 'Alt text of the cover art; leave empty when the title already describes it.'],
			['speeds', 'number[]', '[0.5, 0.75, 1, 1.25, 1.5, 2]', 'Playback rates offered in the speed menu (1 is normal).'],
			className,
			['children', 'ReactNode', '', 'e.g. <source> elements for several formats.'],
			['...rest', '', '', 'Passed to the <audio> element.'],
		],
	},
	carousel: {
		Carousel: [
			['children', 'ReactNode', '', 'One child per slide.'],
			['index', 'number', '', 'Current slide (controlled).'],
			['defaultIndex', 'number', '0', 'Initial slide (uncontrolled).'],
			['onIndexChange', '(index: number) => void', '', 'Called when the slide changes.'],
			['autoPlay', 'number', '0', 'Auto-advance interval in ms (0 = off); pauses on hover and focus.'],
			['loop', 'boolean', 'true', 'Wrap around at the ends.'],
			['label', 'string', "'Carousel'", 'Accessible name.'],
			className,
		],
	},
	image: {
		Image: [
			['src', 'string', '', 'Image URL.'],
			['alt', 'string', '', 'Alternative text.'],
			['ratio', "'square' | 'video' | 'photo'", '', 'Fixed aspect ratio.'],
			['fit', "'cover' | 'contain'", "'cover'", 'How the image fills its box.'],
			['fallback', 'ReactNode', "'Image unavailable'", 'Shown if loading fails.'],
			className,
			rest,
		],
	},
	video: {
		Video: [
			['src', 'string', '', 'Video URL.'],
			['poster', 'string', '', 'Poster image URL.'],
			['title', 'string', "'Video'", 'Accessible name.'],
			['ratio', "'video' | string", "'video'", 'Use "video" for 16:9, anything else leaves it unset.'],
			['autoHide', 'boolean', 'true', 'Fade the controls out while playing when there is no activity.'],
			['hideDelay', 'number', '2500', 'Milliseconds without activity before the controls hide.'],
			[
				'sources',
				'{ label, src }[]',
				'',
				'Several resolutions of the same video, e.g. [{ label: "1080p", src }, { label: "4K", src }]. Adds a quality menu; used instead of `src`.',
			],
			['defaultQuality', 'string', '', 'Label of the source to start with (default: the first one).'],
			['speeds', 'number[]', '[0.5, 0.75, 1, 1.25, 1.5, 2]', 'Playback rates offered in the speed menu (1 is normal).'],
			className,
			['children', 'ReactNode', '', 'e.g. <track> elements for captions.'],
			['...rest', '', '', 'Passed to the <video> element.'],
		],
	},

	// Application
	navbar: {
		Navbar: [
			['brand', 'ReactNode', '', 'Brand name or element.'],
			['links', '{ href, label, active?, ...linkProps }[]', '[]', 'Navigation links.'],
			['actions', 'ReactNode', '', 'Controls on the right.'],
			...link,
			['label', 'string', "'Main'", 'Accessible name of the nav.'],
			className,
		],
	},
	sidebar: {
		Sidebar: [
			[
				'items',
				'{ key, label, icon?, href?, onClick?, badge?, children? }[]',
				'',
				'Navigation entries; `children` makes a group.',
			],
			['activeKey', 'string', '', 'Key of the current item.'],
			['onSelect', '(key: string) => void', '', 'Called when any item is clicked.'],
			['header', 'ReactNode', '', 'Content above the list.'],
			['footer', 'ReactNode', '', 'Content below the list.'],
			['collapsed', 'boolean', 'false', 'Icons only (give every item an `icon`).'],
			...link,
			['label', 'string', "'Sidebar'", 'Accessible name.'],
			className,
		],
	},
	appshell: {
		AppShell: [
			['header', 'ReactNode', '', 'Header content.'],
			[
				'sidebar',
				'ReactNode | (close) => ReactNode',
				'',
				'Sidebar; a function receives `close` for the mobile drawer.',
			],
			['sidebarTitle', 'string', "'Menu'", 'Title of the mobile drawer.'],
			['children', 'ReactNode', '', 'Main content.'],
			className,
		],
	},
	'dashboard-and-statcard': {
		Dashboard: [
			['title', 'ReactNode', '', 'Page title.'],
			['subtitle', 'ReactNode', '', 'Text under the title.'],
			['actions', 'ReactNode', '', 'Header actions.'],
			['stats', '{ label, value, delta?, trend?, hint? }[]', '[]', 'Stat tiles.'],
			['columns', '1 | 2 | 3', '2', 'Columns of the panel grid.'],
			['children', 'ReactNode', '', 'Panels.'],
		],
		StatCard: [
			['label', 'string', '', 'Metric name.'],
			['value', 'ReactNode', '', 'Metric value.'],
			['delta', 'string', '', 'Change shown beside the value.'],
			['trend', "'up' | 'down' | 'flat'", "'flat'", 'Colors the delta.'],
			['hint', 'string', '', 'Small text below.'],
			className,
		],
	},
	commandpalette: {
		CommandPalette: [
			['open', 'boolean', '', 'Whether the palette is shown.'],
			['onClose', '() => void', '', 'Called on Escape, backdrop click, and after a command runs.'],
			['commands', '{ key, label, description?, group?, shortcut?, onSelect }[]', '', 'Commands to search.'],
			['placeholder', 'string', "'Type a command…'", 'Search box placeholder.'],
			['empty', 'string', "'No matching commands'", 'Shown when nothing matches.'],
		],
	},
	notfoundpage: {
		NotFoundPage: [
			[
				'code',
				'string',
				"'404'",
				'Large status code shown above the title (read out before the title by screen readers).',
			],
			['title', 'string', "'Page not found'", 'Heading of the page.'],
			[
				'description',
				'string',
				"'The page you are looking for does not exist or has moved.'",
				'Short explanation; pass an empty string to hide it.',
			],
			['homeHref', 'string | null', "'/'", 'Destination of the home link; `null` hides it.'],
			['homeLabel', 'string', "'Go home'", 'Text of the home link.'],
			['onBack', '() => void', '', 'Adds a "go back" button that calls this (e.g. `() => navigate(-1)`).'],
			['backLabel', 'string', "'Go back'", 'Text of the back button.'],
			...link,
			['fullScreen', 'boolean', 'false', 'Center it in the whole viewport instead of filling the space it is given.'],
			className,
			['children', 'ReactNode', '', 'Extra content under the buttons.'],
		],
	},
	notificationcenter: {
		NotificationCenter: [
			['notifications', '{ id, title, body?, time?, read? }[]', '', 'Notifications, newest first.'],
			['onSelect', '(notification) => void', '', 'Called when one is clicked.'],
			['onMarkRead', '(id) => void', '', 'Called when an unread one is clicked.'],
			['onMarkAllRead', '() => void', '', 'Adds a "Mark all read" action.'],
			['onClear', '() => void', '', 'Adds a "Clear" action.'],
			['empty', 'string', "'You are all caught up'", 'Shown when there are none.'],
			['align', "'end' | 'start'", "'end'", 'Which edge of the bell the panel aligns to.'],
		],
	},

	// Utilities
	portal: {
		Portal: [children, ['container', 'Element', 'document.body', 'Where to render the children.']],
	},
	focustrap: {
		FocusTrap: [['active', 'boolean', 'true', 'Trap focus while true.'], className, children, rest],
	},
	sortablelist: {
		SortableList: [
			['items', '{ key, label?, ... }[]', '', 'Items with a unique `key`.'],
			['onChange', '(items) => void', '', 'Called with the new order.'],
			['renderItem', '(item, index) => ReactNode', '', 'Renders a row’s content.'],
			['label', 'string', "'Sortable list'", 'Accessible name.'],
			className,
		],
	},
	virtuallist: {
		VirtualList: [
			['items', 'any[]', '', 'All items.'],
			['itemHeight', 'number', '', 'Fixed row height in px.'],
			['height', 'number', '320', 'Viewport height in px.'],
			['overscan', 'number', '4', 'Extra rows rendered above and below.'],
			['renderItem', '(item, index) => ReactNode', '', 'Renders a row’s content.'],
			['getKey', '(item, index) => key', 'index', 'Row key.'],
			['label', 'string', "'List'", 'Accessible name.'],
			className,
		],
	},
	usekeyboardshortcuts: {
		useKeyboardShortcuts: [
			[
				'shortcuts',
				'{ [combo: string]: (event) => void }',
				'',
				'Combos like "mod+k", "shift+?" or "g". Modifiers: mod, ctrl, alt, shift, meta.',
			],
			['enabled', 'boolean', 'true', 'Pause the shortcuts.'],
		],
	},
}

export default props
