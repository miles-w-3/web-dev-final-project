import { Body, Controller, Get, Path, Post, Query, Response, Route, Tags, Delete } from "tsoa";
import FirebaseUsage from './firebase'


@Route('posts')
export class PostsController extends Controller {

  @Get()
  public async allPosts() {
    const firstDoc = (await FirebaseUsage.db.collection('Posts').listDocuments())[0].id;
    console.log(`DOC is ${JSON.stringify(firstDoc)}`);
    return 200
  }
}