import { Post as PostInfo } from '../../shared/types/posts'
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

  @Post()
  @Middlewares(ensureToken)
  public async addNewPost(@Body() postInfo: any) {
    console.log(`Adding post: ${JSON.stringify(postInfo)}`);
    // TODO: MAke postinfo type work
    const toFirebase = { ...postInfo, datePosted: postInfo.datePosted, dateNeeded: postInfo.dateNeeded }
    // TODO: Add check that postedBy is the same as the token holder
    await FirebaseUsage.db.collection('posts').add(toFirebase)
    // TODO: return something different on error
    return 200;
  }


}