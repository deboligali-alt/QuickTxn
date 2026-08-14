const axios = require("axios");

const MONNIFY_BASE_URL =
    process.env.MONNIFY_BASE_URL ||
    "https://sandbox.monnify.com";

const monnifyApi = axios.create({
    baseURL: MONNIFY_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const getMonnifyAccessToken = async () => {
    const apiKey =
        process.env.MONNIFY_API_KEY;

    const secretKey =
        process.env.MONNIFY_SECRET_KEY;

    if (!apiKey || !secretKey) {
        throw new Error(
            "Monnify API credentials are not configured."
        );
    }

    const credentials = Buffer.from(
        `${apiKey}:${secretKey}`
    ).toString("base64");

    const response = await monnifyApi.post(
        "/api/v1/auth/login",
        {},
        {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        }
    );

    return response.data.responseBody.accessToken;
};

module.exports = {
    monnifyApi,
    getMonnifyAccessToken,
};