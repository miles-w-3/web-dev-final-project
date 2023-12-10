import { Favor, SerializedService, Service } from "../../../shared/types/posts";
import webClient from "./base";

const POSTS_URL = '/posts'

export function addService(postContent: Service) {
  return webClient.post<Service>(`${POSTS_URL}/service`, postContent);
}

export async function getService(serviceId: string): Promise<Service | undefined> {
  const result = await webClient.get<SerializedService>(`${POSTS_URL}/service/${serviceId}`);
  if (!result) return
}

export function addFavor(postContent: Favor) {
  return webClient.post<Favor>(`${POSTS_URL}/favor`, postContent);
}
