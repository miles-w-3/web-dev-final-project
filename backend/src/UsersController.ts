import { Body, Controller, Get, Path, Post, Query, Response, Route, Tags, Delete } from "tsoa";
import type { UserCreate, UserLogin } from '../../shared/types/users'
import { request } from "http";
import FirebaseUsage from "./firebase";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

@Route('users')
export class UsersController extends Controller {
  @Get()
  public getAll() {
    return {"msg": "this will get all users"};
  }

  @Post('loggedIn')
  public async logIn(@Body() requestBody: UserLogin) {
    //const userRecord = await FirebaseUsage.auth
    // TODO: handle login flow as follows https://stackoverflow.com/questions/44899658/how-to-authenticate-an-user-in-firebase-admin-in-nodejs
    /*
    Client will have an auth token. they can notify this backend once of the auth token and the backend
    Can validate it. Then when the client sends requests with a token we compare it with a dict of auth
    tokens to user ids
    */
  }

  /**
   *
   * @param requestBody The information for the user creation
   * @returns Status 400 if the auth fails, else 201
   */
  @Post('register')
  public async register(@Body() requestBody: UserCreate) {
    try {
      const userRecord: UserRecord = await FirebaseUsage.auth.createUser({
        email: requestBody.email,
        displayName: requestBody.name,
        password: requestBody.password,
      })
      console.log(`email is ${userRecord.email}`);
      return 201;
    } catch(exception) {
      return 400
    }

  }


}