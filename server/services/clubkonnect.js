const axios = require("axios");

const BASE_URL = "https://www.nellobytesystems.com";

const buyAirtime = async ({
    network,
    amount,
    phone,
    requestId,
}) => {
    const { data } = await axios.get(
        `${BASE_URL}/APIAirtimeV1.asp`,
        {
            params: {
                UserID: process.env.CLUBKONNECT_USER_ID,
                APIKey: process.env.CLUBKONNECT_API_KEY,
                MobileNetwork: network,
                Amount: amount,
                MobileNumber: phone,
                RequestID: requestId,
                CallBackURL: `${process.env.APP_URL}/api/webhook/clubkonnect`,
            },
        }
    );

    return data;
};

module.exports = { buyAirtime };