import { Routes, Route } from 'react-router-dom'
import Home from './Page/Home'
import './App.css'
import Login from './Page/Login'
import Signup from './Page/Signup'
import Dashboard from './Page/Dashboard'

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default App
