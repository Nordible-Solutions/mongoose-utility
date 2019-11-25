import { Collection, Schema, Model, Document, Connection } from 'mongoose';
const mongooseInstance = require("mongoose");

let existingConnection: Connection;
export const generateConnectionString = () => {
    const {
        MONGO_USER,
        MONGO_PASSWORD,
        MONGO_PATH,
    } = process.env;

    return `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
}

console.log(`mongoose-utility is working! \u00A9 nordible https://nordible.com`);

const copyright = `\n${process.env.npm_package_name} by \u00A9 nordible https://nordible.com/`;

/**
 * Connect to the MongoDB database
 * @param connection mongoose connection instance (pass if exists to reuse existing open connection)
 * @param enableLogging flag for enabling/disabling logging
 */
export const connectToTheDatabase = (connectionToReuse: Connection | null, enableLogging = false): Connection => {

    if (connectionToReuse && connectionToReuse.readyState === 1) {
        enableLogging && console.log(`Reusing existing Mongoose connection ${copyright}`);

        return connectionToReuse;
    }

    else {

        try {
            let connString = generateConnectionString();

            //connect to mongoose
            if (mongooseInstance.createConnection) {
                existingConnection = mongooseInstance.createConnection(connString, { useNewUrlParser: true, useCreateIndex: true })
            } else {
                existingConnection = mongooseInstance.connect(connString, { useNewUrlParser: true, useCreateIndex: true })
            }

            existingConnection.on('open', function () {
                enableLogging && console.log(`Mongoose default connection open ${copyright}`);
            })

            existingConnection.on('connected', function () {
                enableLogging && console.log(`Mongoose default connection connected ${copyright}`);
            })

            existingConnection.on('error', function (err: any) {
                console.log(`Mongoose default connection error: ${err} ${copyright}`);
            })

            existingConnection.on('disconnected', function () {
                console.log(`Mongoose default connection disconnected ${copyright}`);
            })
            process.on('SIGINT', function () {
                mongooseInstance.connection.close(function () {
                    console.log(`Mongoose default connection closed through app termination ${copyright}`);
                    process.exit(0);
                })
            });

        }
        catch (err) {
            if (enableLogging) {
                console.log(`An error occured while connecting to MongoDB
            Info: ${err} ${copyright}`)
            }
        }

        return existingConnection;
    }

}


/**
 * Get all the documents in a collection
 * @param mongooseInstance mongoose instance to connect to
 * @param collectionName name of the collection
 * @param enableLogging flag for enabling/disabling logging
 */
export const getAllDocs = (mongooseInstance: any, collectionName: string, enableLogging = false): Promise<any> => {
    return new Promise(() => {
        existingConnection = connectToTheDatabase(existingConnection, enableLogging); //TODO: access flag from node env

        existingConnection.collection(collectionName).find(function (err: any, docs: any) {
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
    mongooseInstance.connection.db.dropCollection(collectionName)
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
    mongooseInstance.connection.db.collection(collectionName).insertMany(docs, function () {
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
    let compiledModel: Model<Document, {}>;
    try {
        compiledModel = mongooseInstance.model(modelName, modelSchema);
        enableLogging && console.log(`${modelName} successfully compiled. ${copyright}`);
    }
    catch (err) {
        compiledModel = mongooseInstance.models[modelName];
        enableLogging && console.log(`An error occured while compiling model for ${modelName} 
        ${err} ${copyright}`);
    }

    return compiledModel;
}
