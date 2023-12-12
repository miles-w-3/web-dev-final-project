import { Posts } from '../../../shared/types/posts';
import { UserDetails, UserLogin, UserRegister, UserType } from '../../../shared/types/users'
import webClient from './base'

// designed to talk to the user routes on the backend
const USERS_URL = '/users'

export async function listUsers() {
  const result = await webClient.get(USERS_URL);
  console.log(`fired result was ${JSON.stringify(result)}`)
}

export async function getLoggedInUserDetails() {
  const result: UserDetails = (await webClient.get<UserDetails>(`${USERS_URL}/me`)).data;
  console.log(`Got logged in user info ${JSON.stringify(result)}`);
  return result;
}

// get anonymous details about a user, no auth needed
export async function getAnonymousDetails(uid: string) {
  const result = (await webClient.get<UserDetails>(`${USERS_URL}/anonymous/${uid}`));
  return result;
}

export async function getUserDetails(uid: string) {
  const result = await webClient.get<UserDetails>(`${USERS_URL}/profile/${uid}`);
  console.log(`ud result is ${JSON.stringify(result)}`);
  return result;
}

export async function updateUserDetails(userDetails: UserDetails) {
  console.log(`Putting user details: ${JSON.stringify(userDetails)}`);
  const result = await webClient.put(USERS_URL, userDetails);
  return result.status;
}

export async function logInUser(idToken: string) {
  const logInInfo: UserLogin = {
    idToken
  }
  console.log(`Gonna log in with token ${idToken}`);
  const response = await webClient.post(`${USERS_URL}/login`, logInInfo);
  console.log(`Response was ${JSON.stringify(response)}`);
}

export async function registerUser(email: string, type: string, name: string,
  uid: string, idToken: string) {
  console.log('In register user!')
  const registerInfo: UserRegister = {
    email: email,
    userType: type as UserType,
    name: name,
    uid: uid,
    idToken: idToken,
  }
  try {
    const response = await webClient.post(`${USERS_URL}/register`, registerInfo);
    console.log(`Response was ${JSON.stringify(response)}`)
    return response.status === 201;
  } catch (err) {
    console.error(`Failed to register user: ${JSON.stringify(err)}`);
    return false;
  }
}

export async function logOutUser() {
  await webClient.post(`${USERS_URL}/logout`);
}


export async function getUserFavorites() {
  const result = await webClient.get(`${USERS_URL}/favorites`);
  if (!result.data) return undefined;
  return result.data as Posts;
}