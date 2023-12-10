export type UserType = 'requestor' | 'seller';

export interface UserRegister {
  email: string;
  name: string;
  userType: UserType;
  uid: string;
  idToken: string;
}

export interface UserDetails {
  email: string;
  name: string;
  userType: UserType;
  uid: string;
}

export interface UserLogin {
  idToken: string;
}

export interface RequestingUser {
  id: string;
  userName: string;
  name: string;
  requestsPosted: number;
}

export interface RespondingUser {
  id: string;
  userName: string;
  name: string;
  requestsFulfilled: number;
}

