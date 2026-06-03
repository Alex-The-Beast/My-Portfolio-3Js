import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Project from './sections/Project'
import Experience from './sections/Experience'
import Blog from './sections/Blog'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import BlogArticle from './sections/BlogArticle'
import LatestUpdates, { UpdateDetail } from './sections/LatestUpdates'

const ScrollToHash = () => {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [hash, pathname])

  return null
}

const Home = () => (
  <>
    <Hero />
    <About />
    <Project />
    <Experience />
    <LatestUpdates />
    <Blog />
  </>
)

const App = () => {
  return (
    <main className="relative mx-auto max-w-7xl overflow-hidden">
      <div className="site-aurora" aria-hidden="true" />
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Project isPage />} />
        <Route path="/updates" element={<LatestUpdates isPage />} />
        <Route path="/updates/:updateId" element={<UpdateDetail />} />
        <Route path="/blog" element={<Blog isPage />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default App
