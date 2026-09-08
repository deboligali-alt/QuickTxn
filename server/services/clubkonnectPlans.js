const axios = require("axios");

const BASE_URL = "https://www.nellobytesystems.com";

const getDataPlans = async (network) => {
    const { data } = await axios.get(
        `${BASE_URL}/APIDataBundlePlansV2.asp`,
        {
            params: {
                UserID: process.env.CLUBKONNECT_USER_ID,
                MobileNetwork: network,
            },
        }
    );

    return data;
};

module.exports = { getDataPlans };