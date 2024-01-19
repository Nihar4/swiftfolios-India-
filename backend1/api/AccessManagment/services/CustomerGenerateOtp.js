const { ExecuteQuery } = require("../../../utils/ExecuteQuery")

const CustomerGenerateOtp = async (identifier, otp, table, idColumnName, idColumnName2) => {
    return new Promise(async (resolve, reject) => {
        const checkQuery = `SELECT * FROM ${table} WHERE ${idColumnName} = ?`;
        const checkParams = [identifier];

        try {
            const existingData = await ExecuteQuery(checkQuery, checkParams);

            if (existingData.length > 0) {
                // Identifier exists, update the OTP
                const updateOtpQuery = `UPDATE ${table} SET ${idColumnName2} = ? WHERE ${idColumnName} = ?`;
                const updateOtpParams = [otp, identifier];
                await ExecuteQuery(updateOtpQuery, updateOtpParams);
                resolve('OTP updated successfully.');
            } else {
                // Identifier doesn't exist, insert a new record
                const insertOtpQuery = `INSERT INTO ${table} (${idColumnName}, ${idColumnName2}) VALUES (?, ?)`;
                const insertOtpParams = [identifier, otp];
                await ExecuteQuery(insertOtpQuery, insertOtpParams);
                resolve('OTP inserted successfully.');
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = { CustomerGenerateOtp }
