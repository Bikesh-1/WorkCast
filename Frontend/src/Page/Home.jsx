import React from 'react'
// import Navbar from '../Component/Navbar'
import HeroSection from '../Component/HeroSection'
import Section2 from '../Component/Section2'
import Section3 from '../Component/Section3'
import Section4 from '../Component/Section4'
import Section5 from '../Component/Section5'
import Section6 from '../Component/Section6'
import Footer from '../Component/Footer'

function Home() {
  return (
    <div>
        {/* <Navbar/> */}
        <HeroSection/>
        <Section2/>
        <Section3/>
        <Section5/>
        <Section4/>
        <Section6/>
        <Footer/>
    </div>
    
  )
}

export default Home