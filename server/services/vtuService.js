const { buyAirtime } = require("./clubkonnect");
const { pool } = require("../config/db");

// ======================================
// LIVE AIRTIME (CLUBKONNECT)
// ======================================
const purchaseAirtimeVTU = async ({
    network,
    phone,
    amount,
    reference,
}) => {
    const networkMap = {
        MTN: "01",
        GLO: "02",
        "9MOBILE": "03",
        AIRTEL: "04",
    };

    const response = await buyAirtime({
        network: networkMap[network.toUpperCase()],
        amount,
        phone,
        requestId: reference,
    });

    console.log("========== CLUBKONNECT ==========");
    console.log(JSON.stringify(response, null, 2));
    console.log("================================");

    if (
        response.status === "ORDER_RECEIVED" ||
        response.statuscode === "100"
    ) {
        return {
            success: true,
            provider: "CLUBKONNECT",
            raw: response,
        };
    }

    return {
        success: false,
        message:
            response.status ||
            response.message ||
            "Airtime delivery failed.",
    };
};

// ======================================
// GET DATA PLANS FROM DATABASE
// ======================================
const getDataPlansVTU = async (network) => {
    const result = await pool.query(
        `SELECT
            plan_name,
            plan_code,
            amount
         FROM data_plans
         WHERE network = $1
         AND is_active = TRUE
         ORDER BY amount ASC`,
        [network.toUpperCase()]
    );

    return result.rows;
};

// ======================================
// DATA PURCHASE (NEXT STEP)
// ======================================
const purchaseDataVTU = async ({
    network,
    planCode,
    phone,
    amount,
    reference,
}) => {
    return {
        success: false,
        provider: "CLUBKONNECT",
        message: "Live data endpoint not connected yet.",
        network,
        planCode,
        phone,
        amount,
        reference,
    };
};

module.exports = {
    purchaseAirtimeVTU,
    purchaseDataVTU,
    getDataPlansVTU,
};c