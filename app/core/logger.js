const winston = require("winston");
const moment = require("moment");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        // catch all the errors
        new winston.transports.File({ dirname: "app/logs", filename: `error_${moment().format("YYYY-MM-DD")}.log`, level: "error" }),
        // If you want to get all the logs uncomment this line below, note that this good only for development
        // new winston.transports.File({ dirname: "app/logs", filename: `combined_${moment().format("YYYY-MM-DD")}.log` }),
    ],
});

if (process.env.MODE !== "PRODUCTION") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.cli({
                colorize: true,
                depth: 3,
            }),
            colorize: true,
            prettyPrint: true,
        })
    );
}

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green",
});

module.exports = logger;
