import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from './firebaseConnect'


// inspired by https://medium.com/@Rushabh_/implementing-user-login-and-signup-with-reactjs-and-firebase-a-comprehensive-guide-7300bd33cb01
const userAuthContext = createContext();

export function useUserContext() {
  return useContext(userAuthContext);
}


export function UserAuthContextProvider({ children }) {
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth changed:", currentUser);
      setUser(currentUser);
    });

    return (() => {
      // unsubscribe from auth state changes on unload
      unsub();
    })
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, logOut, signUp, }}
    >
      {children}
    </userAuthContext.Provider>
  );
}