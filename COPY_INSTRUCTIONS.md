# Quick Copy Instructions - Files to Update

Follow these instructions to copy the modified files. Each file has been updated to implement role-based access control.

---

## 📂 Files to Copy (10 Total)

### ✅ Step 1: Frontend - Authentication Context
**File**: `lib/context/AuthContext.tsx`
- **Status**: MODIFIED
- **Action**: Copy entire file content
- **Size**: ~80 lines
- **Impact**: Adds role-based redirect logic

### ✅ Step 2: Frontend - Login Page  
**File**: `app/auth/login/page.tsx`
- **Status**: MODIFIED
- **Action**: Copy entire file content
- **Size**: ~65 lines (from line 1 onwards)
- **Impact**: Fixes redirect issue after login

### ✅ Step 3: Frontend - Register Page
**File**: `app/auth/register/page.tsx`
- **Status**: MODIFIED
- **Action**: Replace role selection section (lines ~110-130)
- **Key Change**: Update Select dropdown with: Bride, Groom, Family Member, Service Provider
- **Impact**: Better role clarity in registration

### ✅ Step 4: Frontend - Dashboard Layout
**File**: `app/dashboard/layout.tsx`
- **Status**: MODIFIED
- **Action**: Copy entire file content
- **Size**: ~60 lines
- **Impact**: Adds role validation for wedding planning dashboard

### ✅ Step 5: Frontend - Admin Layout
**File**: `app/admin/layout.tsx`
- **Status**: MODIFIED
- **Action**: Copy entire file content
- **Size**: ~45 lines
- **Impact**: Enhanced admin dashboard protection

### ✅ Step 6: Frontend - Admin Login Page
**File**: `app/auth/admin-login/page.tsx`
- **Status**: MODIFIED
- **Action**: Copy entire file content
- **Size**: ~90 lines
- **Change**: Added hardcoded credentials + context integration
- **Credentials**:
  - Email: `admin@wedbliss.com`
  - Password: `AdminWedBliss2024!`

### ✅ Step 7: Frontend - NEW Vendor Layout
**File**: `app/vendor/layout.tsx`
- **Status**: NEW FILE
- **Action**: Create new file with provided content
- **Size**: ~45 lines
- **Impact**: Protects vendor dashboard routes

### ✅ Step 8: Frontend - NEW Vendor Dashboard
**File**: `app/vendor/dashboard/page.tsx`
- **Status**: NEW FILE
- **Action**: Create new file with provided content
- **Size**: ~150 lines
- **Impact**: Vendor service provider dashboard

### ✅ Step 9: Backend - User Model
**File**: `server/models/User.js`
- **Status**: MODIFIED
- **Action**: Update role enum and add vendorDetails schema
- **Lines to Change**: ~19-25 (replace role enum and add vendorDetails)
- **Impact**: Supports all user types and vendor business info

### ✅ Step 10: Backend - Auth Controller
**File**: `server/controllers/authController.js`
- **Status**: MODIFIED
- **Action**: Add `redirectUrl` field to register and login responses
- **Lines to Change**: ~50 and ~83 (add redirectUrl to response objects)
- **Impact**: Provides correct redirect paths from backend

---

## 📋 Checklist for Implementation

- [ ] Copy `lib/context/AuthContext.tsx` - ENTIRE FILE
- [ ] Copy `app/auth/login/page.tsx` - ENTIRE FILE
- [ ] Update `app/auth/register/page.tsx` - Role selection section
- [ ] Copy `app/dashboard/layout.tsx` - ENTIRE FILE
- [ ] Copy `app/admin/layout.tsx` - ENTIRE FILE
- [ ] Copy `app/auth/admin-login/page.tsx` - ENTIRE FILE (with hardcoded credentials)
- [ ] CREATE `app/vendor/layout.tsx` - NEW FILE
- [ ] CREATE `app/vendor/dashboard/page.tsx` - NEW FILE
- [ ] Update `server/models/User.js` - Role enum and vendorDetails
- [ ] Update `server/controllers/authController.js` - Add redirectUrl to responses

---

## 🧪 Quick Test After Copying

1. **Test Bride/Groom Login**:
   - Register with role "Bride" → Login → Should be at `/dashboard`

2. **Test Vendor Login**:
   - Register with role "Service Provider" → Login → Should be at `/vendor/dashboard`

3. **Test Admin Hardcoded Login**:
   - Go to `/auth/admin-login`
   - Enter: `admin@wedbliss.com` / `AdminWedBliss2024!`
   - Should land at `/admin/dashboard` immediately

4. **Test Route Protection**:
   - Try `/admin/dashboard` as vendor → Should redirect to `/auth/admin-login`
   - Try `/vendor/dashboard` as bride → Should redirect to `/dashboard`
   - Try without token → Should redirect to appropriate login page

---

## 🔑 Important Notes

### Admin Credentials (DO NOT CHANGE)
```
Email: admin@wedbliss.com
Password: AdminWedBliss2024!
```

### User Role Enum (Updated)
```javascript
enum: ['bride', 'groom', 'family', 'vendor', 'admin']
```

### Redirect Mapping
```
bride/groom/family → /dashboard
vendor            → /vendor/dashboard
admin             → /admin/dashboard
```

### Context Function
New `getRedirectPath()` function returns correct URL based on user role

---

## 📧 Support

All changes are documented in:
- `ROLE_BASED_ACCESS_CHANGES.md` - Comprehensive documentation
- `COPY_INSTRUCTIONS.md` - This file

If you need to verify what changed, check the git diff or compare with previous version.
