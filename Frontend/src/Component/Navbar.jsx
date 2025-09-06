import React from 'react'
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";

function Navbar() {
  return (
    <nav className="w-full px-8 py-4 flex justify-between items-center absolute top-0 left-0 z-50 bg-transparent">

      {/* Logo */}
      <div className="flex items-center" style={{ minWidth: 0 }}>
        <img
          src="https://ik.imagekit.io/lxvqyrkjo/Group%201.svg?updatedAt=1757147618895"
          alt="WorkCast Logo"
          className="h-20 w-20 mr-3 object-contain"
          style={{ flexShrink: 0, flexGrow: 0 }}
        />
      </div>

      {/* Desktop Nav Links */}
      <div
        className="hidden md:flex space-x-8 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg"
        style={{
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          height: 'auto',
          alignItems: 'center',
          minWidth: 0,
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        <a
          href="#"
          className="text-white/90 font-medium transition duration-300 transform hover:text-white hover:scale-110 hover:translate-y-[-2px]"
        >
          Home
        </a>
        <a
          href="#"
          className="text-white/90 font-medium transition duration-300 transform hover:text-white hover:scale-110 hover:translate-y-[-2px]"
        >
          About
        </a>
        <a
          href="#"
          className="text-white/90 font-medium transition duration-300 transform hover:text-white hover:scale-110 hover:translate-y-[-2px]"
        >
          Services
        </a>
        <a
          href="#"
          className="text-white/90 font-medium transition duration-300 transform hover:text-white hover:scale-110 hover:translate-y-[-2px]"
        >
          Contact
        </a>
      </div>

      {/* Login/Signup Button */}
      <div className="flex space-x-4 items-center" style={{ minWidth: 0, flexShrink: 0, flexGrow: 0 }}>
        <InteractiveHoverButton>Login/Signup</InteractiveHoverButton>
      </div>
    </nav>
  )
}

export default Navbar