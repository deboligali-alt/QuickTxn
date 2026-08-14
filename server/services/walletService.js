const { pool } = require("../config/db");

// ========================================
// Get Wallet By User ID
// ========================================
const getWallet = async (userId, client = pool) => {

    const result = await client.query(
        `SELECT *
         FROM wallets
         WHERE user_id = $1`,
        [userId]
    );

    return result.rows[0];
};

// ========================================
// Check Wallet Balance
// ========================================
const checkBalance = async (userId, amount, client = pool) => {

    const result = await client.query(
        `SELECT balance
         FROM wallets
         WHERE user_id = $1
         FOR UPDATE`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("Wallet not found.");
    }

    const balance = Number(result.rows[0].balance);

    if (balance < Number(amount)) {
        throw new Error("Insufficient wallet balance.");
    }

    return balance;
};

// ========================================
// Debit Wallet
// ========================================
const debitWallet = async (userId, amount, client = pool) => {

    await checkBalance(userId, amount, client);

    await client.query(
        `UPDATE wallets
         SET balance = balance - $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [amount, userId]
    );
};

// ========================================
// Credit Wallet
// ========================================
const creditWallet = async (userId, amount, client = pool) => {

    await client.query(
        `UPDATE wallets
         SET balance = balance + $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [amount, userId]
    );
};

// ========================================
// Get Wallet Balance
// ========================================
const getBalance = async (userId, client = pool) => {

    const wallet = await getWallet(userId, client);

    if (!wallet) {
        throw new Error("Wallet not found.");
    }

    return Number(wallet.balance);
};

// ========================================
// Wallet Exists
// ========================================
const walletExists = async (userId, client = pool) => {

    const result = await client.query(
        `SELECT *
         FROM wallets
         WHERE user_id = $1`,
        [userId]
    );

    return result.rows.length > 0;
};

// ========================================
// Transfer Money
// ========================================
const transfer = async (
    senderId,
    receiverId,
    amount,
    client = pool
) => {

    await debitWallet(senderId, amount, client);

    await creditWallet(receiverId, amount, client);

};

module.exports = {
    getWallet,
    getBalance,
    checkBalance,
    debitWallet,
    creditWallet,
    walletExists,
    transfer
};