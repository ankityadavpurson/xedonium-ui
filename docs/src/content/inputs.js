export default {
	slug: 'inputs',
	label: 'Inputs',
	description: 'Buttons and form controls. Value callbacks receive the value, not the event.',
	components: [
		{
			slug: 'richtexteditor',
			name: 'RichTextEditor',
			beta: true,
			blocks: [
				{
					md: '**Beta.** This component is new and still being tested: expect rough edges, and its props and the HTML it produces may change before it is declared stable. Please report anything odd.',
				},
				{
					md: 'A WYSIWYG editor with no dependencies: a formatting toolbar over an editable area. Bold, italic, underline, strike, inline code, headings, bulleted and numbered lists, quotes, code blocks, alignment, text color and highlight, links, images, tables, rules, clear formatting, undo and redo. Keyboard: `Ctrl` / `Cmd` + `B`, `I`, `U`, `K` (link), `Z`, `Y`.\n\n`value` and `onChange` carry the content (or `defaultValue` for an uncontrolled editor); empty content is an empty string. **The HTML is always sanitized**, on the way in, on paste and on the way out: only a fixed set of tags, links and styles survives, so a script, an event handler or a `javascript:` address can never get in or out. Text pasted from other pages is cleaned the same way.',
				},
				{
					example: 1,
				},
				{
					md: '**Markdown.** `format="markdown"` makes `value` Markdown instead of HTML, using the same parser as [Markdown](/components/typography/markdown). Markdown has no underline, colors or alignment, so those buttons are left out, and code blocks do not keep a language. Switching `format` shows the same content in the new format.',
				},
				{
					example: 2,
				},
				{
					md: "**Toolbar and more.** `toolbar` lists the buttons you want (`'|'` is a divider), or `false` for none; the names are `undo`, `redo`, `block`, `bold`, `italic`, `underline`, `strike`, `code`, `color`, `highlight`, `link`, `unlink`, `image`, `ul`, `ol`, `quote`, `codeblock`, `hr`, `table`, `left`, `center`, `right`, `justify`, `fullscreen` and `clear`. The `fullscreen` button (last in the default toolbar) makes the editor fill the window: `fullScreen`, `defaultFullScreen` and `onFullScreenChange` control it, the page behind does not scroll, and Escape leaves it. `label`, `helperText` and `error` work as on `TextArea`; `minHeight` and `maxHeight` size the writing area; `readOnly` shows the content without the toolbar. **Resizing.** Click an image to select it: drag the corner handle, or use the buttons for 25%, 50%, 100% or its original size (and Remove, or the Delete key). Drag the right border of a table cell to change that column's width. Sizes are saved as plain `width` attributes in the HTML, so they travel with the content; Markdown has no way to say them, so the Markdown format drops them. The image picker always has an **Upload** button (and images can be pasted): with `onImageUpload` the file goes to your server and you resolve with its address; without it the image is embedded in the content as a `data:` address, up to `maxInlineImageSize` (2 MB), which is handy for a demo but makes the value large. `name` adds a hidden input so the value travels in a native form. The pure helpers are exported too: `sanitizeHtml`, `markdownToHtml` and `htmlToMarkdown`.",
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'button',
			name: 'Button',
			blocks: [
				{
					md: 'Variants: `default`, `secondary`, `flat`, `success`, `danger`, `warning`. Pass `tooltip` for a styled tooltip instead of the native `title`.\n\nChildren are laid out in a row with a gap, so an icon next to the text sits beside it: `<Button><PlusIcon />New</Button>`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'button-link',
			name: 'ButtonLink',
			blocks: [
				{
					md: 'A link styled like `Button`, with the same variants. `disabled` sets `aria-disabled` and blocks navigation. `linkComponent` / `linkProp` swap in a router link.\n\nLike `Button`, icons and text sit side by side.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'button-group',
			name: 'ButtonGroup',
			blocks: [
				{
					md: 'Joins `Button`s into one bar with shared borders. Mark the active one with a different `variant`, or use `aria-pressed` for a toggle group; the hovered, focused and pressed button rises above its neighbours so its border stays whole. Give the group an `aria-label` that says what the buttons have in common.',
				},
				{
					example: 1,
				},
				{
					md: '`orientation="vertical"` stacks them, `fullWidth` stretches the group and shares the space equally, and `attached={false}` keeps a gap between the buttons.',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'floating-action-button',
			name: 'FloatingActionButton',
			blocks: [
				{
					md: 'The main action of a screen: a raised button (square like the rest of the library, or round with `shape="circle"`) holding an icon (give it an `aria-label`), or an icon plus a `label` when extended. `size` is `sm`, `md` or `lg`; `variant` and `tooltip` work as on `Button`; `color` takes a variant name or any CSS color (`#2563eb`), with the text switching to black or white so it stays readable.\n\nPass `position` (for example `bottom-right`) to fix it to a corner of the viewport; without it the button sits where you put it.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'number-field',
			name: 'NumberField',
			blocks: [
				{
					md: 'A number input with minus and plus buttons. `onChange` receives a number (or `null` when the field is emptied), never a string. Arrow Up and Down step by `step` (Shift takes ten steps) and Home / End jump to `min` / `max`.\n\nTyping stays free: the value is clamped to `min` / `max` and rounded to `precision` (by default the decimals of `step`) when you leave the field or use the buttons.',
				},
				{
					example: 1,
				},
				{
					md: '`error` and `helperText` show a message under the field, `showControls={false}` hides the buttons, and `disabled` locks it. Other props such as `placeholder` and `name` go to the input.',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'rating',
			name: 'Rating',
			blocks: [
				{
					md: 'A star rating from 0 to `max` (5 by default). Click a star to set it, click the same one again to clear it. `precision={0.5}` allows half stars, and hovering previews the value you would pick.\n\nIt is a slider for keyboards and screen readers: Left / Right or Up / Down change it by one step, Home clears it and End gives the maximum. `readOnly` shows a score, such as an average review, without letting it change.\n\n`color` colors the filled icons: `default`, `warning` (the usual gold), `danger`, `success`, `info`, or any CSS color.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'toggle-button',
			name: 'ToggleButton',
			blocks: [
				{
					md: '`ToggleButton` is a button that stays pressed (`aria-pressed`), shown as a filled button. On its own, use `selected` and `onChange`. Put several in a `ToggleButtonGroup` and give each a `value`: by default any number can be pressed (`value` is an array), and with `exclusive` at most one (`value` is a string, or `null` when none is). Controlled with `value` + `onChange`, or uncontrolled with `defaultValue`.\n\nThe group takes the same layout props as [ButtonGroup](/components/inputs/button-group).',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'transfer-list',
			name: 'TransferList',
			blocks: [
				{
					md: 'Two lists with checkboxes and buttons to move items between them: pick what to include, which permissions to grant, who to invite. `items` is everything; `value` holds the keys that are in the right-hand list and `onChange` receives the new keys.\n\nTick items and use the single arrows to move the ticked ones, or the double arrows to move everything that can move. The header checkbox ticks a whole list. A `disabled` item stays where it is.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'field',
			name: 'Field',
			blocks: [
				{
					md: 'Labelled input. Props: `label`, `value`, `onChange` (receives the value string), `placeholder`, `error`, `type`,\n`autoComplete`, `required`.\n\n`helperText` shows a hint under the field while there is no `error`, and links it to the control with `aria-describedby`. `Select`, `TextArea` and `PasswordInput` take it too.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'input',
			name: 'Input',
			blocks: [
				{
					md: 'Unlabeled text input; use `Field` when you need a label and error text. `onChange` receives the value string, and\n`invalid` sets the error style.\n\n`startAdornment` and `endAdornment` put an icon or a button inside the field and pad the text to clear them. The start adornment is decorative (clicks go through to the input); the end one can be interactive, for example a clear button.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'passwordinput',
			name: 'PasswordInput',
			blocks: [
				{
					md: 'Labelled password field with a show / hide toggle. `onChange` receives the value string. `autoComplete` defaults to `current-password`; use `new-password` on sign-up forms.\n\n`helperText` shows a hint under the field while there is no `error`, and links it to the control with `aria-describedby`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'passwordstrengthinfo',
			name: 'PasswordStrengthInfo',
			blocks: [
				{
					md: 'A strength meter with a checklist of rules. Pass the current `password`. The built-in rules are length (`minLength`, 8 by default), an uppercase letter, a lowercase letter, a number and a special character; the strength is how many are met, shown as a label (`labels` renames them, `colors` recolors the bar) and as a `role="meter"`. `showStrength` and `showRequirements` hide either part.',
				},
				{
					example: 1,
				},
				{
					md: '**Your own rules.** `rules` replaces the built-in set and `extraRules` adds to it. A rule is `{ label, test(password), required? }`: `required: false` makes it a recommendation that counts towards the strength but never blocks. `passwordRules` has ready-made ones (`minLength(n)`, `uppercase`, `lowercase`, `digit`, `special`, `noSpaces`, `notContaining(words)`), and `defaultPasswordRules(minLength)` is the built-in set. `onResult` reports `{ score, total, level, label, valid, met }` whenever it changes, so a form can enable its submit button when `valid` (every required rule is met).',
				},
				{
					example: 2,
				},
				{
					md: '**Only while typing.** `showOn="focus"` hides the meter until the password field has focus (keyboard users get it on Tab), which keeps a sign-up form short. By default focus anywhere inside the parent element of the info counts, so wrap the input and the info together; or point `focusTarget` at the input (its `id`, a ref or the element). `onResult` keeps reporting while it is hidden, so a submit button still follows `valid`.',
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'textarea',
			name: 'TextArea',
			blocks: [
				{
					md: 'Labelled multi-line input. `onChange` receives the value string. Set `maxLength` for a live character count, `error` for the invalid style and message.\n\n`helperText` shows a hint under the field while there is no `error`, and links it to the control with `aria-describedby`. It sits beside the character count.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'select',
			name: 'Select',
			blocks: [
				{
					md: 'Themed select with a listbox panel that is never clipped by its container. `options: [{ value, label, disabled? }]`, optional `placeholder` and `error`. Keyboard: Up / Down / Home / End move, Enter or Space picks, Escape closes, and typing jumps to a match. `variant="flat"` gives a borderless trigger for toolbars and for use over images or video.\n\n`helperText` shows a hint under the field while there is no `error`, and links it to the control with `aria-describedby`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'multiselect',
			name: 'MultiSelect',
			blocks: [
				{
					md: 'Select for several values. `value` is an array and `onChange` receives the new array; chosen options show as chips that can be removed one by one, and `clearable` (on by default) adds a clear-all button. Add `searchable` to filter the options by typing; Backspace in the empty input removes the last chip. The list stays open while picking. Same `options` shape as `Select`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'searchselect',
			name: 'SearchSelect',
			blocks: [
				{
					md: 'Select with a search box that filters the options as you type. Pass `filter` to customise matching, or `onSearch` plus `filter={() => true}` to load options from a server.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'checkbox',
			name: 'Checkbox',
			blocks: [
				{
					md: "`onChange` receives the new boolean. `indeterminate` shows the mixed state.\n\n`description` adds a muted line under the label and links it to the input with `aria-describedby`, without changing the checkbox's accessible name.",
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'radio',
			name: 'Radio',
			blocks: [
				{
					md: '`Radio` is the single control; `RadioGroup` manages a set and calls `onChange` with the chosen value.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'switch',
			name: 'Switch',
			blocks: [
				{
					md: 'On/off toggle with `role="switch"`; `onChange` receives the new boolean.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'slider',
			name: 'Slider',
			blocks: [
				{
					md: '`min`, `max`, `step` and `showValue`; `onChange` receives a number. `orientation="vertical"` stands it upright (`length` sets its height in px). `buffered` adds a lighter band up to a second value, like the loaded part of a video. Pass `valueLabel` to show a formatted value in a popover above the thumb while it is dragged or moved with the keyboard.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'fileupload',
			name: 'FileUpload',
			blocks: [
				{
					md: 'Drop zone and picker; `onChange` receives an array of `File`s. Props: `accept`, `multiple`, `disabled`, `label`.',
				},
				{
					example: 1,
				},
			],
		},
	],
}
