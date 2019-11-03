import * as mongoose from 'mongoose';
import { Collection } from 'mongoose';
import { resolve } from 'url';

export const generateConnectionString = () => {
    const {
        MONGO_USER,
        MONGO_PASSWORD,
        MONGO_PATH,
    } = process.env;

    return `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
}

/**
 * Connect to the database
 */
export const connectToTheDatabase = (mongooseInstance: any) => {

    let connString = generateConnectionString();
    if (mongooseInstance.connection.readyState === 1) {
        console.log('Mongoose already connected');
    } else {
        mongooseInstance.connect(connString, { useNewUrlParser: true, useCreateIndex: true })

        mongooseInstance.connection.on('open', function () {
            console.log('Mongoose default connection open');
        })

        mongooseInstance.connection.on('connected', function () {
            console.log('Mongoose default connection connected')
        })

        mongooseInstance.connection.on('error', function (err: any) {
            console.log('Mongoose default connection error: ' + err)
        })

        mongooseInstance.connection.on('disconnected', function () {
            console.log('Mongoose default connection disconnected')
        })

        process.on('SIGINT', function () {
            mongooseInstance.connection.close(function () {
                console.log('Mongoose default connection closed through app termination')
                process.exit(0)
            })
        });
    }


    return mongooseInstance.connection;
}

/**
 * Get all the documents in a collection
 * @param collection instance of the collection
 */
export const getAllDocs = async (collection: Collection): Promise<any> => {
    await collection.find(function (ex: any, docs: any) {
        if (ex) throw ex;
        return docs;
    });
}

/**
 * Drops a collection by it's name
 * @param collection name of the collection
 */
export const dropCollection = (collection: string) => {
    mongoose.connections[0].dropCollection(collection)
        .then((dropResult: any) => dropResult)
        .catch((ex: any) => ex);
}

export const insertMany = (collection: Collection, docs: any) => {
    collection.insertMany(docs, function () {
    });
}
