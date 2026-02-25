import { useEffect, useRef } from 'react'

export default function CopyCodeButton() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current?.closest('.post__content') || document.querySelector('.post__content')
    if (!container) return

    const pres = container.querySelectorAll('pre')

    pres.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return

      pre.style.position = 'relative'

      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.textContent = 'Copy'
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = 'Copied!'
          btn.classList.add('copy-btn--copied')
          setTimeout(() => {
            btn.textContent = 'Copy'
            btn.classList.remove('copy-btn--copied')
          }, 2000)
        } catch {
          btn.textContent = 'Failed'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        }
      })

      pre.appendChild(btn)
    })
  })

  return <div ref={containerRef} style={{ display: 'none' }} />
}
