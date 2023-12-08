import { User, UserCredential } from "firebase/auth";
import React from "react";

export interface AuthContextFields {
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  user: User | undefined;
}

const AuthContext = React.createContext<AuthContextFields | null>(null);
export default AuthContext;