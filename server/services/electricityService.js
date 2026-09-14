// services/electricityService.js

const verifyMeter = async ({
    meterNumber,
    disco,
    meterType,
}) => {
    // Temporary sandbox response
    return {
        success: true,
        customerName: "ADEBOWALE IBRAHIM",
        meterNumber,
        disco,
        meterType,
    };
};

const purchaseElectricity = async ({
    meterNumber,
    disco,
    meterType,
    amount,
    reference,
}) => {
    // Temporary sandbox response
    return {
        success: true,
        provider: "QuickTxn Sandbox",
        reference,
        token: "4588-7789-1122-6633-9988",
        units: 32.45,
        amount,
        meterNumber,
        disco,
    };
};

module.exports = {
    verifyMeter,
    purchaseElectricity,
};