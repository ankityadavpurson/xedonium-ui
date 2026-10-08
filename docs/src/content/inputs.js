export default {
	slug: 'inputs',
	label: 'Inputs',
	description: 'Buttons and form controls. Value callbacks receive the value, not the event.',
	components: [
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
