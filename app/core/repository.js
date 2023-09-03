const mysql = require("mysql2");
const logger = require("./logger");

class Repository {
    constructor(dbConn) {
        // Repository can access the global variable
        this.global = require("@global");
        // initialize the database connection
        this.databaseConnection = dbConn;
        this.database = { query: this.query, execute: this.execute, table: this.table };
        this.helper = require("@helper");
    }

    query = async (string, callback = null) => {
        if (process.env.USE_DATABASE == "true") {
            try {
                const conn = await this.databaseConnection;
                const [rows, fields] = await conn.execute(string);
                logger.info(`Database: Running query ${string.green}`);
                conn.release();
                return rows;
            } catch (e) {
                logger.error(e.message, "red");
                return false;
            }
        } else {
            logger.error("Database: No Database Specified in .env file, also make sure that USE_DATABASE is set to true");
            return false;
        }
    };

    execute = async (str, callback = null) => {
        if (process.env.USE_DATABASE == "true") {
            try {
                const conn = await this.databaseConnection;
                const [rows] = await conn.execute(str);
                logger.info(`Database: Running query ${str.green}`);
                conn.release();
                return rows;
            } catch (e) {
                log(e.message, "red");
                return false;
            }
        } else {
            logger.error("Database: No Database Specified in .env file, also make sure that USE_DATABASE is set to true");
            return false;
        }
    };

    table = (table) => {
        var queryString = "";
        return {
            row: (condition = null) => {
                queryString = `SELECT * FROM ${table} `;
                var cond = "";
                if (condition !== null) {
                    if (typeof condition == "object") {
                        Object.keys(condition).forEach((item) => {
                            var val = Array.isArray(condition[item]) ? condition[item][0] + " " + mysql.escape(condition[item][1]) : ` = '${condition[item]}' `;
                            if (cond == "") {
                                cond = ` WHERE ${item} ${val}`;
                            } else {
                                cond += ` AND ${item} ${val}`;
                            }
                        });
                        queryString += cond;
                    }
                }
                return {
                    exist: async () => {
                        var exec = await this.execute(queryString);
                        return exec.length > 0;
                    },
                    select: async (field = null) => {
                        var exec = await this.execute(queryString);
                        return exec.length > 0 ? (field == null ? exec[0] : exec[0][field]) : false;
                    },
                };
            },
            insert: (data) => {
                var col = [],
                    val = [];
                if (!Array.isArray(data)) {
                    Object.keys(data).forEach((item) => {
                        if (data[item] !== undefined) {
                            col.push(item);
                            if (data[item] == null) {
                                val.push(null);
                            } else if (typeof data[item] == "function") {
                                data[item]((str) => {
                                    val.push(mysql.escape(str));
                                });
                            } else if (typeof data[item] == "string") {
                                val.push(mysql.escape(data[item]));
                            } else {
                                val.push(mysql.escape(data[item]));
                            }
                        }
                    });
                    queryString = `INSERT INTO ${table} (${col.join(", ")}) VALUES (${val.join(", ")})`;
                    return {
                        execute: () => this.execute(queryString),
                    };
                } else {
                    data.map((row, rowIndex) => {
                        var rowData = [];
                        Object.keys(row).forEach((rowItem) => {
                            if (rowIndex == 0) {
                                col.push(rowItem);
                            }
                            if (row[rowItem] == null) {
                                rowData.push(null);
                            } else if (typeof row[rowItem] == "function") {
                                row[rowItem]((str) => {
                                    rowData.push(mysql.escape(str));
                                });
                            } else if (typeof row[rowItem] == "string") {
                                rowData.push(mysql.escape(row[rowItem]));
                            } else {
                                rowData.push(mysql.escape(row[rowItem]));
                            }
                        });
                        val.push("(" + rowData.join(", ") + ")");
                    });
                    queryString = `INSERT INTO ${table} (${col.join(", ")}) VALUES ${val.join(", ")}`;
                    return {
                        execute: () => this.execute(queryString),
                    };
                }
            },
            select: (fields) => {
                fields = typeof fields == "undefined" ? "*" : fields === "*" ? "*" : Array.isArray(fields) ? fields.join(", ") : fields;
                queryString = `SELECT ${Array.isArray(fields) ? fields.join(", ") : fields} FROM ${table}`;
                return {
                    query: (str) => {
                        queryString += ` ${str}`;
                        return {
                            execute: (callback) => this.execute(queryString, callback),
                        };
                    },
                    sort: (name, value = "") => {
                        queryString += ` ORDER BY ${name} ${value}`;
                        return {
                            execute: () => this.execute(queryString),
                            page: (pageNumber, limit = 10) => {
                                var pageLimitstart = pageNumber - 1;
                                var pageLimitEnd = pageLimitstart * limit;
                                queryString += ` LIMIT ${limit} OFFSET ${pageLimitEnd} `;
                                return {
                                    execute: () => this.execute(queryString),
                                };
                            },
                        };
                    },
                    execute: (callback) => this.execute(queryString, callback),
                    page: (pageNumber, limit = 10) => {
                        var pageLimitstart = pageNumber - 1;
                        var pageLimitEnd = pageLimitstart * limit;
                        queryString += ` LIMIT ${limit} OFFSET ${pageLimitEnd} `;
                        return {
                            execute: (callback) => this.execute(queryString, callback),
                        };
                    },
                    where: (condition) => {
                        var cond = "";
                        if (typeof condition == "object") {
                            Object.keys(condition).forEach((item) => {
                                var val = Array.isArray(condition[item]) ? condition[item][0] + " " + mysql.escape(condition[item][1]) : ` = '${condition[item]}' `;
                                if (cond == "") {
                                    cond = ` WHERE ${item} ${val}`;
                                } else {
                                    cond += ` AND ${item} ${val}`;
                                }
                            });
                            queryString += cond;
                        }
                        return {
                            sort: (name, value = "") => {
                                queryString += ` ORDER BY ${name} ${value}`;
                                return {
                                    execute: (callback) => this.execute(queryString, callback),
                                    page: (pageNumber, limit = 10) => {
                                        var pageLimitstart = pageNumber - 1;
                                        var pageLimitEnd = pageLimitstart * limit;
                                        queryString += ` LIMIT ${limit} OFFSET ${pageLimitEnd} `;
                                        return {
                                            execute: (callback) => this.execute(queryString, callback),
                                        };
                                    },
                                };
                            },
                            page: (pageNumber, limit = 10) => {
                                var pageLimitstart = pageNumber - 1;
                                var pageLimitEnd = pageLimitstart * limit;
                                queryString += ` LIMIT ${limit} OFFSET ${pageLimitEnd} `;
                                return {
                                    execute: (callback) => this.execute(queryString, callback),
                                };
                            },
                            execute: (callback) => this.execute(queryString, callback),
                        };
                    },
                };
            },
            update: (data) => {
                var updates = "";
                var conditions = "";
                Object.keys(data).forEach((item) => {
                    if (updates == "") {
                        updates = ` ${item} = ${mysql.escape(data[item])}`;
                    } else {
                        updates += ` , ${item} = ${mysql.escape(data[item])}`;
                    }
                });
                return {
                    execute: () => {
                        queryString = `UPDATE ${table} SET ${updates} ${conditions}`;
                        return this.execute(queryString);
                    },
                    where: (condition) => {
                        Object.keys(condition).forEach((item) => {
                            var val = Array.isArray(condition[item]) ? condition[item][0] + " " + mysql.escape(condition[item][1]) : ` = '${condition[item]}' `;
                            if (conditions == "") {
                                conditions = ` WHERE ${item} ${val}`;
                            } else {
                                conditions += ` AND ${item} ${val}`;
                            }
                        });
                        return {
                            execute: () => {
                                queryString = `UPDATE ${table} SET ${updates} ${conditions}`;
                                return this.execute(queryString);
                            },
                        };
                    },
                };
            },
            delete: () => {
                var conditions = "";
                return {
                    where: (condition) => {
                        Object.keys(condition).forEach((item) => {
                            var val = Array.isArray(condition[item]) ? condition[item][0] + " " + mysql.escape(condition[item][1]) : ` = '${condition[item]}' `;
                            if (conditions == "") {
                                conditions = ` WHERE ${item} ${val}`;
                            } else {
                                conditions += ` AND ${item} ${val}`;
                            }
                        });
                        return {
                            execute: () => {
                                queryString = `DELETE FROM ${table} ${conditions}`;
                                return this.execute(queryString);
                            },
                        };
                    },
                    execute: () => {
                        queryString = `DELETE FROM ${table}`;
                        return this.execute(queryString);
                    },
                };
            },
        };
    };
}

module.exports = Repository;
