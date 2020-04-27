import { Injectable } from '@nestjs/common'
import { User, IUser } from './user.entity';
import * as bcrypt from 'bcryptjs'
import { CustomerPermission } from '../permissions/customer.permission';

/**
 * This service provides access to User information which is loaded when the user is first requests a
 * JWT token and is stored within that JWT token for further requests.
 */
@Injectable()
export class UserService {

    // TODO: These should be stored in a database, not hard-coded.
    private readonly users: User[] = [];

    // TODO: These should be stored in a database, not hard-coded.
    async initialize() {
        await this.createUser({
            userId: 1,
            username: 'admin',
            password: 'admin',
            permissions: [
                CustomerPermission.VIEW_CUSTOMER,
                CustomerPermission.CREATE_CUSTOMER
            ]
        }),
            await this.createUser({
                userId: 2,
                username: 'user',
                password: 'user',
                permissions: [
                    CustomerPermission.VIEW_CUSTOMER
                ]
            })
    }

    /**
     * Returns the User with the given username and password, or undefined if not found.
     */
    async findOne(username: string, password: string): Promise<User | undefined> {

        // TODO: Remove initialization in favor of reading DB
        if (this.users.length == 0) {
            await this.initialize()
        }

        // Find the user
        const user: User | undefined = this.users.find(user => user.username == username)
        if (!user) {
            return undefined
        }

        // Validate the password
        const isValid = await bcrypt.compare(password, user.password)
        return isValid ? user : undefined
    }

    /**
     * Create a user with the given information. The returned user's password is encrypted.
     */
    async createUser(user: IUser): Promise<User> {

        // Create the user
        const newUser: User = new User(user)

        // Encrypt its password
        newUser.password = await this.encryptPassword(user.password)

        // Done
        this.users.push(newUser) // TODO: Save to data store instead
        return newUser;
    }

    /**
     * Encrypt the given plain-text password prior to being stored. The encrypted password uses a
     * randomly generated salt value, and then is encrypted to a hash value using SHA256 encryption.
     */
    async encryptPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }
}       
