const axios = require("axios");

// ========================================
// VTpass Configuration
// ========================================
const VTPASS_URL = "https://sandbox.vtpass.com/api/pay";

// ========================================
// Purchase Airtime
// ========================================
const purchaseAirtime = async ({
    network,
    phoneNumber,
    amount
}) => {

    // ========================================
    // Map QuickTxn network names to VTpass
    // ========================================
    const serviceIDMap = {
        MTN: "mtn",
        AIRTEL: "airtel",
        GLO: "glo",
        "9MOBILE": "etisalat"
    };

    const serviceID =
        serviceIDMap[
        network.toUpperCase()
        ];

    if (!serviceID) {
        throw new Error(
            "Unsupported network."
        );
    }

    // ========================================
    // Generate unique VTpass request ID
    // ========================================
    const requestId =
        `QTXN-${Date.now()}-${Math.floor(
            Math.random() * 100000
        )}`;

    // ========================================
    // VTpass request
    // ========================================

    const response = await axios.post(

        VTPASS_URL,
        {
            request_id: requestId,
            serviceID,
            amount: Number(amount),
            phone: phoneNumber
        },
        {
            headers: {
                "api-key":
                    process.env.VTPASS_API_KEY,

                "secret-key":
                    process.env.VTPASS_SECRET_KEY,

                "Content-Type":
                    "application/json"
            },

            timeout: 30000
        }
    );

    const data = response.data;

    console.log(
    "========== VTpass Airtime Response =========="
);

console.log(
    JSON.stringify(
        data,
        null,
        2
    )
);

console.log(
    "=============================================="
);

    // ========================================
    // Check VTpass response
    // ========================================
    if (
        data.code !== "000" &&
        data.code !== "0"
    ) {

        throw new Error(
            data.response_description ||
            "Airtime purchase failed."
        );
    }

    // ========================================
    // Return successful purchase
    // ========================================
    return {
        success: true,

        provider: "VTPASS",

        providerReference:
            data.content?.transactions
                ?.transactionId ||
            requestId,

        requestId,

        responseCode:
            data.code,

        message:
            data.response_description ||
            "Airtime purchased successfully."
    };
};


// ========================================
// Export
// ========================================
module.exports = {
    purchaseAirtime
};