import axios from "axios";

const ServerRequest = async ({
    method = "get",
    URL,
    data,
    headers = {}
}) => {
    const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
    let url = REQUEST_BASE_URL + URL
    // console.log(url, data)
    // console.log(data)
    try {
        const result = await axios({
            method,
            url,
            data,
            headers
        });
        // console.log("result in fron", result)
        return result.data;
    } catch (error) {
        // console.log("error", error)
        return {
            server_error: true,
            message: error.response.data.message || error.message
        };
    }
};

export default ServerRequest;
