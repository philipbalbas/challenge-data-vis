var React = require('react')
var linmap = require('linmap')
var jsonist = require('jsonist')
var createReactClass = require('create-react-class')

const colorSelector = species => {
  if (species === 'virginica') return '#1f77b4'
  if (species === 'versicolor') return '#2ca02c'
  if (species === 'setosa') return '#ff7f0e'
}

module.exports = createReactClass({
  getInitialState() {
    return { data: [], hoveredItem: {} }
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
        ref={node => (this.graphBox = node)}
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
        {Object.keys(hoveredItem).length ? (
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
        ) : null}
        {data.map((item, i) => {
          const left = linmap(
            minPetalWidth,
            maxPetalWidth,
            0,
            width,
            item.petalWidth
          )

          const bottom = linmap(
            minPetalLength,
            maxPetalLength,
            0,
            height,
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
                this.setState({ hoveredItem: Object.assign({}, { i }, item) })
              }}
              onMouseOut={() => {
                this.setState({ hoveredItem: {} })
              }}
              key={i}
              style={dotStyle}
            />
          )
        })}
      </div>
    )
  }
})
