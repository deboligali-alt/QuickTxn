const axios = require("axios");
const { getAccessToken } = require("./monnifyService");

const createReservedAccount = async ({
    email,
    name,
    reference,
}) => {
    const token = await getAccessToken();

    const { data } = await axios.post(
        `${process.env.MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`,
        {
            accountReference: reference,
            accountName: name,
            currencyCode: "NGN",
            contractCode: process.env.MONNIFY_CONTRACT_CODE,
            customerName: name,
            customerEmail: email,
            getAllAvailableBanks: false,
            preferredBanks: ["035"],
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!data.requestSuccessful) {
        throw new Error(data.responseMessage);
    }

    return data.responseBody;
};

module.exports = {
    createReservedAccount,
};