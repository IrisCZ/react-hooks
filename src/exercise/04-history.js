// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
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
    </div>
  )
}

function Game() {
  const initialHistory = JSON.parse(window.localStorage.getItem('history')) || [
    Array(9).fill(null),
  ]

  const [history, setHistory] = React.useState(initialHistory)
  const [step, setStep] = React.useState(1)
  const squares = history[step - 1]

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  React.useEffect(() => {
    window.localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  function selectSquare(square) {
    if (winner || squares[square]) return

    const newSquares = [...squares]
    newSquares[square] = nextValue
    updateHistory(newSquares)
    setStep(step + 1)
  }

  function updateHistory(newSquares) {
    if (step !== history.length) {
      setHistory([...history.slice(0, step), newSquares])
      return
    }
    setHistory([...history, newSquares])
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setStep(1)
  }

  function goToStepInHistory(currentStep) {
    setStep(currentStep + 1)
  }

  function historyElements() {
    return history.map((move, i) => {
      return (
        <li key={i}>
          <button
            disabled={i + 1 === step}
            onClick={() => goToStepInHistory(i)}
          >
            Go to {i === 0 ? 'game start' : `move #${i}`}{' '}
            {i + 1 === step ? '(current)' : ''}
          </button>
        </li>
      )
    })
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{historyElements()}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  if (winner) return `Winner: ${winner}`
  else if (squares.every(Boolean)) return "Scratch: Cat's game"
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