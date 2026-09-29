const {
    buyAirtime,
    buyData,
    getTransaction,
} = require("./smeplug");
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
            reference,
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
            response.httpStatus < 300 &&
            response.data?.status === true
        ) {
            return {
                success: true,
                provider: "SMEPLUG",
                reference,
                providerReference:
                    response.data.data?.reference,
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
        const providerError = error.response?.data;

        console.error(
            "SMEPLUG AIRTIME ERROR:",
            providerError || error.message
        );

        // ======================================
        // DEFINITIVE PROVIDER REJECTION
        // ======================================
        // SMEPlug explicitly rejected the request.
        // This is NOT an uncertain transaction.
        if (
            providerError?.status === false &&
            providerError?.msg
        ) {
            return {
                success: false,
                provider: "SMEPLUG",
                uncertain: false,
                message: providerError.msg,
                reference,
                raw: providerError,
            };
        }

        // ======================================
        // PROVIDER RESPONSE IS UNKNOWN
        // ======================================
        // The request may have reached SMEPlug,
        // but we cannot safely determine its status.
        return {
            success: false,
            provider: "SMEPLUG",
            uncertain: true,
            message:
                "Unable to confirm SMEPlug transaction status.",
            reference,
            raw: providerError || null,
            error: error.message,
        };
    }
};


// ======================================
// REQUERY AIRTIME TRANSACTION
// ======================================
const requeryAirtimeVTU = async (reference) => {
    try {
        if (!reference) {
            return {
                success: false,
                message: "Transaction reference is required.",
            };
        }

        console.log(
            "SMEPLUG REQUERY:",
            reference
        );

        const response =
            await getTransaction(reference);

        console.log(
            "SMEPLUG REQUERY RESPONSE:",
            JSON.stringify(
                response,
                null,
                2
            )
        );

        // SMEPlug returns transaction details
        // including status and reference.
        if (!response) {
            return {
                success: false,
                message:
                    "No response from SMEPlug.",
            };
        }

        const status =
            String(
                response.status || ""
            ).toLowerCase();

        if (
            status === "success" ||
            status === "successful"
        ) {
            return {
                success: true,
                status: "SUCCESS",
                provider: "SMEPLUG",
                reference:
                    response.reference ||
                    null,
                customerReference:
                    response.customer_reference ||
                    reference,
                data: response,
            };
        }

        if (
            status === "failed" ||
            status === "failure"
        ) {
            return {
                success: true,
                status: "FAILED",
                provider: "SMEPLUG",
                reference:
                    response.reference ||
                    null,
                customerReference:
                    response.customer_reference ||
                    reference,
                data: response,
            };
        }

        return {
            success: true,
            status: "PENDING",
            provider: "SMEPLUG",
            reference:
                response.reference ||
                null,
            customerReference:
                response.customer_reference ||
                reference,
            data: response,
        };

    } catch (error) {
        console.error(
            "SMEPLUG REQUERY ERROR:",
            error.response?.data ||
            error.message
        );

        return {
            success: false,
            status: "UNKNOWN",
            provider: "SMEPLUG",
            message:
                "Unable to requery SMEPlug transaction.",
            reference,
            raw:
                error.response?.data ||
                null,
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
// ======================================
// LIVE DATA (SMEPLUG)
// ======================================
const purchaseDataVTU = async ({
    network,
    planId,
    phone,
    reference,
}) => {

    const networkMap = {
        MTN: 1,
        AIRTEL: 2,
        "9MOBILE": 3,
        T2: 3,
        GLO: 4,
    };

    const normalizedNetwork =
        String(network || "").toUpperCase();

    const networkId =
        networkMap[normalizedNetwork];

    console.log("DATA VTU INPUT:", {
        network: normalizedNetwork,
        networkId,
        planId,
        phone,
        reference,
    });

    if (!networkId) {
        return {
            success: false,
            provider: "SMEPLUG",
            message:
                `Unsupported network: ${network}`,
        };
    }

    if (!planId) {
        return {
            success: false,
            provider: "SMEPLUG",
            message:
                "Data plan ID is required.",
        };
    }

    if (!phone) {
        return {
            success: false,
            provider: "SMEPLUG",
            message:
                "Phone number is required.",
        };
    }

    if (!reference) {
        return {
            success: false,
            provider: "SMEPLUG",
            message:
                "Transaction reference is required.",
        };
    }

    try {

        const response = await buyData({
            networkId,
            planId,
            phone,
            reference,
        });

        console.log(
            "========== SMEPLUG DATA =========="
        );

        console.log(
            JSON.stringify(
                response,
                null,
                2
            )
        );

        console.log(
            "=================================="
        );

        if (
            response.httpStatus >= 200 &&
            response.httpStatus < 300 &&
            response.data?.status === true
        ) {
            return {
                success: true,
                provider: "SMEPLUG",
                reference,
                providerReference:
                    response.data.data?.reference ||
                    null,
                pendingVerification: true,
                raw: response.data,
            };
        }

        return {
            success: false,
            provider: "SMEPLUG",
            uncertain: false,
            message:
                response.data?.msg ||
                "SMEPlug data request failed.",
            reference,
            raw: response.data,
        };

    } catch (error) {

        const providerError =
            error.response?.data;

        console.error(
            "SMEPLUG DATA ERROR:",
            providerError ||
            error.message
        );

        // ======================================
        // DEFINITIVE PROVIDER REJECTION
        // ======================================
        if (
            providerError?.status === false &&
            providerError?.msg
        ) {
            return {
                success: false,
                provider: "SMEPLUG",
                uncertain: false,
                message: providerError.msg,
                reference,
                raw: providerError,
            };
        }

        // ======================================
        // PROVIDER RESPONSE IS UNKNOWN
        // ======================================
        return {
            success: false,
            provider: "SMEPLUG",
            uncertain: true,
            message:
                "Unable to confirm SMEPlug data transaction status.",
            reference,
            raw:
                providerError ||
                null,
            error:
                error.message,
        };
    }
};

module.exports = {
    purchaseAirtimeVTU,
    requeryAirtimeVTU,
    purchaseDataVTU,
    getDataPlansVTU,
};