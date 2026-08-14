const purchaseAirtime = async ({
    network,
    phoneNumber,
    amount
}) => {

    // Simulation
    return {
        success: true,
        provider: "SIMULATION",
        providerReference: `AIR-${Date.now()}`
    };

};

module.exports = {
    purchaseAirtime
};