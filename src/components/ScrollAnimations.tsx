import { useEffect, useCallback } from 'react'

/**
 * Intersection Observer hook for scroll-triggered reveal animations.
 * Uses MutationObserver to automatically detect new .reveal elements 
 * added to the DOM (e.g., from async data loading).
 */
export default function ScrollAnimations() {
  const observeTargets = useCallback(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )

    document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => {
      io.observe(el)
    })

    return io
  }, [])

  useEffect(() => {
    let io = observeTargets()

    // Watch for new .reveal elements added dynamically (e.g., after data fetch)
    const mo = new MutationObserver(() => {
      const unrevealed = document.querySelectorAll('.reveal:not(.revealed)')
      if (unrevealed.length > 0) {
        io.disconnect()
        io = observeTargets()
      }
    })

    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [observeTargets])

  return null
}
