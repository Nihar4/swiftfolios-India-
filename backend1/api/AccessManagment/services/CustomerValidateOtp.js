const { ExecuteQuery } = require("../../../utils/ExecuteQuery")

const CustomerValidateOtp = async (identifier, otp, table, idColumnName) => {
    return new Promise(async (resolve, reject) => {
        const checkQuery = `SELECT * FROM ${table} WHERE ${idColumnName} = ?`;
        const checkParams = [identifier];

        try {
            const data = await ExecuteQuery(checkQuery, checkParams);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { CustomerValidateOtp }
