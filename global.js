module.exports = {
    path: __dirname,
    port: 8901,
    public_url: "http://192.168.1.4:8001/f",
    sub_event_url: "http://192.168.1.4:3301",
    prefix: {
        middleware: "middleware_",
        controller: "controller_",
        model: "model_",
    },
    headers: {
        "X-Powered-By": "openrapid-js",
    },
    query: {
        getDataLimit: 7,
    },
    response: {
        status: true,
        code: true,
        message: true,
        data: true,
    },
    debugger: {
        log: {
            save: false,
        },
    },
    point: {
        default: 100,
    },
    responses: {},
};
