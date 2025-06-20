"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SimpleLoginPage() {
  const [envTest, setEnvTest] = useState<string>('')

  useEffect(() => {
    console.log('SimpleLoginPage mounted')
    console.log('LIFF ID:', process.env.NEXT_PUBLIC_LIFF_ID)
    console.log('Telegram Bot:', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME)
    
    setEnvTest(`LINE: ${process.env.NEXT_PUBLIC_LIFF_ID}, Telegram: ${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Login Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Environment Test: {envTest}</p>
          
          <Button className="w-full bg-green-500 hover:bg-green-600">
            LINE Login (Test)
          </Button>
          
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Telegram Login (Test)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}