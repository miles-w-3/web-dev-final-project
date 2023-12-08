import { Body, Controller, Get, Path, Post, Query, Response, Route, Tags, Delete, Middlewares } from "tsoa";
import FirebaseUsage from './firebase'
import { ensureToken } from "./Middleware";


@Route('posts')
export class PostsController extends Controller {

  @Get()
  @Middlewares(ensureToken)
  public async allPosts() {
    const firstDoc = (await FirebaseUsage.db.collection('Posts').listDocuments())[0].id;
    console.log(`DOC is ${JSON.stringify(firstDoc)}`);
    return 200
  }
}