// services/waecService.js

const getProducts = async () => {
    return [
        {
            code: "WAEC-RESULT",
            name: "WAEC Result Checker ePIN",
            amount: 4500,
        },
        {
            code: "WAEC-DIRECT",
            name: "WAEC Direct Scratch Card",
            amount: 5000,
        },
    ];
};

const purchaseWaecPin = async ({
    productCode,
    amount,
    reference,
}) => {
    // Sandbox response
    return {
        success: true,
        provider: "QuickTxn Sandbox",
        reference,
        pin: "4729-8831-7744-9921",
        serial: "WRC928374651",
        amount,
    };
};

module.exports = {
    getProducts,
    purchaseWaecPin,
};