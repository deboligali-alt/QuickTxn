const axios = require("axios");

const paystack = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});

// ==========================================
// Initialize Wallet Funding
// ==========================================
const initializePayment = async ({ email, amount, userId }) => {
    const reference = `FUND-${Date.now()}`;

    const { data } = await paystack.post("/transaction/initialize", {
        email,
        amount: Number(amount) * 100, // Kobo
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
            userId,
            purpose: "wallet_funding",
        },
    });

    return {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference,
    };
};

// ==========================================
// Verify Payment
// ==========================================
const verifyPayment = async (reference) => {
    const { data } = await paystack.get(
        `/transaction/verify/${reference}`
    );

    return {
        success: data.data.status === "success",
        amount: data.data.amount / 100,
        reference: data.data.reference,
        customer: data.data.customer.email,
        gateway_response: data.data.gateway_response,
        status: data.data.status,
        metadata: data.data.metadata,
    };
};

module.exports = {
    initializePayment,
    verifyPayment,
};