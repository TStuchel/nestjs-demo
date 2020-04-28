import { UserService } from "./user.service"
import { User } from "./user.entity"

describe('UserService', () => {
    const userService: UserService = new UserService()

    // --
    describe('Find user by username and password', () => {

        // --
        describe('Given a valid username and password', () => {

            it('should return the user', async () => {
                const user: User | undefined = await userService.findOne('admin', 'admin')
                expect(user?.userId).toBe(1)
            })
        })

        // --
        describe('Given a valid username and invalid password', () => {

            it('should return undefined', async () => {
                const user: User | undefined = await userService.findOne('admin', 'bad password')
                expect(user).toBeUndefined()
            })
        })

        // --
        describe('Given an invalid username and password', () => {

            it('should return undefined', async () => {
                const user: User | undefined = await userService.findOne('bad user', 'bad password')
                expect(user).toBeUndefined()
            })
        })
    })
})