# 🚀 Autern Admin Access - Complete Setup Guide

## 🔧 **Current Issue Resolution**

The "Missing or insufficient permissions" error occurs because **Firestore security rules** need to be configured. Here's the complete solution:

### **Step 1: Set Up Firestore Rules (REQUIRED)**

1. **Go to Firebase Console**: https://console.firebase.google.com/project/autern-ade24/firestore/rules
2. **Replace current rules** with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to jobs for all users
    match /jobs/{document} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth);
    }
    
    // Allow authenticated users to read/write their own admin documents  
    match /admins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function to check if user is admin
    function isAdmin(auth) {
      return auth != null && 
             auth.token.email != null && 
             (auth.token.email == 'admin@autern.com' || 
              auth.token.email == 'admin@kraf.tech' ||
              auth.token.email == 'test@admin.com' ||
              auth.token.email == 'demo@autern.com');
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Click "Publish"** and wait 1-2 minutes for deployment

### **Step 2: Create Admin User**

1. **Go to Firebase Console**: https://console.firebase.google.com/project/autern-ade24/authentication/users
2. **Click "Add user"**
3. **Use authorized email**: `test@admin.com`
4. **Set password**: `admin123` (or any password you prefer)
5. **Click "Add user"**

### **Step 3: Test Login**

1. **Go to**: http://localhost:8083/admin
2. **Login with**:
   - Email: `test@admin.com`
   - Password: `admin123`

### **✅ Expected Result**

After completing the steps above:
- ✅ No more "Missing permissions" errors
- ✅ Successful admin login
- ✅ Access to admin dashboard
- ✅ Ability to post jobs and manage content

---

## 🛠 **Alternative: Quick Development Mode**

If you want to test immediately without setting up rules, you can use permissive rules temporarily:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Important**: Replace with proper rules before production deployment.

---

## 🎯 **Authorized Admin Emails**

The system accepts these emails as admin users:
- `admin@autern.com`
- `admin@kraf.tech`
- `test@admin.com`
- `demo@autern.com`

---

## 🐛 **Troubleshooting**

**Still getting errors?**
1. Check browser console for detailed logs
2. Verify Firebase user was created successfully
3. Ensure Firestore rules were published
4. Wait 2-3 minutes after publishing rules
5. Clear browser cache and try again

**Need help?**
The application now includes fallback mode for development, so even if Firestore rules aren't perfect, authorized emails should still work.
