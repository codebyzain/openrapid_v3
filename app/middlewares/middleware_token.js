// Class should only export a single function
const TokenMiddleware = ({ $send, $next }) => {
    $next();
};

module.exports = TokenMiddleware;
