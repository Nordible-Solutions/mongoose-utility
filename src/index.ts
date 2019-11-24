import { Collection, Schema, Model } from 'mongoose';
import * as mongoose from 'mongoose';

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
    if (mongooseInstance.connection && mongooseInstance.connection.readyState === 1) {
        enableLogging && console.log(`Mongoose already connected ${copyright}`);
    } else {
        mongooseInstance.createConnection(connString, { useNewUrlParser: true, useCreateIndex: true })

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
 * @param mongooseInstance mongoose instance to connect to
 * @param collectionName name of the collection
 * @param enableLogging flag for enabling/disabling logging
 */
export const getAllDocs = (mongooseInstance: any, collectionName: string, enableLogging = false): Promise<any> => {
    return new Promise(() => {
        mongooseInstance.collection(collectionName).find(function (err: any, docs: any) {
            if (err) {
                enableLogging && console.log(`An error occured while getting all document from collection ${collectionName} 
                ${err} ${copyright}`);
                return null;
            }
            enableLogging && console.log(`Documents fetched from ${collectionName} are ${docs} ${copyright}`);
            return docs;
        });

    });
}

/**
 * Drops a collection by it's name
 * @param collectionName name of the collection
 * @param enableLogging flag for enabling/disabling logging
 */
export const dropcollection = (collectionName: string, enableLogging = false) => {
    mongoose.connection.db.dropCollection(collectionName)
        .then((dropResult: any) => {
            enableLogging && console.log(`${collectionName} successfully dropped. Info: ${dropResult} ${copyright}`);
            return true;
        })
        .catch((err: any) => {
            enableLogging && console.log(`An error occured while dropping collection ${collectionName} 
            ${err} ${copyright}`);
            return false;
        });
}

/**
 * Insert many documents to MongoDb instance
 * @param collectionName Name of the collection
 * @param docs The documents which needs to be inserted
 * @param enableLogging flag for enabling/disabling logging
 */
export const insertMany = (collectionName: string, docs: any, enableLogging = false) => {
    mongoose.connection.db.collection(collectionName).insertMany(docs, function () {
    });
}

/**
 * Gives the model of the specific schema with the specified name
 * @param modelName The name of the model (generally same as the name of the resultant collection)
 * @param schemaJSON The schema of the model
 * @param enableLogging flag for enabling/disabling logging
 */
export const getCompiledModel = (modelName: string, schemaJSON: Object, enableLogging = false) => {
    let modelSchema = new Schema({ schemaJSON });
    let compiledModel: Model<mongoose.Document, {}>;
    try {
        compiledModel = mongoose.model(modelName, modelSchema);
        enableLogging && console.log(`${modelName} successfully compiled. ${copyright}`);
    }
    catch (err) {
        compiledModel = mongoose.models[modelName];
        enableLogging && console.log(`An error occured while compiling model for ${modelName} 
        ${err} ${copyright}`);
    }

    return compiledModel;
}
