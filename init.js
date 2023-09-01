require("module-alias/register");
var express = require("express");
const app = express();
const server = require("@core/server");
const logger = require("@core/logger");
const global = require("./global");
require("dotenv").config();

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error) => {
    logger.error(error.message);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason) => {
    logger.error(error.message);
});

// Initialize database once

// Configures server connection
server.init(global).listen(global.port);
