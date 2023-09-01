require("path");
const compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const global = require("@/global");
const bodyParserConfig = require("@config/body_parser");
const coreRouter = require("@core/router");
const database = require("@core/database/mysql");
const logger = require("./logger");

module.exports.init = (params) => {
    logger.info(`Initiating server listening to port ${params.port}`);
    // Initiate the express
    const app = express();
    // Uses compress for each request
    app.use(compression());
    // adding Helmet to enhance your API's security
    app.use(helmet());
    // Use the JSON body parser
    app.use(bodyParser.json(bodyParserConfig));
    // enabling CORS for all requests
    app.use(cors());
    // adding morgan to log HTTP requests
    app.use(morgan("combined"));
    // Use parsing application/xwww-form-urlencoded
    app.use(bodyParser.urlencoded(bodyParserConfig));
    // Use Form-Data Parser
    app.use(upload.any());
    // Use Express.Js router
    app.use("/", router);
    // Initialized routers
    logger.info(`Initiating routes`);
    coreRouter.init(router);
    // Server successfully configured
    return app;
};
