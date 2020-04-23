import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

/**
 * DEVELOPER NOTE: This is the third and "deepest" layer of the application architecture. This layer is sometimes called
 * the "data access layer" (and repositories called "Data Access Objects" or DAO objects). This layer shouldn't have ANY
 * business logic in it at all. The only responsibility of this layer is to either interface with a database to
 * retrieve and manipulate data, or to interact with an external web service. The service layer of this application
 * doesn't know or care where the repository got its data, or how it got it. It should also be "dumb" and just do its
 * job of putting and pulling data from the external source, not making business or quality decisions about the data.
 * <p>
 * This application uses Mongoose, which is an object-mapping library used to interface with MongoDB. The CustomerSchema
 * is registered as an import in the CustomerModule. Technically, the the Mongoose framework itself is serving as the 
 * actual repository layer.
 */

/**
 * DEVELOPER'S NOTE: This interface includes all fields of the Customer business entity.
 */
export interface ICustomer {
    customerId: string;
    streetAddress: string;
    fullName: string;
}

/**
 * DEVELOPER'S NOTE: This interface extends the Mongoose Document interface to enable the object-database
 * mapping between the Customer entity and the MongoDB database. Since the Mongoose CustomerModel and
 * the Customer entity share the same interface, they are interchangable when referencing them in the
 * app layer service classes.
 */
export interface CustomerModel extends Document, ICustomer {
}

/**
 * DEVELOPER'S NOTE: This schema is used by Mongoose to define the properties and data types stored in
 * MongoDB.
 */
export const CustomerSchema = new mongoose.Schema({
    streetAddress: String,
    fullName: String
})
