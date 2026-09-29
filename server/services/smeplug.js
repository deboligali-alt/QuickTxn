const axios = require("axios");

const BASE_URL = "https://smeplug.ng/api/v1";

const smeplug = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        Authorization: `Bearer ${process.env.SMEPLUG_SECRET_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ======================================
// CHECK SMEPLUG WALLET BALANCE
// ======================================
const getBalance = async () => {
    const { data } = await smeplug.get("/account/balance");
    return data;
};

// ======================================
// RETRIEVE NETWORKS
// ======================================
const getNetworks = async () => {
    const { data } = await smeplug.get("/networks");
    return data;
};

// ======================================
// PURCHASE AIRTIME
// ======================================
const buyAirtime = async ({
    networkId,
    phone,
    amount,
}) => {
    const payload = {
        network_id: Number(networkId),
        phone_number: String(phone),
        amount: Number(amount),
    };

    console.log("SMEPLUG AIRTIME REQUEST:", {
        ...payload,
        // Never log the API key.
    });

    const response = await smeplug.post("/vtu", payload);

    console.log("SMEPLUG AIRTIME STATUS:", response.status);
    console.log("SMEPLUG AIRTIME RESPONSE:", response.data);

    return {
        httpStatus: response.status,
        data: response.data,
    };
};

// ======================================
// REQUERY TRANSACTION
// ======================================
const getTransaction = async (reference) => {
    const { data } = await smeplug.get(
        `/transactions/${encodeURIComponent(reference)}`
    );

    return data;
};

module.exports = {
    getBalance,
    getNetworks,
    buyAirtime,
    getTransaction,
};