import { getPocketBase, getPocketBaseAdmin } from "../libs/pkbase.lib";
import { ErrorCode } from "@/src/enums/error-code.enum";
import { ERROR_MESSAGES } from "../constants/error.constant";
import { NotFoundException } from "../errors/http-exceptions.error";
import engine from "../libs/engine.lib";
import { ClientResponseError, type RecordModel } from "pocketbase";
import type { AuthProviderType } from "@/src/interfaces/auth.interfaces";

const pb = getPocketBase();
const pbAdmin = getPocketBaseAdmin(); // Use admin instance for user creation
const UserPassword = process.env.USER_PASSWORD!;

// Cache for collection availability to avoid repeated checks
let walletCollectionAvailable: boolean | null = null;

async function checkWalletCollectionAvailability(): Promise<boolean> {
  if (walletCollectionAvailable !== null) {
    return walletCollectionAvailable;
  }

  try {
    await pbAdmin.collection("User_Wallet").getList(1, 1);
    walletCollectionAvailable = true;
    console.log('User_Wallet collection is accessible');
    return true;
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      const errorMessage = error.response?.message || error.message || '';
      if (errorMessage.includes('collection') || errorMessage.includes('Missing or invalid collection context')) {
        walletCollectionAvailable = false;
        console.warn('User_Wallet collection not accessible - wallet features disabled');
        return false;
      }
    }
    walletCollectionAvailable = false;
    return false;
  }
}

interface LineUserInfo {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
}

interface TelegramUserInfo {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface UnifiedUserInfo {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider: AuthProviderType;
}

export const createUserIfNotExists = async ({ userId }: { userId: string }) => {
  // Check if wallet collection is available first
  const isWalletCollectionAvailable = await checkWalletCollectionAvailability();
  
  if (!isWalletCollectionAvailable) {
    // Return mock record immediately without attempting to access collection
    return {
      id: `mock_${userId}`,
      userId: userId,
      walletAddress: null,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      collectionId: "User_Wallet",
      collectionName: "User_Wallet"
    };
  }

  let userWalletRecord: RecordModel | null = null;
  const pbAdmin = getPocketBaseAdmin();
  
  try {
    userWalletRecord = await pbAdmin
      .collection("User_Wallet")
      .getFirstListItem(`userId="${userId}"`);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      try {
        // User_Wallet record not found, create new
        const newUserWalletEntry = await pbAdmin
          .collection("User_Wallet")
          .create({ userId });

        // Wallet creation (sequential, as walletAddress is needed for update)
        const walletAddress = (
          await engine.backendWallet.create({ type: "local" })
        ).result.walletAddress;

        await pbAdmin
          .collection("User_Wallet")
          .update(newUserWalletEntry.id, { walletAddress });

        userWalletRecord = { ...newUserWalletEntry, walletAddress };
      } catch (createError) {
        console.error("Error creating User_Wallet record:", createError);
        // Return mock record if creation fails
        return {
          id: `mock_${userId}`,
          userId: userId,
          walletAddress: null,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          collectionId: "User_Wallet",
          collectionName: "User_Wallet"
        };
      }
    } else {
      console.error("Error fetching User_Wallet:", error);
      // Return mock record for any other error
      return {
        id: `mock_${userId}`,
        userId: userId,
        walletAddress: null,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        collectionId: "User_Wallet",
        collectionName: "User_Wallet"
      };
    }
  }

  // If walletAddress is missing, try to create and update
  if (userWalletRecord && !userWalletRecord.walletAddress) {
    try {
      const walletAddress = (
        await engine.backendWallet.create({ type: "local" })
      ).result.walletAddress;
      await pbAdmin
        .collection("User_Wallet")
        .update(userWalletRecord.id, { walletAddress });
      userWalletRecord.walletAddress = walletAddress;
    } catch (error) {
      console.warn("Error updating walletAddress, continuing without wallet:", error);
      // Don't throw error, just continue without wallet
    }
  }
  return userWalletRecord;
};

export const getUserById = async (userId: string) => {
  // Check if wallet collection is available first
  const isWalletCollectionAvailable = await checkWalletCollectionAvailability();
  
  if (!isWalletCollectionAvailable) {
    // Return mock record immediately without attempting to access collection
    return {
      id: `user_${userId}`,
      userId: userId,
      walletAddress: null,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      collectionId: "User_Wallet",
      collectionName: "User_Wallet"
    };
  }

  const pbAdmin = getPocketBaseAdmin();
  try {
    pbAdmin.autoCancellation(false);
    return await pbAdmin
      .collection("User_Wallet")
      .getFirstListItem(`userId="${userId}"`);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      console.log(`User_Wallet not found for user ${userId}, attempting to create wallet...`);
      
      try {
        // Try to create wallet using the existing function
        const walletResult = await createUserIfNotExists({ userId });
        if (walletResult) {
          return walletResult;
        }
      } catch (walletError) {
        console.warn(`Failed to create wallet for user ${userId}:`, walletError);
        
        // If wallet creation fails, return a basic user record without wallet
        // This allows users to authenticate even without wallet provisioning
        return {
          id: `user_${userId}`,
          userId: userId,
          walletAddress: null,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          collectionId: "User_Wallet",
          collectionName: "User_Wallet"
        };
      }
      
      throw new NotFoundException(ERROR_MESSAGES[ErrorCode.USER_NOT_FOUND]);
    }
    console.error(`Error fetching User_Wallet by ID ${userId}:`, error);
    
    // For any other error, return a mock user record to prevent crashes
    return {
      id: `user_${userId}`,
      userId: userId,
      walletAddress: null,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      collectionId: "User_Wallet",
      collectionName: "User_Wallet"
    };
  }
};

export const createAuthUser = async (userinfo: LineUserInfo) => {
  const { email, name, picture } = userinfo;

  if (!email) {
    throw new Error("Email is required for authentication.");
  }

  try {
    // Try to authenticate existing user
    return await pb.collection("users").authWithPassword(email, UserPassword);
  } catch (error) {
    if (
      error instanceof ClientResponseError &&
      (error.status === 404 || error.status === 400)
    ) {
      // User not found, create new - Use regular PocketBase instance like original implementation
      const data = {
        email: email,
        emailVisibility: true,
        name: name || email.split('@')[0], // Fallback to email prefix if no name
        password: UserPassword,
        passwordConfirm: UserPassword,
      };
      
      console.log('Creating user with data:', { 
        email: data.email,
        name: data.name,
        hasPassword: !!data.password,
        passwordLength: data.password?.length 
      });
      try {
        // Use regular PocketBase instance for user creation (matches original pattern)
        await pb.collection("users").create(data);
        return await pb.collection("users").authWithPassword(email, UserPassword);
      } catch (creationError) {
        console.error(`Failed to create user ${email}:`, creationError);
        if (creationError instanceof ClientResponseError) {
          console.error('PocketBase validation errors:', creationError.response);
          console.error('Status:', creationError.status);
          console.error('URL:', creationError.url);
        }
        throw creationError;
      }
    } else {
      console.error(`Error authenticating user ${email}:`, error);
      throw error;
    }
  }
};

/**
 * Create or authenticate user with multiple provider support
 */
export const createAuthUserWithProvider = async (
  provider: AuthProviderType,
  authData: any
) => {
  // Convert provider-specific data to unified format
  const userInfo = convertToUnifiedUserInfo(provider, authData);
  
  // For providers without email, we'll use provider_id@provider.local as email
  const email = userInfo.email || `${userInfo.id}@${provider}.local`;
  
  try {
    // Try to authenticate existing user
    return await pb.collection("users").authWithPassword(email, UserPassword);
  } catch (error) {
    if (
      error instanceof ClientResponseError &&
      (error.status === 404 || error.status === 400)
    ) {
      // User not found, create new
      const data = {
        email,
        emailVisibility: !!userInfo.email, // Only show real emails
        name: userInfo.name || `${provider} User`,
        password: UserPassword,
        passwordConfirm: UserPassword,
      };
      
      try {
        // Use regular PocketBase instance for user creation (matches original pattern)
        await pb.collection("users").create(data);
        return await pb.collection("users").authWithPassword(email, UserPassword);
      } catch (creationError) {
        console.error(`Failed to create ${provider} user ${email}:`, creationError);
        throw creationError;
      }
    } else {
      console.error(`Error authenticating ${provider} user ${email}:`, error);
      throw error;
    }
  }
};

/**
 * Convert provider-specific auth data to unified user info
 */
function convertToUnifiedUserInfo(
  provider: AuthProviderType,
  authData: any
): UnifiedUserInfo {
  switch (provider) {
    case 'line':
      return {
        id: authData.idToken.sub,
        email: authData.idToken.email,
        name: authData.idToken.name,
        avatar: authData.idToken.picture,
        provider: 'line'
      };
    
    case 'telegram':
      return {
        id: authData.id.toString(),
        name: `${authData.first_name}${authData.last_name ? ' ' + authData.last_name : ''}`,
        avatar: authData.photo_url,
        provider: 'telegram'
      };
    
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export const createWallet = async (userId: string) => {
  const pbAdmin = getPocketBaseAdmin();
  
  try {
    // Check if user already has a wallet
    let userWalletRecord: RecordModel | null = null;
    
    try {
      userWalletRecord = await pbAdmin
        .collection("User_Wallet")
        .getFirstListItem(`userId="${userId}"`);
        
      if (userWalletRecord?.walletAddress) {
        return {
          success: false,
          error: 'User already has a wallet',
          walletAddress: userWalletRecord.walletAddress
        };
      }
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        // User_Wallet record doesn't exist, create new one
        userWalletRecord = await pbAdmin
          .collection("User_Wallet")
          .create({ userId });
      } else {
        throw error;
      }
    }

    // Create wallet address using thirdweb engine
    const walletResult = await engine.backendWallet.create({ type: "local" });
    const walletAddress = walletResult.result.walletAddress;

    // Update user record with wallet address
    await pbAdmin
      .collection("User_Wallet")
      .update(userWalletRecord.id, { walletAddress });

    return {
      success: true,
      walletAddress,
      message: 'Wallet created successfully'
    };

  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet'
    };
  }
};