const { ExecuteQuery } = require("../../../utils/ExecuteQuery");

const InsertUserData = (userData) => {
    return new Promise(async (resolve, reject) => {
        const {
            primaryname,
            pan,
            primaryemail,
            mobile,
            pan_image,
            status = "Pending",
        } = userData;

        const query = `
            INSERT INTO user_accounts (
                primaryname,
                pan,
                primaryemail,
                mobile,
                pan_image,
                status,
                input_timestamp
            ) VALUES (?, ?, ?, ?, ?, ?,  CONVERT_TZ(NOW(), '+00:00', '+05:30'))
        `;

        const params = [
            primaryname,
            pan,
            primaryemail,
            mobile,
            pan_image,
            status,
        ];
        try {
            await ExecuteQuery(query, params);
            resolve('User data inserted successfully.');
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { InsertUserData };
