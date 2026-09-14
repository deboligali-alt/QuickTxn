const axios = require("axios");

// Internal network mapping
const NETWORK_MAP = {
    MTN: "mtn",
    GLO: "glo",
    AIRTEL: "airtel",
    "9MOBILE": "9mobile",
};

// ==============================
// BUY AIRTIME
// ==============================
const purchaseAirtimeVTU = async ({
    network,
    phone,
    amount,
    reference,
}) => {
    try {
        // Replace this with your live VTU provider later
        return {
            success: true,
            provider: "QuickTxn Sandbox",
            reference,
            network,
            phone,
            amount,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Airtime provider unavailable",
        };
    }
};

// ==============================
// BUY DATA
// ==============================
const purchaseDataVTU = async ({
    network,
    planCode,
    phone,
    amount,
    reference,
}) => {
    try {
        // Replace with live provider later
        return {
            success: true,
            provider: "QuickTxn Sandbox",
            reference,
            network,
            planCode,
            phone,
            amount,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Data provider unavailable",
        };
    }
};

// ==============================
// GET DATA PLANS
// ==============================
const getDataPlansVTU = async (network) => {
    // Temporary plans (replace with live API)
    const plans = {
        MTN: [
            {
                plan_code: "MTN500MB",
                plan_name: "500MB",
                amount: 300,
            },
            {
                plan_code: "MTN1GB",
                plan_name: "1GB",
                amount: 500,
            },
            {
                plan_code: "MTN2GB",
                plan_name: "2GB",
                amount: 1000,
            },
        ],
        AIRTEL: [
            {
                plan_code: "AIR500MB",
                plan_name: "500MB",
                amount: 300,
            },
            {
                plan_code: "AIR1GB",
                plan_name: "1GB",
                amount: 500,
            },
        ],
        GLO: [
            {
                plan_code: "GLO1GB",
                plan_name: "1GB",
                amount: 450,
            },
        ],
        "9MOBILE": [
            {
                plan_code: "9M1GB",
                plan_name: "1GB",
                amount: 500,
            },
        ],
    };

    return plans[network.toUpperCase()] || [];
};

module.exports = {
    purchaseAirtimeVTU,
    purchaseDataVTU,
    getDataPlansVTU,
};