import LineChart, { type LineChartProps } from './LineChart'

/** LineChart with the area under each line filled. Same props. */
const AreaChart = ({ label = 'Area chart', ...props }: Omit<LineChartProps, 'area'>) => (
	<LineChart area label={label} {...props} />
)

export default AreaChart
