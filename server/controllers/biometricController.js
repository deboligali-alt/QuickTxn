const { pool } = require("../config/db");

// ========================================
// Register Fingerprint / Face ID
// ========================================
const registerBiometric = async (req, res) => {
    const { credentialId, publicKey } = req.body;

    if (!credentialId || !publicKey) {
        return res.status(400).json({
            success: false,
            message: "Biometric credential is required.",
        });
    }

    try {
        await pool.query(
            `INSERT INTO user_biometrics
            (
                user_id,
                credential_id,
                public_key
            )
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id)
            DO UPDATE SET
                credential_id = EXCLUDED.credential_id,
                public_key = EXCLUDED.public_key`,
            [req.user.id, credentialId, publicKey]
        );

        return res.status(200).json({
            success: true,
            message: "Biometric registered successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to register biometric.",
        });
    }
};

// ========================================
// Check Biometric Status
// ========================================
const getBiometric = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                credential_id,
                created_at
             FROM user_biometrics
             WHERE user_id = $1`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            registered: result.rows.length > 0,
            data: result.rows[0] || null,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve biometric status.",
        });
    }
};

// ========================================
// Remove Biometric
// ========================================
const deleteBiometric = async (req, res) => {
    try {
        await pool.query(
            `DELETE FROM user_biometrics
             WHERE user_id = $1`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Biometric removed successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to remove biometric.",
        });
    }
};

module.exports = {
    registerBiometric,
    getBiometric,
    deleteBiometric,
};