import * as mongoose from 'mongoose';
import { Collection } from 'mongoose';

export const generateConnectionString = () => {
    const {
        MONGO_USER,
        MONGO_PASSWORD,
        MONGO_PATH,
    } = process.env;

    return `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
}

const copyright = "\mogodb-utility by \u00A9 nordible https://nordible.com/";

/**
 * Connect to the MongoDB database
 * @param mongooseInstance mongoose instance to connect to
 * @param enableLogging flag for enabling/disabling logging
 */
export const connectToTheDatabase = (mongooseInstance: any, enableLogging = false) => {

    let connString = generateConnectionString();
    if (mongooseInstance.connection.readyState === 1) {
        enableLogging && console.log(`Mongoose already connected ${copyright}`);
    } else {
        mongooseInstance.connect(connString, { useNewUrlParser: true, useCreateIndex: true })

        mongooseInstance.connection.on('open', function () {
            enableLogging && console.log(`Mongoose default connection open ${copyright}`);
        })

        mongooseInstance.connection.on('connected', function () {
            enableLogging && console.log(`Mongoose default connection connected ${copyright}`);
        })

        mongooseInstance.connection.on('error', function (err: any) {
            enableLogging && console.log(`Mongoose default connection error: ${err} ${copyright}`);
        })

        mongooseInstance.connection.on('disconnected', function () {
            enableLogging && console.log(`Mongoose default connection disconnected ${copyright}`);
        })

        process.on('SIGINT', function () {
            mongooseInstance.connection.close(function () {
                enableLogging && console.log(`Mongoose default connection closed through app termination ${copyright}`);
                process.exit(0);
            })
        });
    }

    return mongooseInstance.connection;
}

/**
 * Get all the documents in a collection
 * @param collection instance of the collection
 * @param enableLogging flag for enabling/disabling logging
 */
export const getAllDocs = (collection: Collection, enableLogging = false) => {
    collection.find(function (err: any, docs: any) {
        if (err) {
            enableLogging && console.log(`An error occured while getting all document from collection ${collection} 
            Error stack: ${err} ${copyright}`);
            return null;
        }
        enableLogging && console.log(`Documents fetched from ${collection} are ${docs} ${copyright}`);
        return docs;
    });
}

/**
 * Drops a collection by it's name
 * @param collection name of the collection
 * @param enableLogging flag for enabling/disabling logging
 */
export const dropCollection = (collection: string, enableLogging = false) => {
    mongoose.connections[0].dropCollection(collection)
        .then((dropResult: any) => {
            enableLogging && console.log(`${collection} successfully dropped. Info: ${dropResult} ${copyright}`);
            return true;
        })
        .catch((err: any) => {
            enableLogging && console.log(`An error occured while dropping collection ${collection} 
            Error stack: ${err} ${copyright}`);
            return false;
        });
}

/**
 * Insert many documents to MongoDb instance
 * @param collection The name of the collection
 * @param docs The documents which needs to be inserted
 * @param enableLogging flag for enabling/disabling logging
 */
export const insertMany = (collection: Collection, docs: any, enableLogging = false) => {
    collection.insertMany(docs, function () {
    });
}
