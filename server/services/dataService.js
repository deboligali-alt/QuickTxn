const axios = require("axios");

// ========================================
// CLUBKONNECT LIVE DATA PURCHASE
// ========================================

const BASE_URL =
    "https://www.nellobytesystems.com/APIDatabundleV1.asp";

const purchaseData = async ({
    network,
    planCode,
    phoneNumber,
}) => {
    const requestId = `DATA-${Date.now()}`;

    const url =
        `${BASE_URL}?UserID=${process.env.CLUBKONNECT_USERID}` +
        `&APIKey=${process.env.CLUBKONNECT_API_KEY}` +
        `&MobileNetwork=${network}` +
        `&DataPlan=${planCode}` +
        `&MobileNumber=${phoneNumber}` +
        `&RequestID=${requestId}`;

    const { data } = await axios.get(url, {
        timeout: 30000,
    });

    console.log("====== CLUBKONNECT DATA ======");
    console.log(data);
    console.log("==============================");

    if (data.statuscode !== "100") {
        throw new Error(
            data.status || "Data purchase failed."
        );
    }

    return {
        success: true,
        provider: "CLUBKONNECT",
        providerReference: data.orderid || requestId,
        requestId,
        responseCode: data.statuscode,
        message: data.status,
    };
};

module.exports = {
    purchaseData,
};