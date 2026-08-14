const { pool } = require("../config/db");

// ========================================
// Get All Data Plans
// ========================================
const getAllDataPlans = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                id,
                network,
                plan_name,
                plan_code,
                amount,
                is_active
            FROM data_plans
            ORDER BY
                network ASC,
                amount ASC
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
// Create Data Plan
// ========================================
// ========================================
// Create Data Plan
// ========================================
const createDataPlan = async (req, res) => {

    const {
        network,
        plan_name,
        plan_code,
        amount,
    } = req.body;

    if (!network || !plan_name || !plan_code || !amount) {
        return res.status(400).json({
            success: false,
            message: "Network, plan name, plan code and amount are required.",
        });
    }

    try {

        // Check if plan code already exists
        const existingPlan = await pool.query(
            `SELECT id
             FROM data_plans
             WHERE plan_code = $1`,
            [plan_code.toUpperCase()]
        );

        if (existingPlan.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Plan code already exists.",
            });
        }

        const result = await pool.query(
            `INSERT INTO data_plans
            (
                network,
                plan_name,
                plan_code,
                amount,
                is_active
            )
            VALUES
            ($1, $2, $3, $4, TRUE)
            RETURNING *`,
            [
                network.toUpperCase(),
                plan_name,
                plan_code.toUpperCase(),
                amount,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Data plan created successfully.",
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
// Update Data Plan
// ========================================
// ========================================
// Update Data Plan
// ========================================
const updateDataPlan = async (req, res) => {

    const { id } = req.params;

    const {
        network,
        plan_name,
        plan_code,
        amount,
        is_active,
    } = req.body;

    try {

        // Check if the plan exists
        const existingPlan = await pool.query(
            `SELECT id
             FROM data_plans
             WHERE id = $1`,
            [id]
        );

        if (existingPlan.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        const result = await pool.query(
            `UPDATE data_plans
             SET
                network = $1,
                plan_name = $2,
                plan_code = $3,
                amount = $4,
                is_active = $5
             WHERE id = $6
             RETURNING *`,
            [
                network.toUpperCase(),
                plan_name,
                plan_code.toUpperCase(),
                amount,
                is_active,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Data plan updated successfully.",
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
// Delete Data Plan
// ========================================
// ========================================
// Delete Data Plan
// ========================================
const deleteDataPlan = async (req, res) => {

    const { id } = req.params;

    try {

        const existingPlan = await pool.query(
            `SELECT id
             FROM data_plans
             WHERE id = $1`,
            [id]
        );

        if (existingPlan.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        await pool.query(
            `DELETE
             FROM data_plans
             WHERE id = $1`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Data plan deleted successfully.",
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
// Toggle Data Plan Status
// ========================================
// ========================================
// Toggle Data Plan Status
// ========================================
const toggleDataPlanStatus = async (req, res) => {

    const { id } = req.params;

    try {

        const existingPlan = await pool.query(
            `SELECT
                id,
                is_active
             FROM data_plans
             WHERE id = $1`,
            [id]
        );

        if (existingPlan.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        const currentStatus = existingPlan.rows[0].is_active;

        const result = await pool.query(
            `UPDATE data_plans
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
            message: `Data plan ${!currentStatus ? "activated" : "deactivated"} successfully.`,
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
    getAllDataPlans,
    createDataPlan,
    updateDataPlan,
    deleteDataPlan,
    toggleDataPlanStatus,
};