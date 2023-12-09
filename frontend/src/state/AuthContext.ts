import { User, UserCredential } from "firebase/auth";
import React from "react";
import { UserType } from "../../../shared/types/users";

export interface AuthContextFields {
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType, name: string) => Promise<void>;
  logOut: () => Promise<void>;
  user: User | undefined;
}

const AuthContext = React.createContext<AuthContextFields | null>(null);
export default AuthContext;