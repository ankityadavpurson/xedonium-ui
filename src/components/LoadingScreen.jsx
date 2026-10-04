import FanFavicon from './FanFavicon'
import PageLayout from './PageLayout'

const LoadingScreen = () => (
	<PageLayout maxWidth="max-w-sm" centerContent>
		<FanFavicon label="Loading" />
	</PageLayout>
)

export default LoadingScreen
