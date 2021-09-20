import { Context } from "koa";
import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, } from "typeorm";
import { body, request, responsesAll, summary, tagsAll } from "koa-swagger-decorator";

import UserController from "./user";
import { profileSchema, User } from "../models/user";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(['Profile'])
export default class ProfileController {
  @request('get', '/edit-profile')
  @summary('Get profile by user in state')
  public static async getProfile(ctx: Context): Promise<void> {
    // load profile by user
    const curUser = ctx.state.user as User
    ctx.params = ctx.params ?? {}
    ctx.params.id = curUser.id
    await UserController.getUser(ctx)
  }

  @request('post', '/edit-profile')
  @summary('Edit profile by user in state')
  @body(profileSchema)
  public static async updateProfile(ctx: Context): Promise<void> {
    // update the profile by user
    const curUser = ctx.state.user as User
    const userRepository: Repository<User> = getManager().getRepository(User);
    const userToBeUpdated: User = await userRepository.findOne({ id: curUser.id });

    if (!userToBeUpdated) {
      // check if a user with the specified id exists
      ctx.status = 400;
      ctx.body = "The profile you are trying to update doesn't exist in the db";
      return
    }

    userToBeUpdated.location = ctx.request.body.name;
    userToBeUpdated.location = ctx.request.body.location;
    userToBeUpdated.aboutMe = ctx.request.body.aboutMe;

    // validate user entity
    const errors: ValidationError[] = await validate(userToBeUpdated); // errors is an array of validation errors
    
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else {
      // save the user's profile contained in the PUT body
      const user = await userRepository.save(userToBeUpdated);
      ctx.status = 201;
      ctx.body = user;
    }
  }
}