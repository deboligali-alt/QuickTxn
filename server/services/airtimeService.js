const axios = require("axios");

// ========================================
// ClubKonnect Configuration
// ========================================
const BASE_URL =
    "https://www.nellobytesystems.com/APIAirtimeV1.asp";

// ========================================
// Purchase Airtime
// ========================================
const purchaseAirtime = async ({
    network,
    phoneNumber,
    amount,
}) => {
    const networkMap = {
        MTN: "01",
        GLO: "02",
        "9MOBILE": "03",
        AIRTEL: "04",
    };

    const mobileNetwork = networkMap[network.toUpperCase()];

    if (!mobileNetwork) {
        throw new Error("Unsupported network.");
    }

    const requestId = `QTXN-${Date.now()}`;

    const url =
        `${BASE_URL}?UserID=${process.env.CLUBKONNECT_USERID}` +
        `&APIKey=${process.env.CLUBKONNECT_API_KEY}` +
        `&MobileNetwork=${mobileNetwork}` +
        `&Amount=${Number(amount)}` +
        `&MobileNumber=${phoneNumber}` +
        `&RequestID=${requestId}`;

    const { data } = await axios.get(url, {
        timeout: 30000,
    });

    console.log("======= ClubKonnect Airtime =======");
    console.log(data);
    console.log("==================================");

    if (data.statuscode !== "100") {
        throw new Error(
            data.status || "Airtime purchase failed."
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
    purchaseAirtime,
};