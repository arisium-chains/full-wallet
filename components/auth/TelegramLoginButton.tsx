"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function TelegramLoginButton({ 
  onSuccess, 
  onError,
  disabled = false 
}: TelegramLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [botUsername, setBotUsername] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get bot username from environment
    const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
    if (username) {
      setBotUsername(username)
    } else {
      console.error('Telegram bot username not configured')
    }
  }, [])

  useEffect(() => {
    // Define global callback function for Telegram widget
    (window as any).onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram auth callback received:', user)
      setIsLoading(true)

      try {
        // Send auth data to backend
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            authData: user
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed')
        }

        toast({
          title: "🎉 Success!",
          description: "Successfully logged in with Telegram!",
        })

        onSuccess()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
        console.error('Telegram authentication error:', error)
        
        toast({
          title: "❌ Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        })
        
        onError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    // Cleanup function
    return () => {
      delete (window as any).onTelegramAuth
    }
  }, [onSuccess, onError, toast])

  const handleTelegramLogin = () => {
    if (!botUsername) {
      onError('Telegram bot not configured')
      return
    }

    setIsLoading(true)

    // Create Telegram Login Widget
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    // Find or create container
    let container = document.getElementById('telegram-widget-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'telegram-widget-container'
      container.style.position = 'fixed'
      container.style.top = '50%'
      container.style.left = '50%'
      container.style.transform = 'translate(-50%, -50%)'
      container.style.zIndex = '9999'
      container.style.backgroundColor = 'white'
      container.style.padding = '20px'
      container.style.borderRadius = '10px'
      container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
      document.body.appendChild(container)
    }

    // Clear previous content and add the script
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 15px;">
        <h3 style="color: #333; margin: 0;">Login with Telegram</h3>
        <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Click the button below to authenticate</p>
      </div>
    `
    container.appendChild(script)

    // Add close button
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '✕'
    closeButton.style.position = 'absolute'
    closeButton.style.top = '10px'
    closeButton.style.right = '10px'
    closeButton.style.background = 'none'
    closeButton.style.border = 'none'
    closeButton.style.fontSize = '20px'
    closeButton.style.cursor = 'pointer'
    closeButton.style.color = '#999'
    closeButton.onclick = () => {
      document.body.removeChild(container!)
      setIsLoading(false)
    }
    container.appendChild(closeButton)
  }

  if (!botUsername) {
    return (
      <Button
        disabled={true}
        className="w-full h-16 bg-gray-400 text-white border-0 text-lg font-bold"
      >
        <Send className="h-6 w-6 mr-3" />
        Telegram Not Configured
      </Button>
    )
  }

  return (
    <Button
      onClick={handleTelegramLogin}
      disabled={disabled || isLoading}
      className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 group"
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          Connecting with Telegram...
        </div>
      ) : (
        <>
          <Send className="h-6 w-6 mr-3 animate-wiggle group-hover:animate-bounce" />
          Continue with Telegram 🚀
        </>
      )}
    </Button>
  )
}