const axios = require("axios");

const BASE_URL = process.env.MONNIFY_BASE_URL;

// Generate Monnify Access Token
const getAccessToken = async () => {
    const credentials = Buffer.from(
        `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
    ).toString("base64");

    const { data } = await axios.post(
        `${BASE_URL}/auth/login`,
        {},
        {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        }
    );

    return data.responseBody.accessToken;
};

// Initialize Wallet Funding
const initializePayment = async ({
    amount,
    email,
    name,
    reference,
}) => {
    const token = await getAccessToken();

    const { data } = await axios.post(
        `${BASE_URL}/merchant/transactions/init-transaction`,
        {
            amount: Number(amount),
            customerName: name,
            customerEmail: email,
            paymentReference: reference,
            paymentDescription: "QuickTxn Wallet Funding",
            currencyCode: "NGN",
            contractCode: process.env.MONNIFY_CONTRACT_CODE,
            redirectUrl: process.env.MONNIFY_REDIRECT_URL,
            paymentMethods: [
                "CARD",
                "ACCOUNT_TRANSFER",
                "USSD",
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data.responseBody;
};

// Verify Payment
const verifyPayment = async (reference) => {
    const token = await getAccessToken();

    const { data } = await axios.get(
        `${BASE_URL}/merchant/transactions/query`,
        {
            params: {
                paymentReference: reference,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data.responseBody;
};

module.exports = {
    getAccessToken,
    initializePayment,
    verifyPayment,
};