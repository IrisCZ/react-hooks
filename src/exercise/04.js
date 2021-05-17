// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function Board() {
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)
  React.useEffect(() => {
    window.localStorage.setItem('squares', JSON.stringify(squares))
  }, [squares])

  function selectSquare(square) {
    if(winner || squares[square]) return
    const newSquares = [...squares]
    newSquares[square] = nextValue
    setSquares(newSquares)
    updateLocalStorage(newSquares)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    updateLocalStorage()
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }
  
  function updateLocalStorage(newSquares) {
    window.localStorage.setItem('squares', JSON.stringify(newSquares))
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  if(winner) return `Winner: ${winner}`
  else if(squares.every(Boolean)) return "Scratch: Cat's game"
  return `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

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

function App() {
  return <Game />
}

export default App
