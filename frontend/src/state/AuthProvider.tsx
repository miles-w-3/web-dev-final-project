import React, { Provider, useContext, useEffect, useState, PropsWithChildren } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { logInUser, logOutUser, registerUser } from "../clients/user";
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
  // when the component first starts up, we haven't loaded the auth yet
  const [loading, setLoading] = useState<boolean>(true);

  async function logIn(email: string, password: string) {
    const loggedInUser: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await loggedInUser.user.getIdToken();
    console.log(`got loggedin user ${JSON.stringify(loggedInUser)}`);
    console.log(`Token is ${idToken}`)
    await logInUser(idToken);

  }

  async function signUp(email: string, password: string, userType: UserType, name: string) {
    const signedInUser = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await signedInUser.user.getIdToken();
    // sign in to the backend as well
    await registerUser(email, userType, name, signedInUser.user.uid, idToken);
  }
  async function logOut() {
    await signOut(auth); // firebase signout
    await logOutUser(); // backend logout
  }

  // add middleware for handling unauth to log the user out
  webClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized responses
      if (error.response?.status === 401) {
        nav('/login');
        console.error("Received 401, logging the user out on client-side");
        logOut();
      }
    }
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (loading) setLoading(false); // on the first time, we have loaded the page
      setUser(currentUser ?? undefined);
    });

    return (() => {
      // unsubscribe from auth state changes on unload
      unsub();
    })
  }, []);

  const contextFields: AuthContextFields = { user, logIn, logOut, signUp, }

  // render children once the loading is complete
  return (
    <AuthContext.Provider value={contextFields}>
      {!loading && children}
    </AuthContext.Provider>
  );
}