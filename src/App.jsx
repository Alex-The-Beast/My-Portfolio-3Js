import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Project from './sections/Project'
import Client from './sections/Client'
import Contact from './sections/Contact'

const App = () => {
  return (
    <main className="max-w-7xl mx-auto">
      <Navbar/>
      <Hero />
      <About/>
      <Project />
      <Client/>
      <Contact/>
      
    </main>
  )
}

export default App
