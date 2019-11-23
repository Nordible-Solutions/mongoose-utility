Utility functions for MongoDB Atlas with Node.js Typescript setup

## Installation
 
 - Install in your project using `npm i mongodb-utility`

## Available functions / API

Environment variables `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_PATH` are needed to use this utility.

**connectToTheDatabase()**
Connect to the MongoDB database
- *@param* `mongooseInstance` mongoose instance to connect to
- *@param* `enableLogging` flag for enabling/disabling logging

**getAllDocs()**
Get all the documents in a collection
- *@param* `collection` instance of the collection
- *@param* `enableLogging` flag for enabling/disabling logging

**dropCollection()**
Drops a collection by it's name
- *@param* `collection` name of the collection
- *@param* `enableLogging` flag for enabling/disabling logging

**insertMany()**
Insert many documents to MongoDb instance
- *@param* `collection` The name of the collection
- *@param* `docs` The documents which needs to be inserted
- *@param* `enableLogging` flag for enabling/disabling logging

**getCompiledModel()**
Gives the model of the specific schema with the specified name
- *@param* `modelName` The name of the model (generally same as the name of the resultant collection)
- *@param* `modelSchema` The schema of the model
- *@param* `enableLogging` flag for enabling/disabling logging

## Contributions welcome!

[Open a new PR](https://github.com/nordible/mongodb-utility/pulls) here on GitHub.

## Run locally
- Run `git clone https://github.com/nordible/mongodb-utility.git` this project
- Run `cd mongodb-utility/` to this project
- Run `npm run dev` to start the project on local machine

## Bugs and Issues

Have a bug or an issue? [Open a new issue](https://github.com/nordible/mongodb-utility/issues) here on GitHub.

## License

Code licensed under [MIT](https://opensource.org/licenses/MIT). Everything else is [CC](http://creativecommons.org/)

## Follow us

* [twitter.com/nordiblehq](https://twitter.com/nordiblehq)
* [fb.com/nordible](https://www.facebook.com/nordible)

&copy; [nordible](https://nordible.com/)
