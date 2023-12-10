import { Favor, SerializedService, Service } from "../../../shared/types/posts";
import { UserDetails } from "../../../shared/types/users";
import webClient from "./base";

const POSTS_URL = '/posts'

export function addService(postContent: Service) {
  return webClient.post<Service>(`${POSTS_URL}/service`, postContent);
}

export async function getService(serviceId: string): Promise<Service | undefined> {
  const result = (await webClient.get(`${POSTS_URL}/service/${serviceId}`)).data;
  if (!result) return undefined;

  const serviceDetails: Service = {...result, datePosted: new Date(result.datePosted) }
  return serviceDetails;
}

export async function purchaseService(serviceId: string) {
  const userInfo = await webClient.put<any, UserDetails>(`${POSTS_URL}/service/${serviceId}`);
  return userInfo;
}

export function addFavor(postContent: Favor) {
  return webClient.post<Favor>(`${POSTS_URL}/favor`, postContent);
}
