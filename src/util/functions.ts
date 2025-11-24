/**
 * Enhanced API key generator with improved security and collision resistance
 * Uses explicit crypto import to ensure availability across all environments
 */

// Import crypto directly to ensure availability
import * as crypto from 'node:crypto';

// Configuration
const SALT = "DNzFg9cfr8LYjvBKQkCJz+2q2R0SMRC9tmfAQWGx6d4=";
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

export function generateSecureApiKey(prefix = 'm10_', length = 36): string {
  // Calculate the length of the random portion
  const randomLength = Math.max(length - prefix.length, 8); // Ensure minimum secure length
  
  // Generate cryptographically secure random bytes using imported crypto
  const randomBytes = crypto.randomBytes(randomLength);
  
  // Build entropy sources
  const timestamp = Date.now().toString(36);
  const randomHex = randomBytes.toString('hex');
  
  // Combine entropy sources with salt for hashing
  const entropySource = timestamp + randomHex + SALT;
  
  // Create a more sophisticated hash using a simple implementation of FNV-1a
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < entropySource.length; i++) {
    hash ^= entropySource.charCodeAt(i);
    hash *= 16777619; // FNV prime
    hash |= 0; // Convert to 32bit integer
  }
  
  // Generate the base random ID
  let id = '';
  for (let i = 0; i < randomLength; i++) {
    // Use the random bytes as our primary source
    const randomIndex = randomBytes[i]! % CHARSET.length;
    id += CHARSET[randomIndex];
  }
  
  // Inject hash-derived characters for additional uniqueness
  const hashString = Math.abs(hash).toString(36);
  for (let i = 0; i < Math.min(hashString.length, randomLength / 3); i++) {
    const insertIndex = Math.floor(i * (randomLength / hashString.length));
    const hashCharIndex = hashString.charCodeAt(i) % CHARSET.length;
    id = id.substring(0, insertIndex) + CHARSET[hashCharIndex] + id.substring(insertIndex + 1);
  }
  
  // Ensure we have the exact length requested
  id = id.substring(0, randomLength);
  
  // Return the final key with prefix
  return prefix + id;
}

/**
 * Convenience function that matches your original naming convention
 * @param prefix - The prefix to use for the ID (default: 'm10_')
 * @param length - The total desired length including prefix (default: 36)
 * @returns A unique ID with the specified prefix
 */

/**
 * Example usage:
 * 
 * // Default API key (m10_ + 32 characters)
 * const apiKey = generateSecureApiKey();
 * 
 * // Using the muid function (same result)
 * const userId = muid('m10_', 36);
 */


export function muid(prefix = 'm10_', length = 36): string {
  return generateSecureApiKey(prefix, length);
}


export function makeRandomNumber():number {
    const number = Math.floor(Math.random() * 9)
    return number
}

export function getPercent(amt:number, from: number): number{
  const percent = ( amt / from ) * 100 
  return percent
}

export function getMaxUsage(status="active"):number{
  let max_usage = 20000
  if(status !== "active"){
    max_usage = 100
  }
  return max_usage
}

export function calcSize(
  bytes: number
) :string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;

  while ((size >= 100 * 1024 || size >= 100) && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
}