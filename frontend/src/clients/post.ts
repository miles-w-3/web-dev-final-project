import { Favor, Posts, FavoriteQueryResult, SerializedService, Service } from "../../../shared/types/posts";
import { UserDetails } from "../../../shared/types/users";
import webClient from "./base";

const POSTS_URL = '/posts'

export function addService(postContent: Service) {
  return webClient.post<Service>(`${POSTS_URL}/service`, postContent);
}

// get service, translating the serialized date back into a Date instance
export async function getService(serviceId: string): Promise<Service | undefined> {
  const result = (await webClient.get(`${POSTS_URL}/service/${serviceId}`)).data;
  if (!result) return undefined;

  const serviceDetails: Service = {...result, datePosted: new Date(result.datePosted) }
  return serviceDetails;
}


export async function purchaseService(serviceId: string) {
  const userInfo = await webClient.put<UserDetails>(`${POSTS_URL}/service/${serviceId}`);
  return userInfo.data;
}

export function addFavor(postContent: Favor) {
  return webClient.post<Favor>(`${POSTS_URL}/favor`, postContent);
}

// get favor, translating serialized date fields
export async function getFavor(favorId: string): Promise<Favor | undefined> {
  const result = (await webClient.get(`${POSTS_URL}/favor/${favorId}`)).data;
  if (!result) return undefined;

  const favorDetails: Favor = { ...result,
    datePosted: new Date(result.datePosted),
    dateNeeded: new Date(result.dateNeeded),
  }
  return favorDetails;
}

export async function acceptFavor(favorId: string) {
  const userInfo = await webClient.put<UserDetails>(`${POSTS_URL}/favor/${favorId}`);
  console.log(`UserInfo is ${userInfo}`);
  return userInfo.data;
}

export async function getAllData(){
  const result = (await webClient.get(POSTS_URL)).data;
  if(!result) {
    return undefined;
  }
  const allPosts = result as Posts;
  console.log(JSON.stringify(allPosts))
  return allPosts;
}

export async function getPostsByUser() {
  const result = (await webClient.get(`${POSTS_URL}/user`)).data;
  if(!result) {
    return undefined;
  }
  const allPosts = result as Posts;
  console.log(JSON.stringify(allPosts))
  return allPosts;
}

export async function getAcceptedPurchase() {
  const result = (await webClient.get(`${POSTS_URL}/user/accept`)).data;
  if(!result) {
    return undefined;
  }
  const allPosts = result as Posts;
  console.log(JSON.stringify(allPosts))
  return allPosts;
}

export async function getIsFavorite(postId: string) {
  const result = await webClient.get<FavoriteQueryResult>(`${POSTS_URL}/favorite/${postId}`);
  console.log(`Favorite result is ${JSON.stringify(result.data)}`);
  return result.data.found;
}

export function addFavorite(postId: string) {
  return webClient.post(`${POSTS_URL}/favorite/${postId}`)
}

export async function removeFavorite(postId: string) {
  return webClient.delete(`${POSTS_URL}/favorite/${postId}`);
}

export async function getAnonymousPosts() {
  const result = await webClient.get(`${POSTS_URL}/anonymous`);
  if (!result.data) return undefined;
  return result.data as Posts;
}