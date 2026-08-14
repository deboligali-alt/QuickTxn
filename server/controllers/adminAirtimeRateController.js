const { pool } = require("../config/db");

// ========================================
// Get All Airtime Rates
// ========================================
const getAllAirtimeRates = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                id,
                network,
                rate,
                is_active
            FROM airtime_rates
            ORDER BY network ASC
        `);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};

// ========================================
// Create Airtime Rate
// ========================================
// ========================================
// Create Airtime Rate
// ========================================
const createAirtimeRate = async (req, res) => {

    const {
        network,
        rate,
    } = req.body;

    if (!network || !rate) {
        return res.status(400).json({
            success: false,
            message: "Network and rate are required.",
        });
    }

    try {

        const existingRate = await pool.query(
            `SELECT id
             FROM airtime_rates
             WHERE network = $1`,
            [network.toUpperCase()]
        );

        if (existingRate.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Rate for this network already exists.",
            });
        }

        const result = await pool.query(
            `INSERT INTO airtime_rates
            (
                network,
                rate,
                is_active
            )
            VALUES
            ($1, $2, TRUE)
            RETURNING *`,
            [
                network.toUpperCase(),
                rate,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Airtime rate created successfully.",
            data: result.rows[0],
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

// ========================================
// Update Airtime Rate
// ========================================
// ========================================
// Update Airtime Rate
// ========================================
const updateAirtimeRate = async (req, res) => {

    const { id } = req.params;
    const { network, rate, is_active } = req.body;

    try {

        const existingRate = await pool.query(
            `SELECT id
             FROM airtime_rates
             WHERE id = $1`,
            [id]
        );

        if (existingRate.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Airtime rate not found.",
            });
        }

        const result = await pool.query(
            `UPDATE airtime_rates
             SET
                network = $1,
                rate = $2,
                is_active = $3
             WHERE id = $4
             RETURNING *`,
            [
                network.toUpperCase(),
                rate,
                is_active,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Airtime rate updated successfully.",
            data: result.rows[0],
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

// ========================================
// Delete Airtime Rate
// ========================================
// ========================================
// Delete Airtime Rate
// ========================================
const deleteAirtimeRate = async (req, res) => {

    const { id } = req.params;

    try {

        const existingRate = await pool.query(
            `SELECT id
             FROM airtime_rates
             WHERE id = $1`,
            [id]
        );

        if (existingRate.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Airtime rate not found.",
            });
        }

        await pool.query(
            `DELETE
             FROM airtime_rates
             WHERE id = $1`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Airtime rate deleted successfully.",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

// ========================================
// Toggle Airtime Rate Status
// ========================================
// ========================================
// Toggle Airtime Rate Status
// ========================================
const toggleAirtimeRateStatus = async (req, res) => {

    const { id } = req.params;

    try {

        const existingRate = await pool.query(
            `SELECT
                id,
                is_active
             FROM airtime_rates
             WHERE id = $1`,
            [id]
        );

        if (existingRate.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Airtime rate not found.",
            });
        }

        const currentStatus = existingRate.rows[0].is_active;

        const result = await pool.query(
            `UPDATE airtime_rates
             SET is_active = $1
             WHERE id = $2
             RETURNING *`,
            [
                !currentStatus,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: `Airtime rate ${!currentStatus ? "activated" : "deactivated"} successfully.`,
            data: result.rows[0],
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

module.exports = {
    getAllAirtimeRates,
    createAirtimeRate,
    updateAirtimeRate,
    deleteAirtimeRate,
    toggleAirtimeRateStatus,
};