"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestGuestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const createGuestUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      const data = await response.json()
      setResult({ success: response.ok, data })
      
      if (response.ok) {
        console.log('Guest user created:', data)
      } else {
        console.error('Failed to create guest user:', data)
      }
    } catch (error) {
      console.error('Error:', error)
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testAuthMe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      const data = await response.json()
      setResult({ success: response.ok, data, endpoint: '/api/auth/me' })
      
    } catch (error) {
      console.error('Error:', error)
      setResult({ success: false, error: error.message, endpoint: '/api/auth/me' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Guest User Creation Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={createGuestUser} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? 'Creating...' : 'Create Guest User'}
            </Button>
            
            <Button 
              onClick={testAuthMe} 
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? 'Testing...' : 'Test /api/auth/me'}
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 border rounded">
              <h3 className="font-bold mb-2">
                Result {result.endpoint && `(${result.endpoint})`}:
              </h3>
              <div className={`p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Status:</strong> {result.success ? 'Success' : 'Failed'}
              </div>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}