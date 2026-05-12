import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact | ImRizwan',
  description: 'Get in touch with Rizwan — SharePoint and Power Platform developer. Send a message for collaboration, consulting, or questions.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactForm />
}
