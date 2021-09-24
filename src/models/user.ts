import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, Length } from "class-validator";

import { Permission } from "./permission";
import { Role, hasPermission, getRole } from "./role";
import { Post } from "./post";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  @Length(10, 100)
  @IsEmail()
  email: string;

  @Column({ length: 64 })
  @Length(4, 30)
  name: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ length: 64})
  location: string;

  @Column({ length: 64})
  aboutMe: string;

  @Column({ length: 32 })
  avatar: string;

  @OneToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role: Role;

  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @CreateDateColumn()
  memberSince: Date;

  @UpdateDateColumn()
  lastSeen: Date;
}

const userSchema = {
  name: { type: "string", required: true, example: "Aaron So" },
  email: { type: "string", required: true, example: "aaron.so@test.com" }
}

const profileSchema = {
  name: { type: "string", required: true, example: "Aaron So" },
  location: { type: "string", required: true, example: "Victoria, Virginia" },
  aboutMe: { type: "string", required: true, example: "I like to cook and eat." },
}

function createUser(email: string, name: string, role: Role) {
  const user = new User()
  user.email = email
  user.name = name
  user.role = role
  return user
}

function createAnonymousUser() {
  const anonyUser = new User()
  anonyUser.id = -1
  anonyUser.email = ''
  anonyUser.name = 'anonymousUser'
  anonyUser.role = getRole('AnonymousUser')
  return anonyUser
}

function can(user: User, perm: number) {
  if (user.id === -1) {
    return false
  }
  return hasPermission(user.role, perm);
}

function isAdministrator(user: User) {
  if (user.id === -1) {
    return false
  }
  return can(user, Permission.ADMIN);
}

export { User, userSchema, profileSchema, createUser, createAnonymousUser, can, isAdministrator };
