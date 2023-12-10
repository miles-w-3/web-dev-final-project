import React, { Provider, useContext, useEffect, useState, PropsWithChildren } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { logInUser, registerUser } from "../clients/user";
import { auth } from './firebaseConnect'
import AuthContext, { AuthContextFields } from './AuthContext'
import { useNavigate } from "react-router";
import webClient from "../clients/base";
import { AxiosError } from "axios";
import { UserType } from "../../../shared/types/users";


// inspired by https://medium.com/@Rushabh_/implementing-user-login-and-signup-with-reactjs-and-firebase-a-comprehensive-guide-7300bd33cb01
export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {

  const nav = useNavigate()
  const [user, setUser] = useState<User | undefined>(undefined);

  async function logIn(email: string, password: string) {
    const loggedInUser: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await loggedInUser.user.getIdToken();
    console.log(`got loggedin user ${JSON.stringify(loggedInUser)}`);
    console.log(`Token is ${idToken}`)
    await logInUser(idToken);
    console.log(`COMPLETED LOGIN`)

  }

  async function signUp(email: string, password: string, userType: UserType, name: string) {
    const signedInUser = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await signedInUser.user.getIdToken();
    // sign in to the backend as well
    await registerUser(email, userType, name, signedInUser.user.uid, idToken);
  }
  async function logOut() {
    await signOut(auth);
  }

  // add middleware for handling unauth to log the user out
  webClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized responses
      if (error.response?.status === 401) {
        console.error("Received 401, logging the user out")
        logOut();
      }
    }
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? undefined);
      if (!currentUser) {
        nav('/auth');
      }
      console.log("Auth changed:", currentUser);
    });

    return (() => {
      // unsubscribe from auth state changes on unload
      unsub();
    })
  }, []);

  const contextFields: AuthContextFields = { user, logIn, logOut, signUp }

  return (
    <AuthContext.Provider value={contextFields}>
      {children}
    </AuthContext.Provider>
  );
}