import { Body, Controller, Get, Path, Post, Query, Response, Route, Tags, Delete, Request, SuccessResponse, Res, TsoaResponse, Security, Middlewares, HttpStatusCodeLiteral, Put } from "tsoa";
import type { UserLogin, UserRegister, UserDetails } from '../../shared/types/users'
import FirebaseUsage from "./firebase";
import express from 'express';
import { ensureToken } from "./Middleware";

@Route('users')
export class UsersController extends Controller {

  @Get()
  @Middlewares(ensureToken)
  public getAll(@Request() req: express.Request) {
    console.log('inside base')
    return { "msg": "this will get all users" };
  }

  @Put('')
  @Middlewares(ensureToken)
  public async updateUser(@Request() req: express.Request, @Body() body: any) {
    // for some reason it fails the validation test, but coerces properly
    const userDetails = body as UserDetails
    console.log(`In put! ud are ${JSON.stringify(userDetails)}`);
    const myUID = req.params.loggedInUid;
    console.log(`myuid is ${myUID}`);
    // a user can only update themselves
    if (myUID !== userDetails.uid) {
      console.warn(`UID ${myUID} is attempting to put userDetails for ${userDetails.uid}`);
      return 403;
    }

    console.log(`Going to update name to ${userDetails.name}`)
    const ref = FirebaseUsage.db.collection('users').doc(myUID);
    try {
      // can add more updatable fields in the future
      await ref.update({name: userDetails.name })
    }
    catch(err) {
      console.error(`Failed to update user data: ${err}`);
      return 500;
    }
    return 200;
  }

  @Get('me')
  @Middlewares(ensureToken)
  public async getMyProfile(@Request() req: express.Request,
    @Res() foundResponse: TsoaResponse<200, UserDetails>) {
    // my id will be filled into params by middleware
    const myUID = req.params.loggedInUid;
    if (!myUID) {
      this.setStatus(401);
      return;
    }
    const userDetails = await this._getProfileHelper(myUID)
    if (userDetails) foundResponse(200, userDetails);
  }

  @Get('profile/{uid}')
  @Middlewares(ensureToken)
  public async getProfileByID(uid: string,
    @Res() foundResponse: TsoaResponse<200, UserDetails>) {

    const userDetails = await this._getProfileHelper(uid)
    if (userDetails) foundResponse(200, userDetails);
  }

  private async _getProfileHelper(uid: string) {
    const data = (await FirebaseUsage.db.collection('users').doc(uid).get()).data();
    if (!data) {
      console.error(`Didn't find user ${uid} in db`)
      this.setStatus(404);
      return undefined;
    }
    const userDetails = { uid, name: data.name, email: data.email, userType: data.userType }
    return userDetails
  }



  //@Get('loggedIn')
  /**
   * Return the current logged in user info
   */
  // public async logIn(@Body() requestBody: string) {
  //   //const userRecord = await FirebaseUsage.auth
  //   // TODO: handle login flow as follows https://stackoverflow.com/questions/44899658/how-to-authenticate-an-user-in-firebase-admin-in-nodejs
  //   /*
  //   Client will have an auth token. they can notify this backend once of the auth token and the backend
  //   Can validate it. Then when the client sends requests with a token we compare it with a dict of auth
  //   tokens to user ids
  //   */
  // }

  @Post('login')
  @SuccessResponse('200', 'Successfully logged in')
  public async login(@Body() requestBody: UserLogin, @Request() req: express.Request) {
    const { idToken } = requestBody;
    return this._authHelper(req, idToken);
  }

  /**
   *
   * @param requestBody The information for the user creation
   * @returns Status 400 if the auth fails, else 201
   */
  @Post('register')
  public async register(@Body() requestBody: UserRegister, @Request() req: express.Request) {
    console.log(`Got messge from front! Creating db with id ${requestBody.uid}`);
    try {
      await FirebaseUsage.db.collection('users').doc(requestBody.uid).set({
        email: requestBody.email,
        name: requestBody.name,
        userType: requestBody.userType,
      });
    }
    catch (err) {
      console.error(`Failed to create user ${requestBody.email}: ${JSON.stringify(err)}`);
      // if we failed to add info to the db, then remove the auth user
      await FirebaseUsage.auth.deleteUser(requestBody.uid);
      return 400;
    }
    const { idToken } = requestBody;
    return this._authHelper(req, idToken, true);
  }

  private async _authHelper(req: express.Request, idToken: string, creating = false) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    try {
      const authCookie = await FirebaseUsage.auth.createSessionCookie(idToken, { expiresIn });
      req.session['user'] = authCookie;
    } catch (err) {
      console.error(`We got ${err}`);
      return 401;
    }
    return creating ? 201 : 200;
  }


}