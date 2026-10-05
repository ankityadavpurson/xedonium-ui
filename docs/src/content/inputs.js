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
					md: 'Variants: `default`, `secondary`, `success`, `danger`, `warning`. Pass `tooltip` for a styled tooltip instead of the native `title`.',
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
					md: 'Labelled input. Props: `label`, `value`, `onChange` (receives the value string), `placeholder`, `error`, `type`,\n`autoComplete`, `required`.',
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
					md: 'Unlabeled text input; use `Field` when you need a label and error text. `onChange` receives the value string, and\n`invalid` sets the error style.',
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
					md: 'Themed select with a listbox panel that is never clipped by its container. `options: [{ value, label, disabled? }]`, optional `placeholder` and `error`. Keyboard: Up / Down / Home / End move, Enter or Space picks, Escape closes, and typing jumps to a match.',
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
					md: '`onChange` receives the new boolean. `indeterminate` shows the mixed state.',
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
					md: '`min`, `max`, `step` and `showValue`; `onChange` receives a number.',
				},
				{
					example: 1,
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
