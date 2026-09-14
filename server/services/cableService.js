// services/cableService.js

const verifyDecoder = async ({
    provider,
    smartcardNumber,
}) => {
    // Sandbox response
    return {
        success: true,
        customerName: "ADEBOWALE IBRAHIM",
        smartcardNumber,
        provider,
    };
};

const purchaseCable = async ({
    provider,
    smartcardNumber,
    packageCode,
    amount,
    reference,
}) => {
    // Sandbox response
    return {
        success: true,
        provider: "QuickTxn Sandbox",
        reference,
        amount,
        packageCode,
        customerName: "ADEBOWALE IBRAHIM",
    };
};

const getCablePackages = async (provider) => {
    const plans = {
        DSTV: [
            { code: "DSTV-PADI", name: "DStv Padi", amount: 4400 },
            { code: "DSTV-YANGA", name: "DStv Yanga", amount: 6000 },
            { code: "DSTV-CONFAM", name: "DStv Confam", amount: 11000 },
        ],
        GOTV: [
            { code: "GOTV-SMALLIE", name: "GOtv Smallie", amount: 1900 },
            { code: "GOTV-JINJA", name: "GOtv Jinja", amount: 3900 },
            { code: "GOTV-MAX", name: "GOtv Max", amount: 8500 },
        ],
        STARTIMES: [
            { code: "ST-NOVA", name: "Nova", amount: 1700 },
            { code: "ST-BASIC", name: "Basic", amount: 3300 },
        ],
    };

    return plans[provider.toUpperCase()] || [];
};

module.exports = {
    verifyDecoder,
    purchaseCable,
    getCablePackages,
};