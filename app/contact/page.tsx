import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Rizwan for SharePoint development, Power Platform consulting, or collaboration opportunities.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactForm />
}
