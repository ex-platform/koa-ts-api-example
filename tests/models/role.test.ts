import { Permission } from "../../src/models/permission"
import { addPermission, hasPermission, removePermission, resetPermission, Role } from "../../src/models/role"

describe('Role', () => {
  test("basic role model", () => {
    const role = new Role()
    role.name = "User"
    role.default = false
    role.permissions = 0

    expect(role.name).toBe('User')
    expect(role.default).toBe(false)
    expect(role.permissions).toBe(0)
  })
  test("hasPermission", ()=> {
    const role = new Role()
    role.name = "User"
    role.default = false
    role.permissions = Permission.FOLLOW

    expect(hasPermission(role, Permission.FOLLOW)).toBe(true)
    expect(hasPermission(role, Permission.COMMENT)).toBe(false)
  })
  test("add and remove permissions", ()=> {
    let role = new Role()
    role.name = "User"
    role.default = false
    role.permissions = 0

    expect(hasPermission(role, Permission.FOLLOW)).toBe(false)
    expect(hasPermission(role, Permission.COMMENT)).toBe(false)
    
    role = addPermission(role, Permission.COMMENT)
    expect(hasPermission(role, Permission.FOLLOW)).toBe(false)
    expect(hasPermission(role, Permission.COMMENT)).toBe(true)

    role = addPermission(role, Permission.FOLLOW)
    expect(hasPermission(role, Permission.FOLLOW)).toBe(true)
    expect(hasPermission(role, Permission.COMMENT)).toBe(true)

    role = removePermission(role, Permission.FOLLOW)
    expect(hasPermission(role, Permission.FOLLOW)).toBe(false)
    expect(hasPermission(role, Permission.COMMENT)).toBe(true)
  })
  test("resetPermission", ()=> {
    let role = new Role()
    role.name = "User"
    role.default = false
    role.permissions = 0

    role = addPermission(role, Permission.COMMENT)
    role = addPermission(role, Permission.FOLLOW)
    expect(hasPermission(role, Permission.FOLLOW)).toBe(true)
    expect(hasPermission(role, Permission.COMMENT)).toBe(true)

    role = resetPermission(role)
    expect(hasPermission(role, Permission.FOLLOW)).toBe(false)
    expect(hasPermission(role, Permission.COMMENT)).toBe(false)
  })
})