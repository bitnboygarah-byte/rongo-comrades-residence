'use server';

/**
 * Secures the administrative master passcode on the server side.
 * This prevents the token from leaking to the client browser.
 */
export async function verifyAdminAccess(passcodeAttempt: string): Promise<boolean> {
  // Pull the master key from your secure server environment variables (.env.local)
  const masterKey = process.env.ADMIN_MASTER_KEY;

  if (!masterKey) {
    console.error("CRITICAL_SECURITY_ERROR: ADMIN_MASTER_KEY is not defined in environment variables.");
    return false;
  }

  // Strictly evaluate validation parameters away from the client machine
  return passcodeAttempt === masterKey;
}