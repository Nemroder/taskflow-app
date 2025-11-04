import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { auth } from "./config"

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  // Update profile with display name
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName })
  }

  return userCredential.user
}

export async function signInWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}
