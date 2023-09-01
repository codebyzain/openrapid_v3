const { globSync } = require("glob");
const logger = require("./logger");
const controllerDir = "app/controllers/**";

// initiates the server routes
const Router = async (xRouter) => {
    console.log(xRouter);
    // Registers all available controllers
    const controllerFiles = globSync(controllerDir, { nodir: true, matchBase: true });
    //  All the scanned files
    logger.info(controllerFiles);
    // Loop through eacg controllers files
    for (const controllerPath of controllerFiles) {
        xRouter.get("/auth/login", (req, res) => {
            console.log(req);
        });
    }
};

module.exports.init = Router;
