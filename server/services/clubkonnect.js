const axios = require("axios");

const BASE_URL = "https://www.nellobytesystems.com";

/**
 * Purchase Airtime
 */
const buyAirtime = async ({
    network,
    amount,
    phone,
    requestId,
}) => {
    try {
        const { data } = await axios.get(
            `${BASE_URL}/APIAirtimeV1.asp`,
            {
                params: {
                    UserID: process.env.CLUBKONNECT_USER_ID,
                    APIKey: process.env.CLUBKONNECT_API_KEY,
                    MobileNetwork: network,
                    Amount: Number(amount),
                    MobileNumber: phone,
                    RequestID: requestId,
                    CallBackURL: `${process.env.BACKEND_URL}/api/webhook/clubkonnect`,
                },
                timeout: 30000,
            }
        );

        console.log("========== AIRTIME RESPONSE ==========");
        console.log(JSON.stringify(data, null, 2));
        console.log("=====================================");

        // Success response from provider
        if (
            data.status === "ORDER_RECEIVED" ||
            data.statuscode === "100"
        ) {
            return {
                success: true,
                provider: "Nellobyte",
                ...data,
            };
        }

        return {
            success: false,
            provider: "Nellobyte",
            message:
                data.status ||
                data.message ||
                "Airtime purchase failed.",
            ...data,
        };

    } catch (error) {
        console.error("AIRTIME ERROR:");
        console.error(error.response?.data || error.message);

        return {
            success: false,
            provider: "Nellobyte",
            message:
                error.response?.data?.message ||
                error.message ||
                "Unable to connect to provider.",
        };
    }
};

module.exports = {
    buyAirtime,
};