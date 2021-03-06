const totalRow = 19
const totalCol = 19
function BlackPiece() {
  return <div className="piece black"></div>
}
function WhitePiece() {
  return <div className="piece white"></div>
}

function Square(props) {
  return (
    <button className={props.className + ' square'} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        className={this.props.current.position.index === i ? 'current' : ''}
        value={this.props.current.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  getSquares() {
    const squares = []
    for (let row = 0; row < totalRow; row++) {
      const cols = []
      for (let col = 0; col < totalCol; col++) {
        cols.push(this.renderSquare(row * totalRow + col))
      }
      const boardRow = (
        <div className="board-row" key={row}>
          <span className="serial-number">{row}</span>
          {cols}
        </div>
      )
      squares.push(boardRow)
    }
    return squares
  }
  getColNums() {
    const result = []
    for (let i = 0; i < totalCol; i++) {
      result.push(
        <span key={i} className="serial-number">
          {i}
        </span>
      )
    }
    return result
  }
  render() {
    return (
      <div>
        <div className="serial-row">{this.getColNums()}</div>
        {this.getSquares()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: {},
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    const who = this.state.xIsNext ? <BlackPiece /> : <WhitePiece />
    squares[i] = who
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: {
            index: i,
            x: i % totalCol,
            y: Math.floor(i / totalRow),
            who,
          },
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((item, index) => {
      const desc = index
        ? `??? ${index} ???${item.position.who}(${item.position.x}, ${item.position.y})`
        : '??????'
      return (
        <li
          key={index}
          className={index === this.state.stepNumber ? 'current' : ''}
        >
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = this.state.xIsNext ? <BlackPiece /> : <WhitePiece />
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board current={current} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div className="status-area">????????????{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
