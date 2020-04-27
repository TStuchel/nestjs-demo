import { ForbiddenException } from "@nestjs/common"

export interface IUser {
    userId: number,
    username: string,
    password: string,
    permissions: any[]
}

export class User implements IUser {

    userId: number
    username: string
    password: string
    permissions: any[]

    constructor(user: IUser) {
        this.userId = user.userId
        this.username = user.username
        this.password = user.password
        this.permissions = user.permissions
    }

    /**
     * Throws a ForbiddenException with the given message if the user does not have all of the
     * specified permissions.
     */
    checkHasPermissions(permissions: any[], message: string) {
        if (!permissions.every(p => this.permissions.includes(p))) {
            throw new ForbiddenException(message)
        }
    }
}