const {
    getBalance,
    getNetworks,
    getDataPlans,
} = require("../services/smeplug");

const classifyPlan = (plan) => {
    const name = String(plan?.name || "").toLowerCase();

    // ========================================
    // 1. GIFTING MUST BE CHECKED FIRST
    // ========================================
    if (name.includes("[gifting]")) {
        return "GIFTING";
    }

    // ========================================
    // 2. CORPORATE
    // ========================================
    if (name.includes("[corporate]")) {
        return "CORPORATE";
    }

    // ========================================
    // 3. SOCIAL
    // ========================================
    if (
        name.includes("[social]") ||
        name.includes("[soclai]") ||
        name.includes("facebook") ||
        name.includes("whatsapp") ||
        name.includes("tiktok") ||
        name.includes("instagram") ||
        name.includes("youtube") ||
        name.includes("ayoba")
    ) {
        return "SOCIAL";
    }

    // ========================================
    // 4. AWOOF
    // ========================================
    if (
        name.includes("[awoof]") ||
        name.includes("awoof")
    ) {
        return "AWOOF";
    }

    // ========================================
    // 5. BROADBAND
    // ========================================
    if (
        name.includes("broadband") ||
        name.includes("fibre") ||
        name.includes("fibrex") ||
        name.includes("unlimited")
    ) {
        return "BROADBAND";
    }

    // ========================================
    // 6. THRYVE
    // ========================================
    if (name.includes("thryve")) {
        return "THRYVE";
    }

    // ========================================
    // 7. SPECIAL
    // ========================================
    if (name.includes("[special]")) {
        return "SPECIAL";
    }

    // ========================================
    // 8. NORMAL SME
    // ========================================
    return "NORMAL";


};

const isAllowedQuickTxnPlan = (plan) => {
    const category = classifyPlan(plan);

    return (
        category === "NORMAL" ||
        category === "SOCIAL" ||
        category === "AWOOF"
    );
};


const runSMEPlugDiagnostic = async (req, res) => {
    const diagnostic = {
        api: {
            status: "UNKNOWN",
            message: null,
        },
        wallet: {
            status: "UNKNOWN",
            balance: null,
        },
        networks: {
            status: "UNKNOWN",
            data: null,
        },
        plans: {
            status: "UNKNOWN",
            networksFound: [],
            counts: {},
            classification: {},
        },
    };

    // ========================================
    // 1. TEST SMEPLUG API / WALLET
    // ========================================
    try {
        const balanceResponse = await getBalance();
        console.log(
            "SMEPLUG BALANCE DIAGNOSTIC:",
            JSON.stringify(balanceResponse, null, 2)
        );
        diagnostic.api.status = "PASS";
        diagnostic.api.message = "SMEPlug API connection is working.";

        if (
            balanceResponse &&
            Number.isFinite(Number(balanceResponse.balance))
        ) {
            diagnostic.wallet.status = "PASS";
            diagnostic.wallet.balance =
                Number(balanceResponse.balance);
        } else {
            diagnostic.wallet.status = "FAIL";
            diagnostic.wallet.balance = null;
        }
    } catch (error) {
        diagnostic.api.status = "FAIL";
        diagnostic.api.message =
            error.response?.data?.msg ||
            error.response?.data?.message ||
            error.message ||
            "Unable to connect to SMEPlug.";

        return res.status(502).json({
            success: false,
            message: "SMEPlug API diagnostic failed.",
            diagnostic,
        });
    }

    // ========================================
    // 2. TEST NETWORKS
    // ========================================
    try {
        const networkResponse = await getNetworks();

        if (networkResponse?.status === true) {
            diagnostic.networks.status = "PASS";
            diagnostic.networks.data =
                networkResponse.data || {};
        } else {
            diagnostic.networks.status = "FAIL";
        }
    } catch (error) {
        diagnostic.networks.status = "FAIL";
        diagnostic.networks.data = null;
    }

    // ========================================
    // 3. TEST DATA PLANS
    // ========================================
    try {
        const planResponse = await getDataPlans();

        if (!planResponse?.status || !planResponse?.data) {
            diagnostic.plans.status = "FAIL";
        } else {
            diagnostic.plans.status = "PASS";

            const networkPlans = planResponse.data;

            const networkNames = {
                1: "MTN",
                2: "AIRTEL",
                3: "9MOBILE",
                4: "GLO",
            };

            const classification = {};

            for (const [networkId, plans] of Object.entries(networkPlans)) {
                const networkName =
                    networkNames[networkId] ||
                    `NETWORK-${networkId}`;

                diagnostic.plans.networksFound.push(
                    networkName
                );

                diagnostic.plans.counts[networkName] =
                    Array.isArray(plans)
                        ? plans.length
                        : 0;

                classification[networkName] = {
                    total: Array.isArray(plans)
                        ? plans.length
                        : 0,

                    NORMAL: 0,
                    SOCIAL: 0,
                    AWOOF: 0,
                    GIFTING: 0,
                    CORPORATE: 0,
                    BROADBAND: 0,
                    THRYVE: 0,
                    SPECIAL: 0,

                    samples: {
                        NORMAL: [],
                        SOCIAL: [],
                        AWOOF: [],
                        GIFTING: [],
                        CORPORATE: [],
                        BROADBAND: [],
                        THRYVE: [],
                        SPECIAL: [],
                    },
                };

                if (!Array.isArray(plans)) {
                    continue;
                }

                for (const plan of plans) {
                    const category = classifyPlan(plan);

                    if (
                        classification[networkName][category] !== undefined
                    ) {
                        classification[networkName][category]++;

                        if (
                            classification[networkName].samples[category].length < 10
                        ) {
                            classification[networkName].samples[category].push({
                                id: plan.id,
                                name: plan.name,
                                price: plan.price,
                                dispense_method: plan.dispense_method,
                                telco_price: plan.telco_price,
                            });
                        }
                    }
                }
            }

            diagnostic.plans.classification = classification;



        }
    } catch (error) {
        diagnostic.plans.status = "FAIL";
    }

    // ========================================
    // 4. RETURN REPORT
    // ========================================
    return res.json({
        success: true,
        message: "SMEPlug diagnostic completed.",
        diagnostic,
    });
};

module.exports = {
    runSMEPlugDiagnostic,
};