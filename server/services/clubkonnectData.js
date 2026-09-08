const axios = require("axios");

const BASE_URL = "https://www.nellobytesystems.com";

const buyData = async ({
    network,
    dataPlan,
    phone,
    requestId,
}) => {
    const { data } = await axios.get(
        `${BASE_URL}/APIDataBundleV1.asp`,
        {
            params: {
                UserID: process.env.CLUBKONNECT_USER_ID,
                APIKey: process.env.CLUBKONNECT_API_KEY,
                MobileNetwork: network,
                DataPlan: dataPlan,
                MobileNumber: phone,
                RequestID: requestId,
                CallBackURL: `${process.env.APP_URL}/api/webhook/clubkonnect`,
            },
        }
    );

    return data;
};

module.exports = { buyData };