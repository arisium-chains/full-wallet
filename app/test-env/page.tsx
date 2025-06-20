"use client"

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <p><strong>NEXT_PUBLIC_LIFF_ID:</strong> {process.env.NEXT_PUBLIC_LIFF_ID || 'NOT SET'}</p>
        <p><strong>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME:</strong> {process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'NOT SET'}</p>
        <p><strong>NEXT_PUBLIC_BASE_URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'}</p>
      </div>
    </div>
  )
}