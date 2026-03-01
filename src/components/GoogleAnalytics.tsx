import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Note: Replace this with an env var if you want to support different environments
const GA_MEASUREMENT_ID = 'G-XF8F329XFD'

export default function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Only track if gtag is available and initialized in index.html
    if (typeof window.gtag !== 'undefined') {
      // Send a custom page_view event on route change to capture SPA navigation.
      // Modern GA4 handles history changes automatically in many cases, but
      // doing this ensures full Single Page App paths are accurately captured.
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      })
    }
  }, [location])

  return null
}
