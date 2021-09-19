import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, Length } from "class-validator";

import { Permission } from "./permission";
import { Role, hasPermission, getRole } from "./role";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  @Length(10, 100)
  @IsEmail()
  email: string;

  @Column({ type: "varchar", length: 64 })
  @Length(4, 30)
  name: string;

  @Column({ default: false })
  confirmed: boolean;

  @OneToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role: Role;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
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

export { User, createUser, createAnonymousUser, can, isAdministrator };
