import { Progress, Stack } from 'xedonium'

export default function Demo() {
	return (
		<Stack gap={4}>
			<Progress label="Uploading" value={62} showValue />
			<Progress label="Working" />
		</Stack>
	)
}
