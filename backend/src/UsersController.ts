import { Body, Controller, Get, Path, Post, Query, Response, Route, Tags, Delete } from "tsoa";
import type { UserLogin } from '../../shared/types/users'

@Route('users')
export class UsersController extends Controller {
  @Get()
  public getAll() {
    return {"msg": "this will get all users"};
  }

  @Post('login')
  public logIn(@Body() requestBody: UserLogin) {
    return { "msg": "username is " + requestBody.userName };
  }


}