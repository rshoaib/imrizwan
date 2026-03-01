import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  tags?: string[]
}

const SITE_NAME = 'iamrizwan'
const BASE_URL = 'https://imrizwan.com'

export default function SEO({
  title,
  description,
  url = '',
  image,
  type = 'website',
  publishedTime,
  tags,
}: SEOProps) {
  const fullUrl = `${BASE_URL}${url}`
  const fullTitle = `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      {image && <meta property="og:image" content={image} />}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Article Schema (Structured Data) */}
      {type === 'article' && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description,
            image: image ? [image] : [],
            datePublished: publishedTime,
            author: {
              '@type': 'Person',
              name: 'Rizwan',
              url: 'https://imrizwan.com/about'
            },
            publisher: {
              '@type': 'Organization',
              name: 'ImRizwan',
              logo: {
                '@type': 'ImageObject',
                url: 'https://imrizwan.com/favicon.svg'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': fullUrl
            }
          })
        }} />
      )}
    </Helmet>
  )
}
