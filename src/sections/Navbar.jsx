import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../constants/index.js'

const icons = {
  home: (
    <path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 18.5v-8Z" />
  ),
  work: (
    <>
      <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
      <path d="M4.5 8.5h15v11h-15z" />
      <path d="M4.5 12.5h15" />
      <path d="M10 12.5v1h4v-1" />
    </>
  ),
  updates: (
    <>
      <path d="M7 5.5h10" />
      <path d="M7 10h10" />
      <path d="M7 14.5h6" />
      <path d="M5 3.5h14v17H5z" />
    </>
  ),
  blog: (
    <>
      <path d="M5 7.5h14" />
      <path d="M5 12h14" />
      <path d="M5 16.5h9" />
      <path d="M4 4h16v16H4z" />
    </>
  ),
  contact: (
    <>
      <path d="M12 13.5c3 0 5.5-1.8 5.5-4S15 5.5 12 5.5 6.5 7.3 6.5 9.5c0 1 .5 1.9 1.3 2.6L7 15.5l3.2-2.1c.6.1 1.2.1 1.8.1Z" />
      <path d="M9.5 9.5h.01" />
      <path d="M12 9.5h.01" />
      <path d="M14.5 9.5h.01" />
    </>
  ),
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
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {icons[link.icon]}
              </svg>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar
