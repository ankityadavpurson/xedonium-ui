import { Link } from 'react-router-dom'
import { NotFoundPage, useDocumentTitle } from 'xedonium'

const NotFound = () => {
	useDocumentTitle('Not found', 'Xedonium')
	return (
		<NotFoundPage
			description="That page does not exist in the docs."
			homeLabel="Back to the docs home"
			linkComponent={Link}
			linkProp="to"
		/>
	)
}

export default NotFound
