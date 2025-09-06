import React from 'react'
import { cn } from "../lib/utils.js";
import { GridPattern } from "../components/magicui/grid-pattern";
import Navbar from './Navbar.jsx';

function HeroSection() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-background  bg-black w-[100vw] h-[100vh]">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
      <Navbar/>
    </div>
  )
}

export default HeroSection