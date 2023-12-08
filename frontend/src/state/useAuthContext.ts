import { useContext } from 'react';
import AuthContext, { AuthContextFields } from './AuthContext'

export function useAuthContext(): AuthContextFields {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("The auth context is not defined");
  }
  return context;
}