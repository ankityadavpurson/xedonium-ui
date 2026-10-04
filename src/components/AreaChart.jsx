import LineChart from './LineChart'

/** LineChart with the area under each line filled. Same props. */
const AreaChart = ({ label = 'Area chart', ...props }) => <LineChart area label={label} {...props} />

export default AreaChart
