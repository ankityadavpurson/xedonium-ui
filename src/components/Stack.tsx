import Flex, { type FlexProps } from './Flex'

/** Evenly spaced children, vertical by default. `direction="row"` for a horizontal stack. */
const Stack = ({ direction = 'column', gap = 4, ...rest }: FlexProps) => (
	<Flex direction={direction} gap={gap} {...rest} />
)

export default Stack
