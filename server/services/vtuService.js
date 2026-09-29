const { buyAirtime } = require("./smeplug");
const { pool } = require("../config/db");

// ======================================
// LIVE AIRTIME (SMEPLUG)
// ======================================
const purchaseAirtimeVTU = async ({
    network,
    phone,
    amount,
    reference,
}) => {
    const networkMap = {
        MTN: 1,
        AIRTEL: 2,
        "9MOBILE": 3,
        T2: 3,
        GLO: 4,
    };

    const normalizedNetwork = network.toUpperCase();
    const networkId = networkMap[normalizedNetwork];

    // DEBUG
    console.log("VTU INPUT:", {
        network: normalizedNetwork,
        networkId,
        phone,
        amount,
        reference,
    });

    if (!networkId) {
        return {
            success: false,
            message: `Unsupported network: ${network}`,
        };
    }

    if (!phone) {
        return {
            success: false,
            message: "Phone number is required.",
        };
    }

    try {
        const response = await buyAirtime({
            networkId,
            phone,
            amount,
        });

        console.log("========== SMEPLUG ==========");
        console.log(
            JSON.stringify(response, null, 2)
        );
        console.log("=============================");

        /*
         * SMEPlug's /vtu endpoint may return
         * an empty response body.
         *
         * Therefore we use the HTTP response
         * status here rather than looking for
         * ClubKonnect's ORDER_RECEIVED status.
         */

        if (
            response.httpStatus >= 200 &&
            response.httpStatus < 300
        ) {
            return {
                success: true,
                provider: "SMEPLUG",
                reference,
                pendingVerification: true,
                raw: response.data,
            };
        }

        return {
            success: false,
            provider: "SMEPLUG",
            message: "SMEPlug airtime request failed.",
            raw: response.data,
        };
    } catch (error) {
        console.error(
            "SMEPLUG AIRTIME ERROR:",
            error.response?.data || error.message
        );

        return {
            success: false,
            provider: "SMEPLUG",
            message:
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Airtime purchase failed.",
            raw: error.response?.data,
        };
    }
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
// DATA PURCHASE
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
        provider: "SMEPLUG",
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
};