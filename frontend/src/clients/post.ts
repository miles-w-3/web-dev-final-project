import { Favor, Service } from "../../../shared/types/posts";
import webClient from "./base";

const POSTS_URL = '/posts'

export function addService(postContent: Service) {
  return webClient.post<Service>(`${POSTS_URL}/service`, postContent);
}

export function addFavor(postContent: Favor) {
  return webClient.post<Favor>(`${POSTS_URL}/favor`, postContent);
}
