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
import { Post, postSchema } from "../models/post";

@responsesAll({
  200: { description: "success" },
  400: { description: "bad request" },
  401: { description: "unauthorized, missing/wrong jwt token" },
})
@tagsAll(["Post"])
export default class PostController {
  @request("get", "/posts")
  @summary("Find all posts")
  public static async getPosts(ctx: Context): Promise<void> {
    // load all posts
    const postRepository: Repository<Post> = getManager().getRepository(Post);
    const posts: Post[] = await postRepository.find({ take: 20 });

    ctx.status = 200;
    ctx.body = posts;
  }
}