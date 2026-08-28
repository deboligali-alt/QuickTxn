const axios = require("axios");

const BASE_URL = "https://api.paystack.co";

const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
};

// =======================================
// Get all Nigerian banks
// =======================================
const getBanks = async () => {
    const response = await axios.get(
        `${BASE_URL}/bank?country=nigeria`,
        { headers }
    );

    return response.data.data;
};

// =======================================
// Resolve account number
// =======================================
const resolveAccount = async (accountNumber, bankCode) => {
    const response = await axios.get(
        `${BASE_URL}/bank/resolve`,
        {
            headers,
            params: {
                account_number: accountNumber,
                bank_code: bankCode,
            },
        }
    );

    return response.data.data;
};

// =======================================
// Create transfer recipient
// =======================================
const createRecipient = async ({
    accountName,
    accountNumber,
    bankCode,
}) => {
    const response = await axios.post(
        `${BASE_URL}/transferrecipient`,
        {
            type: "nuban",
            name: accountName,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: "NGN",
        },
        { headers }
    );

    return response.data.data;
};

// =======================================
// Initiate transfer
// =======================================
const initiateTransfer = async ({
    amount,
    recipientCode,
    reference,
    reason,
}) => {
    const response = await axios.post(
        `${BASE_URL}/transfer`,
        {
            source: "balance",
            amount: Math.round(Number(amount) * 100),
            recipient: recipientCode,
            reference,
            reason,
        },
        { headers }
    );

    return response.data.data;
};

module.exports = {
    getBanks,
    resolveAccount,
    createRecipient,
    initiateTransfer,
};