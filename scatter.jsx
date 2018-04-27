var React = require('react')
var linmap = require('linmap')
var jsonist = require('jsonist')
var createReactClass = require('create-react-class')

const colorSelector = species => {
  if (species === 'virginica') return '#1f77b4'
  if (species === 'versicolor') return '#2ca02c'
  if (species === 'setosa') return '#ff7f0e'
}

const ItemTable = ({ hoveredItem }) => {
  return Object.keys(hoveredItem).length ? (
    <table style={{ color: 'white' }}>
      <tbody>
        <tr>
          <td>i:</td>
          <td>{hoveredItem.i}</td>
        </tr>
        <tr>
          <td>Species:</td>
          <td>{hoveredItem.species}</td>
        </tr>
        <tr>
          <td>petalWidth:</td>
          <td>{hoveredItem.petalWidth}</td>
        </tr>
        <tr>
          <td>petalLength:</td>
          <td>{hoveredItem.petalLength}</td>
        </tr>
        <tr>
          <td>sepalWidth:</td>
          <td>{hoveredItem.sepalWidth}</td>
        </tr>
        <tr>
          <td>sepalLength:</td>
          <td>{hoveredItem.sepalLength}</td>
        </tr>
      </tbody>
    </table>
  ) : null
}

const ScatterPlot = ({
  data,
  maxPetalLength,
  maxPetalWidth,
  minPetalLength,
  minPetalWidth,
  hoveredItem,
  height,
  width,
  handleMouseEnter,
  handleMouseOut
}) => {
  if (data.length) {
    return (
      <div>
        {data.map((item, i) => {
          const left = linmap(
            minPetalWidth,
            maxPetalWidth,
            0,
            width * 0.993,
            item.petalWidth
          )

          const bottom = linmap(
            minPetalLength,
            maxPetalLength,
            0,
            height * 0.988,
            item.petalLength
          )

          let dotStyle = {
            position: 'absolute',
            background: colorSelector(item.species),
            height: '10px',
            width: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            left: `${left}px`,
            bottom: `${bottom}px`,
            border: hoveredItem.i === i ? '1px solid white' : ''
          }
          return (
            <div
              onMouseEnter={() => {
                handleMouseEnter(item, i)
              }}
              onMouseOut={() => handleMouseOut()}
              key={i}
              style={dotStyle}
            />
          )
        })}
      </div>
    )
  }
  return <div>Loading</div>
}

module.exports = createReactClass({
  getInitialState() {
    return {
      data: [],
      hoveredItem: {},
      maxPetalLength: 0,
      maxPetalWidth: 0,
      minPetalLength: 0,
      minPetalWidth: 0
    }
  },

  componentDidMount() {
    jsonist.get(this.props.dataset, (err, data, res) => {
      if (err) console.log(err)
      const petalWidthArr = data.map(item => item.petalWidth)
      const petalLengthArr = data.map(item => item.petalLength)
      const maxPetalWidth = Math.max(...petalWidthArr)
      const minPetalWidth = Math.min(...petalWidthArr)
      const maxPetalLength = Math.max(...petalLengthArr)
      const minPetalLength = Math.min(...petalLengthArr)
      this.setState({
        data,
        maxPetalWidth,
        maxPetalLength,
        minPetalWidth,
        minPetalLength
      })
    })
  },

  handleMouseEnter(item, i) {
    this.setState({ hoveredItem: Object.assign({}, { i }, item) })
  },

  handleMouseOut() {
    this.setState({ hoveredItem: {} })
  },

  render() {
    const {
      data,
      maxPetalWidth,
      maxPetalLength,
      minPetalWidth,
      minPetalLength,
      hoveredItem
    } = this.state
    const { width, height } = this.props
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
          color: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid black',
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)',
          background: '#222'
        }}
      >
        <ItemTable hoveredItem={hoveredItem} />
        <ScatterPlot
          data={data}
          maxPetalWidth={maxPetalWidth}
          maxPetalLength={maxPetalLength}
          minPetalWidth={minPetalWidth}
          minPetalLength={minPetalLength}
          hoveredItem={hoveredItem}
          height={height}
          width={width}
          handleMouseEnter={this.handleMouseEnter}
          handleMouseOut={this.handleMouseOut}
        />
      </div>
    )
  }
})
