# User Profile - Quick Test Guide

## Prerequisites
- Backend running on localhost:3000
- Frontend running on localhost:5174
- Test user already created (email: johnplayer@test.com, password: Test@1234)

## Quick Test Steps

### Test 1: View Profile
1. Go to `http://localhost:5174/login`
2. Login with:
   - Email: `johnplayer@test.com`
   - Password: `Test@1234`
3. You'll be redirected to Player Dashboard
4. In navbar, click on your name avatar (top right)
5. A dropdown menu appears
6. Click "👤 My Profile"
7. ✅ You should see your profile information displayed

**Expected Result:**
- Profile page loads with all user information
- Fields show: User ID, Email, Mobile, Role (Player), Status (Active), Member Since date
- Edit button is visible
- No editable fields are shown yet

### Test 2: Edit Profile
1. From profile page, click "Edit Profile" button
2. Update some fields:
   - First Name: Change to "Johnny"
   - Address: Enter "123 Main Street"
   - City: Enter "New York"
3. Click "Save Changes"
4. ✅ Success message appears
5. Page auto-refreshes
6. Changes are now displayed in view mode

**Expected Result:**
- Form appears with editable fields
- Email and Mobile fields are disabled (grayed out)
- After saving, success message shows
- Profile displays updated information

### Test 3: Cancel Edit
1. Click "Edit Profile" button again
2. Change some fields
3. Click "Cancel" button
4. ✅ Form closes without saving

**Expected Result:**
- Old values are preserved
- Form closes
- Returns to view mode

### Test 4: Logout
1. In navbar, click user avatar
2. Click "🚪 Logout"
3. ✅ You should be redirected to home page
4. User avatar disappears from navbar
5. Login button reappears

**Expected Result:**
- Session is cleared
- Redirected to homepage
- Navbar shows "Log in" button again
- localStorage tokens are cleared

### Test 5: Protected Route
1. After logging out, directly go to `http://localhost:5174/profile`
2. ✅ You should be redirected to `/login`

**Expected Result:**
- Cannot access profile without authentication
- Auto-redirect to login page

### Test 6: Test with Field Owner (Optional)
1. If you have Field Owner account, login with those credentials
2. Go to profile
3. Scroll down to "Field Information" section
4. ✅ Should see field details (name, location, capacity, type, price)

**Expected Result:**
- Field Owner-specific fields appear
- Shows: Field Name, Location, Capacity, Type, Price Per Hour

### Test 7: Role-Specific Dashboard Link
1. Login as a user
2. Click user avatar in navbar
3. ✅ Should see role-specific dashboard link:
   - Player role → "📊 Player Dashboard"
   - Field_Owner role → "🏟️ Field Owner Dashboard"
   - Admin role → "⚙️ Admin Dashboard"
4. Click the link to navigate to dashboard

**Expected Result:**
- Correct dashboard link for user role
- Clicking navigates to appropriate dashboard

## Responsive Design Test

### Mobile (320px width)
1. Open `http://localhost:5174/profile` on phone or mobile emulator
2. ✅ Profile should be readable
3. Form fields stack vertically
4. Buttons are clickable
5. Navbar hamburger menu works

### Tablet (768px width)
1. Open on tablet or resize browser
2. ✅ Two-column grid for fields
3. Everything is properly aligned

### Desktop (1920px width)
1. Open on desktop
2. ✅ Two-column grid
3. All elements properly sized

## Edge Cases to Test

### Test: Empty Optional Fields
1. Login with a new user
2. Profile page shows "Not provided" for empty fields
3. Edit to add fields
4. Changes save correctly

### Test: Field Owner Role
1. Login with Field Owner account
2. Field Information section appears
3. Shows all field details correctly

### Test: Very Long Text
1. Edit bio with very long text (500+ characters)
2. Should wrap properly
3. Save and display correctly

## Success Criteria

✅ All tests pass without errors
✅ Profile data displays correctly
✅ Edit functionality works
✅ Save persists data to database
✅ Cancel discards changes
✅ Logout clears session
✅ Protected routes work
✅ Responsive design works
✅ Error messages display properly
✅ Navbar integration seamless

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Profile page shows blank | Check if logged in, refresh page |
| Edit button missing | Ensure you're in view mode |
| Email field shows error | Email is locked, cannot be edited |
| Save fails with error | Check network, verify token is valid |
| Logout doesn't work | Check browser console for errors |
| Profile not updating | Ensure backend is running on port 3000 |
| Navbar dropdown doesn't appear | Check if user is authenticated |

## Files to Review

- `client/src/routes/UserProfile.jsx` - Main profile component
- `client/src/routes/Navbar.jsx` - Updated navbar with auth
- `client/src/App.jsx` - Profile route configuration
- `backend/routes/user.route.js` - API endpoints
- `backend/controllers/user.controller.js` - Profile logic

## Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Check backend logs for API errors
3. Verify backend is running
4. Clear localStorage and login again
5. Check network tab for failed requests

