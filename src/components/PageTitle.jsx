/** Page heading: bold, tight tracking, 2xl on phones and 3xl from `sm`. `as` changes the element (default h1). */
const PageTitle = ({ as: Tag = 'h1', className = '', children, ...rest }) => (
	<Tag className={`m-0 text-2xl font-bold tracking-tight text-app-text sm:text-3xl ${className}`} {...rest}>
		{children}
	</Tag>
)

export default PageTitle
