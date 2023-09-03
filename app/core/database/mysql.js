const mysql = require("mysql2");
const logger = require("../logger");
require("colors");

function createPool() {
    try {
        const pool = mysql.createPool({
            database: process.env.DATABSE_NAME,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PWD,
            charset: process.env.DATABASE_CHARSET,
            connectionLimit: 1,
            waitForConnections: true,
            queueLimit: 0,
        });
        const promisePool = pool.promise();
        return promisePool;
    } catch (error) {
        console.log(`Could not connect - ${error}`);
        return false;
    }
}

module.exports.init = () => {
    const pool = createPool();
    try {
        var getPoolConnection = pool.getConnection();
        logger.info(`Database: set to ${process.env.DATABSE_NAME.cyan}`);
        return getPoolConnection;
    } catch (e) {
        logger.error("Database: connection failed".red);
    }
};
