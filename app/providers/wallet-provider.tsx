'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import type { PropsWithChildren } from 'react'

import { useGetBalance } from '@/src/hooks/user/useGetBalance'
import type { Token } from '@/src/interfaces/token.interface'
import type { Balance } from '@/src/interfaces/user.interface'

interface WalletState {
  balance: Balance | null
  selectedToken: Token | null
  isLoading: boolean
  error: string | null
  walletAddress: string | null
}

type WalletAction =
  | { type: 'SET_BALANCE'; payload: Balance }
  | { type: 'SET_SELECTED_TOKEN'; payload: Token | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WALLET_ADDRESS'; payload: string | null }
  | { type: 'RESET_WALLET' }

interface WalletContextType {
  state: WalletState
  selectToken: (token: Token | null) => void
  refreshBalance: () => void
  setWalletAddress: (address: string | null) => void
  resetWallet: () => void
}

const initialState: WalletState = {
  balance: null,
  selectedToken: null,
  isLoading: false,
  error: null,
  walletAddress: null,
}

const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_BALANCE':
      return { ...state, balance: action.payload, isLoading: false, error: null }
    case 'SET_SELECTED_TOKEN':
      return { ...state, selectedToken: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_WALLET_ADDRESS':
      return { ...state, walletAddress: action.payload }
    case 'RESET_WALLET':
      return initialState
    default:
      return state
  }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(walletReducer, initialState)
  
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useGetBalance()

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: balanceLoading })
  }, [balanceLoading])

  useEffect(() => {
    if (balanceData) {
      dispatch({ type: 'SET_BALANCE', payload: balanceData })
    }
  }, [balanceData])

  useEffect(() => {
    if (balanceError) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch balance' })
    }
  }, [balanceError])

  const selectToken = (token: Token | null) => {
    dispatch({ type: 'SET_SELECTED_TOKEN', payload: token })
  }

  const refreshBalance = () => {
    refetchBalance()
  }

  const setWalletAddress = (address: string | null) => {
    dispatch({ type: 'SET_WALLET_ADDRESS', payload: address })
  }

  const resetWallet = () => {
    dispatch({ type: 'RESET_WALLET' })
  }

  const value: WalletContextType = {
    state,
    selectToken,
    refreshBalance,
    setWalletAddress,
    resetWallet,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}