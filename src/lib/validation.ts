 import { z } from 'zod';
 
 // Constants for input limits
export const INPUT_LIMITS = {
  BOARD_NAME: 200,
  COLUMN_NAME: 100,
  CARD_TITLE: 300,
  CARD_DESCRIPTION: 2000,
  DISPLAY_NAME: 100,
  BIO: 500,
  SNIPPET_TITLE: 100,
  SNIPPET_CODE: 10000,
  CELL_VALUE: 1000,
  NOTE_TITLE: 100,
  NOTE_CONTENT: 2000,
} as const;
 
 // Validation schemas
 export const boardNameSchema = z.string()
   .trim()
   .min(1, 'Board name is required')
   .max(INPUT_LIMITS.BOARD_NAME, `Board name must be less than ${INPUT_LIMITS.BOARD_NAME} characters`);
 
 export const columnNameSchema = z.string()
   .trim()
   .min(1, 'Column name is required')
   .max(INPUT_LIMITS.COLUMN_NAME, `Column name must be less than ${INPUT_LIMITS.COLUMN_NAME} characters`);
 
 export const cardTitleSchema = z.string()
   .trim()
   .min(1, 'Card title is required')
   .max(INPUT_LIMITS.CARD_TITLE, `Card title must be less than ${INPUT_LIMITS.CARD_TITLE} characters`);
 
 export const displayNameSchema = z.string()
   .trim()
   .max(INPUT_LIMITS.DISPLAY_NAME, `Display name must be less than ${INPUT_LIMITS.DISPLAY_NAME} characters`);
 
 export const bioSchema = z.string()
   .trim()
   .max(INPUT_LIMITS.BIO, `Bio must be less than ${INPUT_LIMITS.BIO} characters`);
 
 export const snippetTitleSchema = z.string()
   .trim()
   .min(1, 'Snippet title is required')
   .max(INPUT_LIMITS.SNIPPET_TITLE, `Snippet title must be less than ${INPUT_LIMITS.SNIPPET_TITLE} characters`);
 
 export const snippetCodeSchema = z.string()
   .min(1, 'Code is required')
   .max(INPUT_LIMITS.SNIPPET_CODE, `Code must be less than ${INPUT_LIMITS.SNIPPET_CODE} characters`);
 
 export const cellValueSchema = z.string()
   .max(INPUT_LIMITS.CELL_VALUE, `Value must be less than ${INPUT_LIMITS.CELL_VALUE} characters`);
 
 // Helper function to validate and return result
 export function validateInput<T>(schema: z.ZodSchema<T>, value: unknown): { success: true; data: T } | { success: false; error: string } {
   const result = schema.safeParse(value);
   if (result.success) {
     return { success: true, data: result.data };
   }
   return { success: false, error: result.error.errors[0]?.message || 'Invalid input' };
 }
 
 // Truncate function for safe display
 export function truncateInput(value: string, maxLength: number): string {
   if (value.length <= maxLength) return value;
   return value.slice(0, maxLength);
 }