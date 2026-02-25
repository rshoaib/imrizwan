import { useState, useEffect, useRef } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Extract headings from rendered content
    const container = document.querySelector('.post__content')
    if (!container) return

    const elements = container.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    elements.forEach((el, index) => {
      const id = `heading-${index}`
      el.id = id
      items.push({
        id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      })
    })

    setHeadings(items)

    // Intersection observer for active state
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [content])

  if (headings.length < 2) return null

  return (
    <nav className="toc" aria-label="Table of contents">
      <h4 className="toc__title">On this page</h4>
      <ul className="toc__list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`toc__item ${h.level === 3 ? 'toc__item--sub' : ''} ${activeId === h.id ? 'toc__item--active' : ''}`}
          >
            <a href={`#${h.id}`} className="toc__link">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
