import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // TODO: Wire to your preferred email service (Mailchimp, ConvertKit, Resend, etc.)
  console.log('[newsletter] New subscriber:', email)

  return NextResponse.json({ ok: true })
}
