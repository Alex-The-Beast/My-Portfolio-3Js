import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Project from './sections/Project'
import Client from './sections/Client'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

const App = () => {
  return (
    <main className="max-w-7xl mx-auto">
      <Navbar/>
      <Hero />
      <About/>
      <Project />
      <Client/>
      <Experience/>
      <Contact/>
      <Footer/>
      
    </main>
  )
}

export default App
