// Class should only export a single function
const AuthMiddleware = ({ $next }) => {
    // Optionally you can send data to the controller by passing object in the function
    // which you can get later in the main ctonroller from $data.middleware
    $next({
        user_id: "HelloWorld",
    });
};
module.exports = AuthMiddleware;
