const initializePayment = async ({
    email,
    amount
}) => {

    return {
        authorization_url: "",
        access_code: "",
        reference: `PAY-${Date.now()}`
    };

};

const verifyPayment = async (reference) => {

    return {
        success: true,
        reference
    };

};

module.exports = {
    initializePayment,
    verifyPayment
};