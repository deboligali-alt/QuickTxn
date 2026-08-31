const { pool } = require("../config/db");
const { creditWallet } = require("./walletService");

const cashbackRates = {
    AIRTIME: 2, // 2%
    DATA: 3      // 3%
};

const giveCashback = async (
    userId,
    service,
    amount,
    client
) => {
    const rate = cashbackRates[service] || 0;

    if (rate === 0) return 0;

    const cashback = Number(
        (Number(amount) * rate / 100).toFixed(2)
    );

    if (cashback <= 0) return 0;

    await creditWallet(userId, cashback, client);

    const reference = `CB-${Date.now()}`;

    await client.query(
        `INSERT INTO cashback_transactions
        (
            user_id,
            service,
            purchase_amount,
            cashback_amount,
            percentage,
            reference
        )
        VALUES($1,$2,$3,$4,$5,$6)`,
        [
            userId,
            service,
            amount,
            cashback,
            rate,
            reference,
        ]
    );

    await client.query(
        `INSERT INTO transactions
        (
            receiver_id,
            type,
            amount,
            description,
            status,
            reference,
            payment_provider
        )
        VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [
            userId,
            "CREDIT",
            cashback,
            `${rate}% Cashback Reward`,
            "SUCCESS",
            reference,
            "CASHBACK",
        ]
    );

    await client.query(
        `INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES($1,$2,$3)`,
        [
            userId,
            "Cashback Received",
            `You received ₦${cashback} cashback on your ${service.toLowerCase()} purchase.`,
        ]
    );

    return cashback;
};

module.exports = {
    giveCashback,
};