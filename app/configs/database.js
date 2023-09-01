module.exports = {
    // When you want to use database connection you must change this value to true
    enabled: true,
    // Database configuration
    // Suports multiple database
    credentials: {
        default: {
            // Database name
            database: "werkit_app",
            // Database host / ip address
            port: 8889,
            // Database username access
            user: "root",
            // Database password
            password: "root",
            charset: "utf8mb4",
        },
    },
};
