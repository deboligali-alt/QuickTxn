// utils/cashback.js

const calculateCashback = (service, amount) => {
    const rates = {
        AIRTIME: 0.02,
        DATA: 0.03,
    };

    const rate = rates[service] || 0;

    return Math.floor(Number(amount) * rate);
};

module.exports = {
    calculateCashback,
};