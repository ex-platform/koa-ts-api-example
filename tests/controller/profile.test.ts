import { Context } from "koa";
import { getManager } from "typeorm";
import { validate } from "class-validator";

import { getRole, Role } from "../../src/models/role";
import ProfileController from "../../src/controller/profile";
import { createUser, User } from "../../src/models/user";

const role: Role = getRole("User");
const baseUser: User = createUser("aaron.so@test.com", "Aaron So", role);
const user: User = createUser("aaron.so@test.com", "Aaron So", role);
baseUser.id = 0;
user.id = 0;
user.location = "Victoria, Virginia"
user.aboutMe = "I like to cook and eat."

jest.mock("typeorm", () => {
  const doNothing = () => {};

  return {
    getManager: jest.fn(),
    PrimaryGeneratedColumn: doNothing,
    Column: doNothing,
    Entity: doNothing,
    Equal: doNothing,
    Not: doNothing,
    Like: doNothing,
    OneToOne: doNothing,
    JoinColumn: doNothing,
    CreateDateColumn: doNothing,
    UpdateDateColumn: doNothing,
    ManyToOne: doNothing,
    OneToMany: doNothing
  };
});

jest.mock("class-validator", () => {
  const doNothing = () => {};

  return {
    validate: jest.fn(),
    Length: doNothing,
    IsEmail: doNothing,
  };
});

describe("Profile controller", () => {
  it("getProfile should return status 200 and found user's profile", async () => {
    const userRepository = { findOne: jest.fn().mockReturnValue(user) };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => userRepository,
    });
    const context = {
      status: undefined,
      body: undefined,
      state: { user: user },
    } as unknown as Context;

    await ProfileController.getProfile(context)

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(200);
    expect((context.body as User).location).toBe("Victoria, Virginia");
    expect((context.body as User).aboutMe).toBe("I like to cook and eat.");
  })

  it('UpdateProfile should return 201 if profile is updated', async() => {
    const userRepository = {
      findOne: jest
        .fn()
        .mockReturnValueOnce(baseUser),
      save: jest.fn().mockReturnValue(user),
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => userRepository,
    });
    (validate as jest.Mock).mockReturnValue([]);

    const context = {
      status: undefined,
      body: undefined,
      state: { user: baseUser },
      request: { body: {
        name: "Aaron So",
        location: "Victoria, Virginia",
        aboutMe: "I like to cook and eat."
      } },
    } as unknown as Context;

    await ProfileController.updateProfile(context);
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(201);
    expect(context.body).toStrictEqual(user);
  })

  it("updateProfile should return 400 if user does not exist.", async () => {
    const userRepository = {
      findOne: jest.fn().mockReturnValue(undefined as User),
    };
    (getManager as jest.Mock).mockReturnValue({
      getRepository: () => userRepository,
    });
    (validate as jest.Mock).mockReturnValue([]);
    const context = {
      status: undefined,
      body: undefined,
      state: { user: user },
      request: { body: user },
    } as unknown as Context;

    await ProfileController.updateProfile(context);
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(context.status).toBe(400);
    expect(context.body).toStrictEqual(
      "The profile you are trying to update doesn't exist in the db"
    );
  });
})