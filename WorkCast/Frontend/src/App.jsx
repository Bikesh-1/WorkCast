import { Route } from 'react-router-dom'
import Home from './Page/Home'
import './App.css'

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </>
  )
}

export default App
