import { Permission } from "../../src/models/permission"
import { getRole } from "../../src/models/role"
import { can, createAnonymousUser, createUser, User } from "../../src/models/user"

describe('User', () => {
  test("basic user model", () => {
    const user = new User()
    user.name = 'Aaron So'
    user.email = "aaron.so@test.com"
    user.confirmed = false
  
    expect(user.name).toBe('Aaron So')
    expect(user.email).toBe('aaron.so@test.com')
    expect(user.confirmed).toBe(false)
  })
  test("User role", () => {
    const role = getRole('User')
    const user = createUser("aaron.so@test.com", "Aaron So", role)

    expect(can(user, Permission.FOLLOW)).toBe(true)
    expect(can(user, Permission.COMMENT)).toBe(true)
    expect(can(user, Permission.WRITE)).toBe(true)
    expect(can(user, Permission.MODERATE)).toBe(false)
    expect(can(user, Permission.ADMIN)).toBe(false)
  })
  test("Moderator role", () => {
    const role = getRole('Moderator')
    const user = createUser("aaron.so@test.com", "Aaron So", role)

    expect(can(user, Permission.FOLLOW)).toBe(true)
    expect(can(user, Permission.COMMENT)).toBe(true)
    expect(can(user, Permission.WRITE)).toBe(true)
    expect(can(user, Permission.MODERATE)).toBe(true)
    expect(can(user, Permission.ADMIN)).toBe(false)
  })
  test("Administrator role", () => {
    const role = getRole('Administrator')
    const user = createUser("aaron.so@test.com", "Aaron So", role)

    expect(can(user, Permission.FOLLOW)).toBe(true)
    expect(can(user, Permission.COMMENT)).toBe(true)
    expect(can(user, Permission.WRITE)).toBe(true)
    expect(can(user, Permission.MODERATE)).toBe(true)
    expect(can(user, Permission.ADMIN)).toBe(true)
  })
  test("AnonymousUser role", () => {
    const user = createAnonymousUser()

    expect(can(user, Permission.FOLLOW)).toBe(false)
    expect(can(user, Permission.COMMENT)).toBe(false)
    expect(can(user, Permission.WRITE)).toBe(false)
    expect(can(user, Permission.MODERATE)).toBe(false)
    expect(can(user, Permission.ADMIN)).toBe(false)
  })
})