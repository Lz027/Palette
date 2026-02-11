import { z } from 'zod';

/**
 * Safely parse JSON from localStorage with validation and error handling.
 * Prevents prototype pollution and handles corrupted data gracefully.
 */
export function safeParseLocalStorage<T>(
  key: string,
  schema: z.ZodType<T>,
  defaultValue: T
): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return defaultValue;
    }

    // Parse JSON with error handling
    const parsed = JSON.parse(stored);
    
    // Validate against schema to prevent malformed data
    const result = schema.safeParse(parsed);
    
    if (result.success) {
      return result.data;
    } else {
      console.warn(`Invalid data in localStorage key "${key}":`, result.error.message);
      // Remove corrupted data
      localStorage.removeItem(key);
      return defaultValue;
    }
  } catch (error) {
    // Handle JSON parse errors (corrupted data)
    console.warn(`Failed to parse localStorage key "${key}":`, error);
    localStorage.removeItem(key);
    return defaultValue;
  }
}

/**
 * Safely save data to localStorage with JSON serialization.
 */
export function safeSetLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error);
  }
}
