const path = require("path");
const { globSync } = require("glob");
const logger = require("./logger");
const yup = require("yup");
const controllerDir = "app/controllers/**";
require("colors");

// Runs the controller fire
const runController = async (cClass, repositories, req, res) => {
    var schemaValidationError = [];
    if (cClass.$body !== undefined) {
        const validate = await yup
            .object(cClass.$body)
            .validate(req.body, {
                abortEarly: false,
            })
            .catch((err) => {
                return err;
            });
        if (validate.inner != undefined) {
            for (err of validate.inner) {
                schemaValidationError.push({
                    field: err.path,
                    message: err.toString().replace("ValidationError: ", ""),
                });
            }
        }
    }
    if (cClass.$query !== undefined) {
        const validateQuery = await yup
            .object(cClass.$query)
            .validate(req.query, {
                abortEarly: false,
            })
            .catch((err) => {
                return err;
            });
        if (validateQuery.inner != undefined) {
            for (err of validateQuery.inner) {
                schemaValidationError.push({
                    field: err.path,
                    message: err.toString().replace("ValidationError: ", ""),
                });
            }
        }
    }
    const args = produceClassArguments(repositories, req, res);
    cClass.$main({ ...args, $requestError: schemaValidationError });
};

// Generate route name automatically
var generateAutoRouteName = (controllerPath) => {
    var routeName = controllerPath.replace("app/controllers", "").replace("/index", "").replace(".js", "").replace(/\_/g, "/");
    return routeName;
};

// Produces class arguments for a class wethers its a controller, repository or middleware
var produceClassArguments = (repositories, req, res, next = null) => {
    // Preparing arguments for the controllers
    var classArguments = {
        $request: req,
        $response: res,
        $path: req.path,
        $send: (responseData) => res.json(responseData),
        $send_with_status: (status, responseData) => res.status(status).json(responseData),
        $send_and_log: (responseData) => {
            // Turn on logging in production
            if (process.env.MODE !== "PRODUCTION") {
                console.debug(responseData);
            }
            res.json(responseData);
        },
        $data: {
            query: req.params,
            query: req.query,
            body: req.body,
            params: req.params,
            middleware: res.locals.data,
            files: req.files,
            headers: req.headers,
        },
        $repository: repositories,
        $next: (data) => {
            if (data !== undefined) {
                res.locals.data = { ...res.locals.data, ...data };
            }
            // Procceds to the next middleware
            next();
        },
    };
    return classArguments;
};

// initiates the server routes
const Router = async (xRouter, xDatabaseConnection) => {
    // Store are repositories used in the controller
    var repositories = {};
    // Registers all available controllers
    const controllerFiles = globSync(controllerDir, { nodir: true, matchBase: true });
    // Loop through eacg controllers files
    for (const controllerPath of controllerFiles) {
        // Register each controller
        if (path.extname(controllerPath) === ".js") {
            // Importing the controller class
            // and creates new instance of class
            const cClass = require("../../" + controllerPath);
            const runClass = new cClass();
            const runClassRoute = runClass.$route ?? generateAutoRouteName(controllerPath);
            const classRepositories = typeof runClass.$repository == "string" ? runClass.$repository.split() : runClass.$repository;
            const classMiddlewares = typeof runClass.$middleware == "string" ? runClass.$middleware.split() : runClass.$middleware;
            var runClassMethod = runClass.$method ?? "get";
            runClassMethod = runClassMethod.toLowerCase();

            // Detecting dependencies from the controller
            // This should loop through $repository path in the controller
            if (runClass.$repository !== undefined) {
                for (var repositoryPath of classRepositories) {
                    try {
                        if (classRepositories.length > 0) {
                            logger.info(`Route: Executing Dependency Injection (${classRepositories})`);
                        }
                        const callRepo = require(repositoryPath);
                        const classRepo = new callRepo(xDatabaseConnection);
                        const classRepoName = classRepo.$name !== undefined ? classRepo.$name : classRepo.constructor.name;
                        if (repositories[classRepoName] === undefined) {
                            Object.assign(repositories, {
                                [classRepoName]: classRepo,
                            });
                        }
                    } catch (e) {
                        logger.error(`Route: Failed injecting dependency ${repositoryPath}`);
                        logger.error(e);
                    }
                }
            }

            // Running middleware
            // Loops through each middleware (if found) in the controllers $middleware variable
            if (classMiddlewares !== undefined && classMiddlewares.length > 0) {
                for (var midWare of classMiddlewares) {
                    const midClass = new require(midWare);
                    xRouter[runClassMethod](runClassRoute, (req, res, next) => midClass(produceClassArguments(repositories, req, res, next)));
                }
            }

            // registering all available routes in ./app/controllers automatically
            // if Middleware defined for each spesific controller will run first before
            // moving on to the next middleware or the controller
            // the dependencies should also be injected to the route
            xRouter[runClassMethod](runClassRoute, (req, res) => runController(runClass, repositories, req, res));
            logger.info(`Route: ${runClassRoute.green} ${runClassMethod.toUpperCase().green} registered from ${controllerPath.green}`);
        } else {
            logger.warn(`Route: ${controllerPath.yellow} was not registered due to invalid type`);
        }
    }
};

module.exports.init = Router;
