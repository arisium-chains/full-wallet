export interface User {
  id: string
  walletAddress?: string
  lineUserId?: string
  displayName?: string
  pictureUrl?: string
  email?: string
  created?: string
  updated?: string
}

export interface Balance {
  walletAddress: string
  name: string
  symbol: string
  decimals: number
  value: string
  displayValue: string
}