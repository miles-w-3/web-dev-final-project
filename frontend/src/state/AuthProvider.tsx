import React, { Provider, useContext, useEffect, useState, PropsWithChildren } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from './firebaseConnect'
import AuthContext, { AuthContextFields } from './AuthContext'
import { useNavigate } from "react-router";
import webClient from "../clients/base";
import { AxiosError } from "axios";


// inspired by https://medium.com/@Rushabh_/implementing-user-login-and-signup-with-reactjs-and-firebase-a-comprehensive-guide-7300bd33cb01
export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {

  const nav = useNavigate()
  const [user, setUser] = useState<User | undefined>(undefined);

  function logIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    nav('/auth');
    return signOut(auth);
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
      console.log("Auth changed:", currentUser);
      setUser(currentUser ?? undefined);
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