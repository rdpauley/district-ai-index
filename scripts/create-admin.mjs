import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

const sa = JSON.parse(readFileSync('./firebase-service-account.json', 'utf-8'));
const app = initializeApp({ credential: cert(sa) });
const auth = getAuth(app);

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node create-admin.mjs <email> <password>');
  process.exit(1);
}

try {
  const user = await auth.createUser({ email, password, emailVerified: true });
  // Set custom claim to mark as admin
  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log('✓ Admin user created:', user.uid);
  console.log('  Email:', email);
} catch (err) {
  if (err.code === 'auth/email-already-exists') {
    const existingUser = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(existingUser.uid, { admin: true });
    console.log('✓ User already exists, admin claim set');
    console.log('  UID:', existingUser.uid);
  } else {
    console.error('Error:', err.message);
  }
}
