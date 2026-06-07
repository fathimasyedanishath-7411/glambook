# GlamBook Security Specification

## 1. Data Invariants
- **Role Isolation**: No user can update their `role` field after creation to prevent unauthorized access elevation (e.g., a customer upgrading themselves to admin).
- **Relational Integrity**: Bookings must contain a valid `customerId` matching the creating user's UID.
- **Verification Lockpoint**: Verification of artists (`verified` field in the `artists` collection) can ONLY be set or updated by an administrator.
- **Terminal Lock on Bookings**: Once a booking status becomes `"completed"` or `"cancelled"`, it is locked and cannot be edited further by anyone except an administrator.
- **PII Integrity**: Read access to a user's sensitive contact info (like full email address, nested phone numbers) is restricted to the owner or an admin.
- **Service Ownership**: Only the respective artist can create, update, or delete services offered under their UID.

## 2. The "Dirty Dozen" Rogue Payloads
These payloads attempt to breach the GlamBook security invariants and must be caught and rejected by Firestore rules:

1. **Role Privilege Escalation**: Customer tries to update their profile with `"role": "admin"`.
2. **Ghost Record Insertion**: Customer tries to create a Booking with a different customer's UID.
3. **Self-Verification Bypass**: Artist tries to set `"verified": true` upon profile creation.
4. **Service Stealing**: Artist attempts to delete or update another artist's service listing.
5. **Rating Padding Injection**: User attempts to submit a Review with a nested rating of `9.5` (out of bounds, maximum is 5).
6. **Price Modification during Booking**: Customer attempts to modify standard service rates inside the Artist collection.
7. **Orphaned Booking Entry**: User creates a booking with a non-existent Artist ID or Customer ID.
8. **Shadow Data Insertion**: Injecting a massive mock payload into the `payments` collection claiming a standard transaction is completed with `$0` amount.
9. **Fake Verification Status on User**: User tries to write a ghost status to `/users/someUser/verified`.
10. **Booking Overwrite Attack**: A random visitor tries to update someone else's booking to `"cancelled"`.
11. **PII Query Scraping**: Attempting a query-all on the `/users` collection containing private emails.
12. **System Log Erasure**: An artist attempts to delete another artist's completed reviews or system notifications.

## 3. Test Cases Draft (`firestore.rules.test.ts`)
```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

// This draft represents tests that would run in a CI environment to verify:
// - Prevent shadow updates on un-whitelisted fields
// - Prevent unverified email writes (request.auth.token.email_verified == true)
// - Block non-owners from updating booking records
```
