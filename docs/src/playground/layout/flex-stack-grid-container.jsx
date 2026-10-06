import { Container, Flex, Grid, Stack } from 'xedonium'

const Box = ({ children }) => <div className="border border-app-border bg-app-bg p-3 text-xs">{children}</div>

export default function Demo() {
	return (
		<div className="flex flex-col gap-3">
			<Flex gap={3} justify="between">
				<Box>flex 1</Box>
				<Box>flex 2</Box>
				<Box>flex 3</Box>
			</Flex>
			<Stack gap={2}>
				<Box>stack 1</Box>
				<Box>stack 2</Box>
			</Stack>
			<Grid cols={3}>
				<Box>1</Box>
				<Box>2</Box>
				<Box>3</Box>
			</Grid>
			<Container maxWidth="max-w-sm">
				<Box>container max-w-sm</Box>
			</Container>
		</div>
	)
}
