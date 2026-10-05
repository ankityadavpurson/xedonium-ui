/** Body copy: `text-sm` in the primary text color. `as` changes the element (default p). */
const BodyText = ({ as: Tag = 'p', className = '', children, ...rest }) => (
	<Tag className={`m-0 text-sm text-app-text ${className}`} {...rest}>
		{children}
	</Tag>
)

export default BodyText
