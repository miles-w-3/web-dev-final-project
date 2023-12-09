import { Post } from "../../../shared/types/posts";
import webClient from "./base";

const POSTS_URL = '/posts'

export async function addPost(postContent: Post) {
  await webClient.post<Post>(POSTS_URL, postContent);

}
