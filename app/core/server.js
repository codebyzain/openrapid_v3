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
const logger = require("./logger");
const { morganConfig } = require("@core/config");

module.exports.init = (port, databaseConnection) => {
    logger.info(`Server: Initializing server port ${port}`);
    // Initiate the express
    const app = express();
    // adding morgan to log HTTP requests
    app.use(morgan(morganConfig));
    // Uses compress for each request
    app.use(compression());
    // adding Helmet to enhance your API's security
    app.use(helmet());
    // Use the JSON body parser
    app.use(bodyParser.json(bodyParserConfig));
    // Use parsing application/xwww-form-urlencoded
    app.use(bodyParser.urlencoded(bodyParserConfig));
    // Use Form-Data Parser
    app.use(upload.any());
    // enabling CORS for all requests
    app.use(cors());
    // Use Express.Js router
    app.use("/", router);
    // Initialized routers
    logger.info(`Route: Initiating routes`);
    coreRouter.init(router, databaseConnection);
    // Server successfully configured
    return app;
};
