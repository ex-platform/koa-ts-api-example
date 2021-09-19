import { Length } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission";
import { User } from "./user";

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  @Length(4, 32)
  name: string;

  @Column({ default: false })
  default: boolean;

  @Column({ default: 0 })
  permissions: number;

  @OneToOne(() => User, (user) => user.role)
  user: User;
}

const roles = {
  User: [Permission.FOLLOW, Permission.COMMENT, Permission.WRITE],
  Moderator: [
    Permission.FOLLOW,
    Permission.COMMENT,
    Permission.WRITE,
    Permission.MODERATE,
  ],
  Administrator: [
    Permission.FOLLOW,
    Permission.COMMENT,
    Permission.WRITE,
    Permission.MODERATE,
    Permission.ADMIN,
  ],
};
const defaultRole = "User";

function getRole(
  role: "AnonymousUser" | "User" | "Moderator" | "Administrator"
) {
  let r = new Role();
  r.name = role;
  r.default = role === defaultRole;
  r.permissions = 0;

  if (role != "AnonymousUser") {
    for (const perm of roles[role]) {
      r = addPermission(r, perm);
    }
  }
  return r;
}

function addPermission(role: Role, perm: number) {
  if (!hasPermission(role, perm)) {
    role.permissions += perm;
  }
  return role;
}

function removePermission(role: Role, perm: number) {
  if (hasPermission(role, perm)) {
    role.permissions -= perm;
  }
  return role;
}

function resetPermission(role: Role) {
  role.permissions = 0;
  return role;
}

function hasPermission(role: Role, perm: number) {
  return (role.permissions & perm) === perm;
}

export {
  Role,
  getRole,
  addPermission,
  removePermission,
  resetPermission,
  hasPermission,
};
