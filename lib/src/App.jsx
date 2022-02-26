import { useState } from 'react'
import logo from './logo.svg';
import Test from './Test';
import NewTest from './Wealth';
import Inequality from './Inequality';
import Unions from './Unions';
import Debt from './Debt';
import Taxes from './Taxes'
import Millitary from './Millitary';
import Productivity from './Productivity';
import ProductivityWages from './ProductivityWages';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <NewTest />
      <Inequality />
      <Unions />
      <Debt />
      <Taxes />
      <Millitary />
      <Productivity />
      <ProductivityWages />
    </div>
  )
}

export default App
