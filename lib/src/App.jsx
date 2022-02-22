import { useState } from 'react'
import logo from './logo.svg';
import Test from './Test';
import NewTest from './Wealth';
import Inequality from './Inequality';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <NewTest />
      <Inequality />
    </div>
  )
}

export default App
