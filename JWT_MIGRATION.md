# JWT Authentication Migration Guide

## Overview
The authentication system has been migrated from a database-stored token system to **JWT (JSON Web Tokens)**. This provides:
- **Stateless authentication** - No need to store tokens in the database
- **Better scalability** - Tokens can be verified without database queries
- **Industry standard** - JWT is widely used and secure
- **Same user experience** - Frontend remains unchanged

## What Changed

### Backend (`server.js`)

#### 1. **Middleware Authentication**
**Before:** Queried `admin_tokens` table for every protected request
```javascript
// Old: Database lookup required
pool.query('SELECT * FROM admin_tokens WHERE token = $1 AND expires_at > NOW()', [token])
```

**After:** Verifies JWT signature locally (no database call)
```javascript
// New: Local verification only
const decoded = jwt.verify(token, JWT_SECRET);
```

#### 2. **Login Endpoint** (`POST /api/login`)
**Before:** Generated base64 token and stored in database
```javascript
const token = Buffer.from(`${username}:${Date.now()}:${Math.random()}`).toString('base64');
await pool.query('INSERT INTO admin_tokens ...', [token, expiresAt]);
```

**After:** Generates JWT with 24-hour expiry
```javascript
const token = jwt.sign(
  { username, role: 'admin' },
  JWT_SECRET,
  { expiresIn: '24h' }
);
```

#### 3. **Logout Endpoint** (`POST /api/logout`)
**Before:** Deleted token from database
```javascript
await pool.query('DELETE FROM admin_tokens WHERE token = $1', [token]);
```

**After:** No database operation needed (client-side logout)
```javascript
res.json({ message: 'Logged out successfully' });
```

#### 4. **Database Schema**
The `admin_tokens` table is no longer used but remains in the database for backward compatibility.

### Frontend
**No changes needed** - Frontend continues to work exactly as before:
- Sends token in `Authorization: Bearer <token>` header
- Stores token in `localStorage.adminToken`
- Handles 403 responses the same way

## Configuration

### Required Environment Variable
Add `JWT_SECRET` to your `.env` file:

```bash
JWT_SECRET=your-jwt-secret-key-change-in-production-min-32-chars
```

**Important for Production:**
Generate a strong secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then set this as your `JWT_SECRET` in production environment variables.

## How It Works

### Login Flow
```
1. User submits credentials (Tourisme / 2026)
2. Server verifies credentials
3. Server generates JWT: jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
4. Server returns JWT to frontend
5. Frontend stores in localStorage
```

### Protected Request Flow
```
1. Frontend sends: Authorization: Bearer <JWT_TOKEN>
2. Server middleware calls: jwt.verify(token, JWT_SECRET)
3. If valid: User identity extracted, request processed
4. If invalid/expired: 403 Unauthorized error returned
```

### Token Expiry
- Tokens automatically expire after **24 hours**
- No database cleanup needed - JWT expiry is built-in
- Expired tokens are rejected by jwt.verify()

## Benefits

✅ **Better Performance** - No database queries for every request
✅ **Stateless** - Can scale horizontally without shared state
✅ **Secure** - JWT signature verified cryptographically
✅ **Standard** - JWT is an RFC standard used across the web
✅ **Expires Automatically** - No cleanup required
✅ **User-friendly** - Frontend experience unchanged

## Troubleshooting

### "Unauthorized - invalid or expired token"
- Token has expired (older than 24 hours)
- Login again to get a new token
- Check that `JWT_SECRET` is set correctly

### "Unauthorized - no token"
- Request is missing the `Authorization` header
- Frontend might not be storing token in localStorage
- Check browser DevTools → Application → Local Storage

### Tokens not working after restart
- Verify `JWT_SECRET` is set in .env
- Make sure it's the same value across restarts
- Different secrets = different tokens = authentication fails

## Rollback (if needed)

If you need to revert to the old database-token system:
1. Restore the previous `server.js` backup
2. The `admin_tokens` table still exists in the database
3. Restart the server

However, JWT is recommended for production use.
