"use client"

import { useState } from "react"
import { Scanner as ReactQrScanner } from "@yudiel/react-qr-scanner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, X } from "lucide-react"
import { ethers } from "ethers"

interface QRScannerProps {
  onScan: (address: string) => void
  className?: string
}

const parseEthereumQR = (qrCode: string) => {
  try {
    // Check if it's a simple wallet address
    if (ethers.utils.isAddress(qrCode)) {
      return { address: qrCode }
    }

    // Check for ethereum: format
    const regex = /^ethereum:([^@?]+)(?:@(\d+))?(?:\/transfer\?address=([^&]+)&uint256=([\de]+))?(?:\?value=([\de]+))?/
    const match = qrCode.match(regex)

    if (match) {
      const tokenOrRecipient = match[1]
      const recipientAddress = match[3] || tokenOrRecipient
      
      if (ethers.utils.isAddress(recipientAddress)) {
        return { address: recipientAddress }
      }
    }

    throw new Error("Invalid QR code format")
  } catch {
    throw new Error("Invalid Ethereum address in QR code")
  }
}

export function QRScanner({ onScan, className }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = (result: string) => {
    try {
      const { address } = parseEthereumQR(result)
      onScan(address)
      setIsOpen(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid QR code")
    }
  }

  const handleError = (err: Error) => {
    console.error("QR Scanner Error:", err)
    setError("Failed to scan QR code")
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
        type="button"
      >
        <QrCode className="h-6 w-6 text-white animate-pulse" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-sm border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Scan QR Code</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {error ? (
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
                <Button 
                  onClick={() => setError(null)}
                  className="mt-2 text-sm"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="aspect-square w-full max-w-sm mx-auto">
                <ReactQrScanner
                  onDecode={handleScan}
                  onError={handleError}
                  containerStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}