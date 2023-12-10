import { SerializedFavor, SerializedService } from '../../shared/types/posts'
import { Body, Controller, Get, Path, Post, Query, Request, Route, Tags, Delete, Middlewares, Put } from "tsoa";
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
      const result = (await FirebaseUsage.db.collection('services').doc(serviceId).get()).data();
      if (!result) throw new Error("Didn't get result");
      const sService = result as SerializedService;
      const postedByName = (await FirebaseUsage.db.collection('users').doc(sService.postedBy).get()).data()?.name ?? 'Unknown Poster'
      sService.postedByName = postedByName;
      // fill in purchased by name as well
      if (sService.purchasedBy) {
        const purchasedByName = (await FirebaseUsage.db.collection('users').doc(sService.purchasedBy).get()).data()?.name ?? 'Unknown Buyer'
        sService.purchasedByName = purchasedByName;
      }
      return sService;
    } catch(err){
      console.error(`Failed to get service ${serviceId}: ${JSON.stringify(err)}`);
      this.setStatus(404);
    }
    return {}
  }

  @Put('service/{serviceId}')
  @Middlewares(ensureToken)
  public async purchaseService(serviceId: string, @Request() req: express.Request) {
    const myUID = req.params.loggedInUid;
    try {
      await FirebaseUsage.db.collection('services').doc(serviceId).update({purchasedBy: myUID});
      const userInfo = (await FirebaseUsage.db.collection('users').doc(myUID).get()).data();
      if (!userInfo) throw new Error("Didn't get result");
      userInfo.uid = myUID;
      return userInfo;
    } catch (err) {
      console.error(`Failed to get service ${serviceId}: ${JSON.stringify(err)}`);
      this.setStatus(404);
    }
    return {}
  }

  @Get('favor/{favorId}')
  @Middlewares(ensureToken)
  public async getFavor(favorId: string) {
    try {
      const result = (await FirebaseUsage.db.collection('favors').doc(favorId).get()).data();
      if (!result) throw new Error("Didn't get result");
      const sFavor = result as SerializedFavor;
      const postedByName = (await FirebaseUsage.db.collection('users').doc(sFavor.postedBy).get()).data()?.name ?? 'Unknown Poster'
      sFavor.postedByName = postedByName;
      // fill in accepted by name as well if applicable
      if (sFavor.acceptedBy) {
        const acceptedByName = (await FirebaseUsage.db.collection('users').doc(sFavor.acceptedBy).get()).data()?.name ?? 'Unknown Acceptor'
        sFavor.acceptedByName = acceptedByName;
      }
      return sFavor;
    } catch (err) {
      console.error(`Failed to get favor ${favorId}: ${JSON.stringify(err)}`);
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

  @Put('favor/{favorId}')
  @Middlewares(ensureToken)
  public async acceptFavor(favorId: string, @Request() req: express.Request) {
    const myUID = req.params.loggedInUid;
    try {
      await FirebaseUsage.db.collection('favors').doc(favorId).update({ acceptedBy: myUID });
      const userInfo = (await FirebaseUsage.db.collection('users').doc(myUID).get()).data();
      console.log(`Sending user info ${JSON.stringify(userInfo)}`);
      if (!userInfo) throw new Error("Didn't get result");
      userInfo.uid = myUID;
      return userInfo;
    } catch (err) {
      console.error(`Failed to get service ${favorId}: ${JSON.stringify(err)}`);
      this.setStatus(404);
    }
    return {}
  }

  @Get('user')
  @Middlewares(ensureToken)
  // the type of post will be inferred by the type of user
  public async getPostsForUser(@Request() req: express.Request) {
    const uid = req.params.loggedInUid;
  }

}