const { connection } = require("../connection/index")

const ExecuteQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) {
                console.log("error here", err.message)
                reject(err.message);
            }
            else {
                console.log("result", result);
                resolve(JSON.parse(JSON.stringify(result)));
            }
        });
    });
}

module.exports = { ExecuteQuery }