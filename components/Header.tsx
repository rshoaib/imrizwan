'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { path: '/blog', label: 'Blog' },
  { path: '/tools', label: 'Tools' },
  { path: '/projects', label: 'Projects' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className="header-wrapper">
      <div className="header glass-panel">
        <div className="header__inner">
          <Link href="/" className="header__logo" onClick={() => setMenuOpen(false)}>
            <span className="header__logo-accent">&lt;/&gt;</span> iamrizwan
          </Link>

          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`header__link ${isActive(link.path) ? 'header__link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>

          <button
            className="header__burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="header__burger-icon" />
          </button>
        </div>
      </div>
    </header>
  )
}
