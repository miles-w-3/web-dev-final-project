import { Body, Controller, Get, Path, Post, Query, Response, Route, Tags, Delete, Request, SuccessResponse, Res, TsoaResponse, Security, Middlewares, HttpStatusCodeLiteral } from "tsoa";
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
    return {"msg": "this will get all users"};
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
    const data = (await FirebaseUsage.db.collection('users').doc(myUID).get()).data();
    if (!data) {
      console.error(`Didn't find user ${myUID} in db`)
      this.setStatus(404);
      return;
    }
    const userDetails = { uid: data.id, name: data.name, email: data.email, userType: data.userType}
    foundResponse(200, userDetails);
  }

  // @Get('profile/{uid}')
  // @Middlewares(ensureToken)
  // public getProfileByID(uid: string) {

  // }



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

  private async _authHelper(req: express.Request, idToken: string, creating=false) {
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