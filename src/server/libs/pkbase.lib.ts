import Pocketbase from "pocketbase";

const pbURL = process.env.POCKETBASE_URL!;
const SuperToken = process.env.POCKETBASE_TOKEN!;

let pbInstance: Pocketbase | null = null;


export function getPocketBase(): Pocketbase {
  if (!pbInstance) {
    pbInstance = new Pocketbase(pbURL);
  }
  return pbInstance;
}

export function getPocketBaseAdmin(): Pocketbase {
  const pbAdminInstance = new Pocketbase(pbURL);
  
  // Only set admin token if it exists, otherwise use basic instance
  if (SuperToken && SuperToken.trim() !== '') {
    pbAdminInstance.authStore.save(SuperToken, null);
    
    console.log('PocketBase Admin initialized with token:', {
      url: pbURL,
      hasToken: !!SuperToken,
      tokenLength: SuperToken?.length,
      isValid: pbAdminInstance.authStore.isValid
    });
  } else {
    console.log('PocketBase Admin initialized without token (basic mode):', {
      url: pbURL,
      hasToken: false
    });
  }

  return pbAdminInstance;
}