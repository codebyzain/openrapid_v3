require("module-alias/register");
require("./global");
const server = require("@core/server");
const logger = require("@core/logger");
const databaseConnection = require("./app/core/database/mysql");
require("dotenv").config();
// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error) => logger.error(error.stack));
// Catch unhandling rejected promises
process.on("unhandledRejection", (reason) => logger.error(reason.stack));
// Initialize database once
const database = process.env.USE_DATABASE == "true" ? databaseConnection.init() : null;
// Configures server connection
server.init(global.port, database).listen(global.port);
