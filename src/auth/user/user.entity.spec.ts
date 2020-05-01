import { User } from "./user.entity"
import { ForbiddenException } from "@nestjs/common"
import { randomString } from "../../common/test.utils"

describe('User Entity', () => {

    // Test user
    const newUserId = 12345
    const newUsername: string = randomString()
    const newPassword: string = randomString()
    const newPermissions: string[] = [randomString(), randomString()]
    const newUser: User = new User({
        userId: newUserId,
        username: newUsername,
        password: newPassword,
        permissions: newPermissions
    })
    const message: string = randomString()

    // --
    describe('Create a user', () => {

        // --
        describe('Given values for all properties of a user', () => {

            it("should set all of the user's properties", () => {
                expect(newUser.userId).toBe(newUserId)
                expect(newUser.username).toBe(newUsername)
                expect(newUser.password).toBe(newPassword)
                expect(newUser.permissions).toBe(newPermissions)
            })
        })
    })

    // --
    describe("Check a user's permissions", () => {

        // --
        describe('Given a user with all of the requisite permissions', () => {

            it('should accept that the user has the permission', () => {
                newUser.checkHasPermissions([newUser.permissions[0]], message)
                // No ForbiddenException
            })

        })

        // --
        describe('Given a user without all of the requisite permissions', () => {

            it('should throw a security exception', () => {
                try {
                    newUser.checkHasPermissions([randomString()], message)
                    fail('Should have thrown a ForbiddenException')
                }
                catch (error) {
                    expect(error).toBeInstanceOf(ForbiddenException)
                    expect(error.message).toBe(message)
                }
            })

        })
    })
})