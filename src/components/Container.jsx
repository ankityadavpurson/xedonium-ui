// Centered, padded content column
const Container = ({ maxWidth = 'max-w-5xl', className = '', as: Tag = 'div', children, ...rest }) => (
	<Tag className={`mx-auto w-full px-4 sm:px-6 ${maxWidth} ${className}`} {...rest}>
		{children}
	</Tag>
)

export default Container
