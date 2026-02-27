import Header from './Header'
import Footer from './Footer'
import ScrollAnimations from './ScrollAnimations'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ScrollAnimations />
      <main>{children}</main>
      <Footer />
    </>
  )
}
