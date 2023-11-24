export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
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

