const axios = require("axios");

// ========================================
// VTpass Configuration
// ========================================
const VTPASS_URL = "https://sandbox.vtpass.com/api/pay";

// ========================================
// Purchase Data
// ========================================
const purchaseData = async ({
    network,
    planCode,
    phoneNumber,
    amount
}) => {

    // ========================================
    // Map QuickTxn network names to VTpass
    // ========================================
    const serviceIDMap = {
        MTN: "mtn-data",
        AIRTEL: "airtel-data",
        GLO: "glo-data",
        "9MOBILE": "etisalat-data"
    };

    const serviceID =
        serviceIDMap[network.toUpperCase()];

    if (!serviceID) {
        throw new Error("Unsupported network.");
    }

    // ========================================
    // Generate unique request ID
    // ========================================
    const requestId =
        `QTXN-DATA-${Date.now()}-${Math.floor(
            Math.random() * 100000
        )}`;

    // ========================================
    // VTpass Request
    // ========================================
    const response = await axios.post(
        VTPASS_URL,
        {
            request_id: requestId,
            serviceID,
            billersCode: phoneNumber,
            variation_code: planCode,
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
        "VTpass Data Response:",
        {
            requestId,
            code: data.code,
            responseDescription:
                data.response_description,
            transaction:
                data.content?.transactions
        }
    );

    // ========================================
    // Check VTpass response
    // ========================================
    if (
        data.code !== "000" &&
        data.code !== "0o0"
    ) {
        throw new Error(
            data.response_description ||
            "Data purchase failed."
        );
    }

    const transaction =
        data.content?.transactions;

    if (
        !transaction ||
        transaction.status !== "delivered"
    ) {
        throw new Error(
            transaction?.status ||
            "Data purchase was not delivered."
        );
    }

    // ========================================
    // Return successful purchase
    // ========================================
    return {
        success: true,

        provider: "VTPASS",

        providerReference:
            transaction.transactionId ||
            requestId,

        requestId,

        responseCode:
            data.code,

        message:
            data.response_description ||
            "Data purchased successfully."
    };
};

// ========================================
// Export
// ========================================
module.exports = {
    purchaseData
};