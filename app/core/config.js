const logger = require("./logger");

function morganConfig(tokens, req, res) {
    try {
        return [
            `${"info".cyan}:    Route:`,
            tokens["remote-addr"](req, res).bgGray,
            "Accessed",
            tokens.url(req, res).green,
            tokens.method(req, res).yellow,
            tokens.status(req, res).cyan,
            "- Time:",
            tokens["response-time"](req, res).bgMagenta + "ms".bgMagenta,
            "\n-----",
        ].join(" ");
    } catch (e) {
        logger.error("Logger: ", e.toString());
    }
}
module.exports = {
    morganConfig,
};
