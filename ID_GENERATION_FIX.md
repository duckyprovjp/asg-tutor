# ID Generation Fix for FER202 Assignment

## Problem

When registering new accounts, json-server was automatically generating random string IDs (like "1e57", "f1fa") instead of sequential numeric IDs. This caused issues when retrieving user information and maintaining data consistency.

## Solution

Implemented a sequential ID generation system that ensures all new records get proper sequential numeric IDs.

## Changes Made

### 1. Created ID Generation Utility (`src/utils/idGenerator.js`)

- `generateNextId(entity)`: Generates the next sequential ID for any entity
- `createWithSequentialId(entity, data)`: Creates a record with a sequential ID

### 2. Updated API Service (`src/services/api.js`)

- Modified all `create` functions to use sequential ID generation
- Updated entities: users, tutors, students, schedules, attendance, reviews, notifications, messages, subjects, locations

### 3. Cleaned Database (`src/db.json`)

- Removed problematic user entries with random string IDs
- Kept only properly structured users with sequential IDs

## How It Works

1. **ID Generation Process**:

   - Fetches all existing records for the entity
   - Finds the highest numeric ID
   - Generates the next sequential ID (maxId + 1)
   - Returns the ID as a string to maintain consistency

2. **Registration Flow**:
   - User submits registration form
   - System generates next sequential ID
   - User is created with the proper ID
   - Data is stored in db.json with consistent ID format

## Benefits

- **Consistency**: All IDs are now sequential numbers as strings
- **Reliability**: No more random string IDs causing retrieval issues
- **Maintainability**: Centralized ID generation logic
- **Scalability**: Works for all entity types

## Testing

To test the ID generation:

1. Start the json-server:

   ```bash
   npm run server
   ```

2. Run the test script:

   ```bash
   node test-id-generation.js
   ```

3. Or test through the application:
   - Register a new user
   - Check that the ID is sequential (e.g., "4", "5", etc.)

## Current User IDs

- "1" - admin
- "2" - tutor1
- "3" - student1
- Next new user will get ID "4"

## Files Modified

- `src/services/api.js` - Updated all create functions
- `src/utils/idGenerator.js` - New utility functions
- `src/db.json` - Cleaned up problematic entries
- `test-id-generation.js` - Test script for verification
