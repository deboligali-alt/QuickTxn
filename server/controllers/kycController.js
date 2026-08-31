const { pool } = require("../config/db");

// Submit KYC
const submitKYC = async (req, res) => {
    try {
        const {
            fullName,
            dob,
            bvn,
            idType,
            idImage,
            selfie,
        } = req.body;

        if (
            !fullName ||
            !dob ||
            !bvn ||
            !idType ||
            !idImage ||
            !selfie
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const existing = await pool.query(
            "SELECT id FROM kyc_verifications WHERE user_id=$1",
            [req.user.id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "KYC already submitted.",
            });
        }

        await pool.query(
            `INSERT INTO kyc_verifications
            (
                user_id,
                full_name,
                date_of_birth,
                bvn,
                id_type,
                id_image,
                selfie_image
            )
            VALUES($1,$2,$3,$4,$5,$6,$7)`,
            [
                req.user.id,
                fullName,
                dob,
                bvn,
                idType,
                idImage,
                selfie,
            ]
        );

        await pool.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES($1,$2,$3)`,
            [
                req.user.id,
                "KYC Submitted",
                "Your verification is under review.",
            ]
        );

        res.status(201).json({
            success: true,
            message: "KYC submitted successfully.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get User KYC
const getMyKYC = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM kyc_verifications
             WHERE user_id=$1`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: result.rows[0] || null,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    submitKYC,
    getMyKYC,
};