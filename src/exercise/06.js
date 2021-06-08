// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonErrorView({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  //  status = idle, pending, resolved, rejected
  const [pokemonState, setPokemonState] = React.useState({
    error: null,
    pokemon: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) return
    setPokemonState({status: 'pending', pokemon: null})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setPokemonState({status: 'resolved', pokemon: pokemon})
      },
      error => {
        setPokemonState({status: 'rejected', pokemon: null, error: error})
      },
    )
  }, [pokemonName])

  if (pokemonState.status === 'idle') return 'Submit a pokemon'
  if (pokemonState.status === 'rejected') throw pokemonState.error
  if (pokemonState.status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />
  return <PokemonDataView pokemon={pokemonState.pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={PokemonErrorView}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
