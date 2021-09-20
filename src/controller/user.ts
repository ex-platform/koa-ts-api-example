import { Context } from "koa";
import {
  body,
  path,
  request,
  responsesAll,
  summary,
  tagsAll,
} from "koa-swagger-decorator";
import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, Like } from "typeorm";

import { Role } from "../models/role";
import { User, userSchema, createUser as _createUser } from "../models/user";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["User"])
export default class UserController {
  @request("get", "/users")
  @summary("Find all users")
  public static async getUsers(ctx: Context): Promise<void> {
    // load all users
    const userRepository: Repository<User> = getManager().getRepository(User);
    const users: User[] = await userRepository.find({ take: 20 });

    ctx.status = 200;
    ctx.body = users;
  }

  @request("get", "/users/{id}")
  @summary("Find user by id")
  @path({
    id: { type: "number", required: true, description: "id of user" },
  })
  public static async getUser(ctx: Context): Promise<void> {
    // load user by id
    const userRepository: Repository<User> = getManager().getRepository(User);
    const user: User | undefined = await userRepository.findOne(
      +ctx.params.id || 0
    );

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      ctx.status = 400;
      ctx.body = "The user you are trying to retrieve doesn't exist in the db";
    }
  }

  @request("post", "/users")
  @summary("Create a user")
  @body(userSchema)
  public static async createUser(ctx: Context): Promise<void> {
    // build up entity user to be saved
    const roleRepository: Repository<Role> = getManager().getRepository(Role);
    const userRepository: Repository<User> = getManager().getRepository(User);
    const role: Role = await roleRepository.findOne({ name: "User" });
    const userToBeSaved: User = _createUser(
      ctx.request.body.email,
      ctx.request.body.name,
      role
    );

    // validate user entity
    const errors: ValidationError[] = await validate(userToBeSaved); // errors is an array of validation errors

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (await userRepository.findOne({ email: userToBeSaved.email })) {
      ctx.status = 400;
      ctx.body = "The specified e-mail address already exists";
    } else {
      // save the user contained in the POST body
      const user = await userRepository.save(userToBeSaved);
      ctx.status = 201;
      ctx.body = user;
    }
  }

  @request("put", "/users/{id}")
  @summary("Update a user")
  @path({
    id: { type: "number", required: true, description: "id of user" },
  })
  @body(userSchema)
  public static async updateUser(ctx: Context): Promise<void> {
    // update the user by specified id
    const userRepository: Repository<User> = getManager().getRepository(User);
    const userToBeUpdated: User = await userRepository.findOne({ id: +ctx.params.id || 0});

    if (!userToBeUpdated) {
      // check if a user with the specified id exists
      ctx.status = 400;
      ctx.body = "The user you are trying to update doesn't exist in the db";
      return
    }

    userToBeUpdated.name = ctx.request.body.name;
    userToBeUpdated.email = ctx.request.body.email;

    // validate user entity
    const errors: ValidationError[] = await validate(userToBeUpdated); // errors is an array of validation errors

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (
      await userRepository.findOne({
        id: Not(Equal(userToBeUpdated.id)),
        email: userToBeUpdated.email,
      })
    ) {
      ctx.status = 400;
      ctx.body = "The specified e-mail address already exists";
    } else {
      // save the user contained in the PUT body
      const user = await userRepository.save(userToBeUpdated);
      ctx.status = 201;
      ctx.body = user;
    }
  }

  @request("delete", "/users/{id}")
  @summary("Delete user by id")
  @path({
    id: { type: "number", required: true, description: "id of user" },
  })
  public static async deleteUser(ctx: Context): Promise<void> {
    // find the user by specified id
    const userRepository = getManager().getRepository(User);
    const userToRemove: User | undefined = await userRepository.findOne(
      +ctx.params.id || 0
    );

    if (!userToRemove) {
      ctx.status = 400;
      ctx.body = "The user you are trying to delete doesn't exist in the db";
    } else if (ctx.state.user.email !== userToRemove.email) {
      // check user's token id and user id are the same
      ctx.status = 403; // FORBIDDEN
      ctx.body = "A user can only be deleted by himself";
    } else {
      // the user is there so can be removed
      await userRepository.remove(userToRemove);
      ctx.status = 204; // NO CONTENT
    }
  }

  @request("delete", "/testusers")
  @summary("Delete users generated by integration and load tests")
  public static async deleteTestUsers(ctx: Context): Promise<void> {
    // find test users
    const userRepository = getManager().getRepository(User);
    const usersToRemove: User[] = await userRepository.find({
      where: { email: Like("%@test.com") },
    });

    // the user is there so can be removed
    await userRepository.remove(usersToRemove);
    ctx.status = 204; // NO CONTENT
  }
}
