import { BookOpen, ExternalLink, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'Me',
    links: [
      { label: 'Projects', to: '/work' },
      { label: 'Updates', to: '/updates' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'This site',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'RSS', href: '#' },
      { label: 'Source code', href: 'https://github.com/Alex-The-Beast', external: true },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'GitHub', href: 'https://github.com/Alex-The-Beast', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
      { label: 'X', href: 'https://twitter.com', external: true },
    ],
  },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Alex-The-Beast', asset: '/assets/github.svg' },
  { label: 'LinkedIn', href: 'https://linkedin.com', text: 'in' },
  { label: 'Updates', href: '/updates', Icon: BookOpen, internal: true },
  { label: 'Email', href: 'mailto:xmas.96.tree@gmail.com', Icon: Mail },
  { label: 'X', href: 'https://twitter.com', asset: '/assets/twitter.svg' },
]

const FooterLink = ({ link }) => {
  const className = 'inline-flex items-center gap-1.5 text-zinc-500 transition hover:text-zinc-100'

  if (link.to) {
    return (
      <Link to={link.to} className={className}>
        {link.label}
      </Link>
    )
  }

  return (
    <a href={link.href} className={className} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>
      {link.label}
      {link.external && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
    </a>
  )
}

const SocialLink = ({ item }) => {
  const Icon = item.Icon
  const className = 'text-zinc-300 transition hover:text-white'
  const content = Icon ? (
    <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
  ) : item.asset ? (
    <img src={item.asset} alt="" className="h-5 w-5 opacity-95 brightness-0 invert transition hover:opacity-100" />
  ) : (
    <span className="text-lg font-semibold leading-none">{item.text}</span>
  )

  if (item.internal) {
    return (
      <Link to={item.href} className={className} aria-label={item.label}>
        {content}
      </Link>
    )
  }

  return (
    <a href={item.href} className={className} aria-label={item.label} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>
      {content}
    </a>
  )
}

const Footer = () => {
  const year = new Date().getFullYear()
  const updatedAt = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date())

  return (
    <footer className="mt-24 border-t border-zinc-900 bg-[#050506] px-5 py-12 sm:px-10 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.35fr_2fr] md:gap-16">
        <div className="flex flex-col justify-between gap-8 md:gap-20">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Gaurav</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-500">
              A dedicated problem-solver who thrives on learning and building.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4">
              {socialLinks.map((item) => (
                <SocialLink key={item.label} item={item} />
              ))}
            </div>
            <p className="mt-5 text-xs text-zinc-600 md:mt-8 md:text-sm">&copy; {year} Gaurav. All rights reserved.</p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 md:gap-20">
          <div className="grid grid-cols-3 gap-4 sm:gap-10">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-zinc-200 sm:text-sm">{group.title}</h3>
                <nav className="mt-4 grid gap-3 text-xs font-medium sm:mt-5 sm:gap-4 sm:text-sm" aria-label={group.title}>
                  {group.links.map((link) => (
                    <FooterLink key={link.label} link={link} />
                  ))}
                </nav>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-600 md:text-right md:text-sm">Last updated by Gaurav on {updatedAt}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
