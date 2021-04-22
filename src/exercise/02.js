// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useSyncLocalStorageState(key, initialValue = '', {serialize = JSON.stringify, deserialize = JSON.parse} = {}) {
  const [value, setValue] = React.useState(() => {
    const storagedValue = window.localStorage.getItem(key)
    if (storagedValue) {
      try {
        return deserialize(storagedValue)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const prevKeyRef = React.useRef(key)
  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if(prevKey !== key) window.localStorage.removeItem(prevKey)
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useSyncLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName='' />
}

export default App
