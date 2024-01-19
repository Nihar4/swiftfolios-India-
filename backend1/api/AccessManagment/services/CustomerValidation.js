const { ExecuteQuery } = require("../../../utils/ExecuteQuery")

const CustomerValidation = (identifier, idColumnName) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM user_accounts WHERE ${idColumnName} = ?`;
        const params = [identifier];
        try {
            const data = await ExecuteQuery(query, params);
            console.log(data)
            resolve(data);
        } catch (error) {
            reject(error)
        }
    });
}

module.exports = { CustomerValidation }