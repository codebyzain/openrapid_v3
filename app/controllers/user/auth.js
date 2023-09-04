module.exports = class UserAuthController extends require("@controller") {
    // # Method: Optional, Default: GET if not defined
    // Define the endpoints method
    $method = "POST";

    // # Route: Optional, Default: autogeneration from filename
    // if the method variable is not defined filename will be its route by transforming "_" to "/"
    // So you can access this endpoint in /user/auth
    // otherwise if you  define the route varialbe like below :
    // $route = "/user/login";
    // you can access this controller via /user/login

    // or if you want to assign multiple route to this same controller like below
    // $route = ["/auth/login", "/login"];
    // to diffrentiates logic between path you can add $path to your main controller

    // # Middleware: Optional
    // Middleware could be define as string or array of string refering to your middleware path
    // all middlewares will be scanned thru from /app/middlewares
    // you can refer your middleware with short alias @mid/your_middleware_name.js
    $middleware = ["@mid/middleware_auth", "@mid/middleware_token"];

    // # Repository: Optional
    // a Repository is a string or arrray of string as path that refers to your repositories
    // repository itself is a class of functions that handles your logic more often handling database or any source of data
    // repository will get injected to the route when server started, its not injected when user hit the endpoint
    $repository = ["@repo/repository_feed"];

    // # Schema: Optional
    // Define the accepted scheme for this controller body request
    $body = {
        // this.should = reference to the validator using 'yup' schema validator
        // the second parameter has to be the type of data
        // For more schema read yup documentation
        // uncomment below to active schema validation
        // email: this.should.string().email().required(),
        // age: this.should.number().min(1).required(),
    };
    // You can also define a schema for the query request by adding:
    // $query = { id: this.should.number().required() };

    // Main: Required
    // This is the main entry of your endpoint
    // you can get data from the function paramaters such as :
    // $send(response) -> to send json response to client with fixed status of 200
    // $send_with_status(status, ressponse) -> to send json response to client with status
    // $repository(dot)your repository classname -> to get data from your repository
    // $data -> to get various data send by client request
    // $requestError -> to get errors caused by the $body or $query schema
    async $main({ $send, $data, $send_with_status, $repository, $requestError, $path }) {
        // to access helper register in the app/helpers folder
        // console.log(this.helper.binarySearch([30, 3, 1, 2, 5, 32, 44], 5));
        // To check if theres a schema error
        if ($requestError.length > 0) {
            // Send error with status
            $send_with_status(400, $requestError);
            return;
        }
        // Send data back to the client
        $send({
            status: true,
            request: $data.body,
            data: $repository.FeedRepository.getFeeds(),
        });
    }
};
