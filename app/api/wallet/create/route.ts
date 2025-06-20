import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/src/server/middlewares/auth.middleware'
import { createWallet } from '@/src/server/services/user.service'
import { handleError } from '@/src/server/utils/handle-error.util'

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check if user already has a wallet
    if (user.walletAddress) {
      return NextResponse.json(
        { 
          error: 'User already has a wallet',
          walletAddress: user.walletAddress 
        },
        { status: 400 }
      )
    }

    // Create a new wallet for the user
    const result = await createWallet(user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create wallet' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Wallet created successfully',
      walletAddress: result.walletAddress,
      success: true
    })

  } catch (error) {
    console.error('Error in wallet creation:', error)
    return handleError(error, NextResponse)
  }
})