// services/bettingService.js

const verifyCustomer = async ({ provider, customerId }) => {
    // Sandbox verification
    return {
        success: true,
        customerName: "ADEBOWALE IBRAHIM",
        customerId,
        provider,
    };
};

const fundBettingWallet = async ({
    provider,
    customerId,
    amount,
    reference,
}) => {
    // Sandbox funding
    return {
        success: true,
        provider: "QuickTxn Sandbox",
        reference,
        customerId,
        amount,
    };
};

module.exports = {
    verifyCustomer,
    fundBettingWallet,
};