# 🔧 Firebase Firestore Rules Setup Guide

## Quick Fix for "Missing or insufficient permissions" Error

The authentication error you're seeing is due to Firestore security rules blocking access. Here's how to fix it:

### **Method 1: Firebase Console (Recommended)**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `autern-ade24`
3. **Navigate to Firestore Database** → **Rules** tab
4. **Replace the current rules** with this code:

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

5. **Click "Publish"** to deploy the new rules

### **Method 2: Temporary Development Rules (Quick Fix)**

If you want to test immediately, you can use these permissive rules temporarily:

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

⚠️ **Warning**: Only use Method 2 for development. Replace with proper rules before production.

### **Next Steps After Rules Deployment:**

1. **Wait 1-2 minutes** for rules to propagate
2. **Refresh your application**
3. **Try logging in** with an authorized email:
   - `admin@autern.com`
   - `test@admin.com`
   - `demo@autern.com`

### **Create Test User:**

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click **"Add user"**
3. Use email: `test@admin.com`
4. Set any password
5. Try logging in with these credentials

---

## 🎯 **Current Issue Resolution**

The "Missing or insufficient permissions" error will be resolved once you deploy the Firestore rules above. The application has been updated to handle permission issues gracefully and will work properly once the rules are in place.
