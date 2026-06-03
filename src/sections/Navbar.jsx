import { useEffect, useRef, useState } from 'react'
import { BriefcaseBusiness, Home, MessageCircle, NotebookText, Newspaper } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../constants/index.js'

const icons = {
  home: Home,
  work: BriefcaseBusiness,
  updates: NotebookText,
  blog: Newspaper,
  contact: MessageCircle,
}

const getIsActive = (href, { pathname, hash }) => {
  if (href.includes('#')) {
    const [path, targetHash] = href.split('#')
    return pathname === path && hash === `#${targetHash}`
  }

  return href === '/' ? pathname === '/' && !hash : pathname.startsWith(href)
}

const Navbar = () => {
  const location = useLocation()
  const [hoveredLink, setHoveredLink] = useState(null)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current

      setIsHidden(scrollingDown && currentScrollY > 80)
      lastScrollY.current = currentScrollY
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`bottom-dock ${isHidden ? 'is-hidden' : ''}`} aria-label="Main navigation">
      <div className="dock-bar">
        {navLinks.map((link) => {
          const isActive = getIsActive(link.href, location)
          const Icon = icons[link.icon]

          return (
            <NavLink
              key={link.id}
              to={link.href}
              className={`dock-item ${isActive ? 'is-active' : ''}`}
              aria-label={link.name}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={(event) => {
                setHoveredLink(null)
                event.currentTarget.blur()
              }}
            >
              {hoveredLink?.id === link.id && (
                <span key={link.id} className="dock-tooltip">
                  {link.name}
                </span>
              )}
              <Icon aria-hidden="true" strokeWidth={1.9} />
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar
