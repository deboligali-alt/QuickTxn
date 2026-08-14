const purchaseData = async ({
    network,
    planCode,
    phoneNumber
}) => {

    return {
        success: true,
        provider: "SIMULATION",
        providerReference: `DATA-${Date.now()}`
    };

};

module.exports = {
    purchaseData
};