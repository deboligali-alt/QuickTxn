const axios = require("axios");

// ========================================
// Purchase Data via VTpass
// ========================================
const purchaseData = async ({
    network,
    planCode,
    phoneNumber,
    amount
}) => {

    const serviceIDMap = {
        MTN: "mtn-data",
        AIRTEL: "airtel-data",
        GLO: "glo-data",
        "9MOBILE": "etisalat-data"
    };

    const serviceID = serviceIDMap[network.toUpperCase()];

    if (!serviceID) {
        throw new Error("Unsupported network.");
    }

    const requestId = `QTXN-DATA-${Date.now()}`;

    const response = await axios.post(
        `${process.env.VTPASS_BASE_URL}/pay`,
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
                "api-key": process.env.VTPASS_API_KEY,
                "secret-key": process.env.VTPASS_SECRET_KEY,
                "public-key": process.env.VTPASS_PUBLIC_KEY,
                "Content-Type": "application/json"
            },
            timeout: 30000
        }
    );

    const data = response.data;

    if (data.code !== "000" && data.code !== "0o0") {
        throw new Error(
            data.response_description || "Data purchase failed."
        );
    }

    const transaction = data.content?.transactions;

    if (
        transaction &&
        transaction.status &&
        transaction.status !== "delivered"
    ) {
        throw new Error(transaction.status);
    }

    return {
        success: true,
        provider: "VTPASS",
        providerReference:
            transaction?.transactionId || requestId,
        requestId
    };
};

module.exports = {
    purchaseData
};