const winston = require("winston");
const moment = require("moment");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ dirname: "app/logs", filename: `error_${moment().format("YYYY-MM-DD")}.log`, level: "error" }),
        new winston.transports.File({ dirname: "app/logs", filename: `combined_${moment().format("YYYY-MM-DD")}.log` }),
    ],
});

//
if (process.env.MODE !== "PRODUCTION") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.combine(
                    winston.format.prettyPrint({
                        colorize: true,
                        depth: 10,
                    }),
                    winston.format.colorize()
                ),
                winston.format.colorize()
            ),
            colorize: true,
            timestamp: function () {
                return new Date().toLocaleTimeString();
            },
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
