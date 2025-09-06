import React from 'react'

function Navbar() {
  return (
    <nav className="w-full px-8 py-4 flex  justify-between">
      {/* Left: Logo */}
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white tracking-wide">WorkCast</span>
      </div>
      {/* Middle: Nav Links with glassmorphism */}
      <div className="flex space-x-8 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg  px-8 py-2">
        <a href="#" className="text-white/90 hover:text-white font-medium transition">Home</a>
        <a href="#" className="text-white/90 hover:text-white font-medium transition">About</a>
      </div>
      {/* Right: Auth Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition">Login</button>
        <button className="px-4 py-2 rounded-lg bg-blue-500/80 text-white font-semibold hover:bg-blue-600/80 transition">Sign Up</button>
      </div>
    </nav>
  )
}

export default Navbar