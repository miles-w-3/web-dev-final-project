import { SerializedFavor, SerializedService } from '../../shared/types/posts'
import { Body, Controller, Get, Path, Post, Query, Request, Route, Tags, Delete, Middlewares } from "tsoa";
import FirebaseUsage from './firebase'
import { ensureToken } from "./Middleware";
import express from 'express';


@Route('posts')
export class PostsController extends Controller {

  @Get()
  @Middlewares(ensureToken)
  public async allPosts() {
    const firstDoc = (await FirebaseUsage.db.collection('Posts').listDocuments())[0].id;
    console.log(`DOC is ${JSON.stringify(firstDoc)}`);
    return 200
  }

  @Post('service')
  @Middlewares(ensureToken)
  public async addNewService(@Body() postInfo: SerializedService) {
    console.log(`Adding post: ${JSON.stringify(postInfo)}`);
    const toFirebase = { ...postInfo, datePosted: postInfo.datePosted }
    try {
      await FirebaseUsage.db.collection('services').add(toFirebase)
    }
    catch (err) {
      console.error(`Failed to save service post: ${JSON.stringify(err)}`);
      return 500;
    }
    return 200;
  }

  @Get('service/{serviceId}')
  @Middlewares(ensureToken)
  public async getService(serviceId: string) {
    try {
      const serializedService = (await FirebaseUsage.db.collection('services').doc(serviceId).get()).data();
      return serializedService;
    } catch(err){
      console.error(`Failed to get service ${serviceId}: ${JSON.stringify(serviceId)}`);
      this.setStatus(404);
    }
    return {}
  }

  @Post('favor')
  @Middlewares(ensureToken)
  public async addNewFavor(@Body() postInfo: SerializedFavor) {
    console.log(`Adding post: ${JSON.stringify(postInfo)}`);

    const toFirebase = { ...postInfo, datePosted: postInfo.datePosted, dateNeeded: postInfo.dateNeeded }
    try {
      await FirebaseUsage.db.collection('favors').add(toFirebase)
    }
    catch (err) {
      console.error(`Failed to save service post: ${JSON.stringify(err)}`);
      return 500;
    }
    return 200;
  }



  @Get('user')
  @Middlewares(ensureToken)
  // the type of post will be inferred by the type of user
  public async getPostsForUser(@Request() req: express.Request) {
    const uid = req.params.loggedInUid;
  }
}