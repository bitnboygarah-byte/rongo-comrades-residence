'use server';

/**
 * Secures the administrative master passcode on the server side.
 * This prevents the token from leaking to the client browser.
 */
export async function verifyAdminAccess(passcodeAttempt: string): Promise<boolean> {
  const masterKey = process.env.ADMIN_MASTER_KEY;

  if (!masterKey) {
    console.error("CRITICAL_SECURITY_ERROR: ADMIN_MASTER_KEY is not defined in environment variables.");
    return false;
  }

  // Trim whitespace on both ends to eliminate string matching discrepancies
  return passcodeAttempt.trim() === masterKey.trim();
}