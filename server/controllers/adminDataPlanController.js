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
                plan_type,
                plan_name,
                plan_code,
                amount,
                is_active
            FROM data_plans
            ORDER BY network ASC, amount ASC
        `);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ========================================
// Create Data Plan
// ========================================
const createDataPlan = async (req, res) => {
    const {
        network,
        plan_type,
        plan_name,
        plan_code,
        amount,
    } = req.body;

    if (
        !network ||
        !plan_type ||
        !plan_name ||
        !plan_code ||
        !amount
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        const exists = await pool.query(
            `SELECT id FROM data_plans WHERE plan_code=$1`,
            [plan_code.toUpperCase()]
        );

        if (exists.rows.length) {
            return res.status(409).json({
                success: false,
                message: "Plan code already exists.",
            });
        }

        const result = await pool.query(
            `INSERT INTO data_plans
            (
                network,
                plan_type,
                plan_name,
                plan_code,
                amount,
                is_active
            )
            VALUES ($1,$2,$3,$4,$5,TRUE)
            RETURNING *`,
            [
                network.toUpperCase(),
                plan_type,
                plan_name,
                plan_code.toUpperCase(),
                amount,
            ]
        );

        res.status(201).json({
            success: true,
            message: "Data plan created successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ========================================
// Update Data Plan
// ========================================
const updateDataPlan = async (req, res) => {
    const { id } = req.params;

    const {
        network,
        plan_type,
        plan_name,
        plan_code,
        amount,
        is_active,
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE data_plans
             SET network=$1,
                 plan_type=$2,
                 plan_name=$3,
                 plan_code=$4,
                 amount=$5,
                 is_active=$6
             WHERE id=$7
             RETURNING *`,
            [
                network.toUpperCase(),
                plan_type,
                plan_name,
                plan_code.toUpperCase(),
                amount,
                is_active,
                id,
            ]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        res.json({
            success: true,
            message: "Data plan updated successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ========================================
// Delete Data Plan
// ========================================
const deleteDataPlan = async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM data_plans
             WHERE id=$1
             RETURNING id`,
            [req.params.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        res.json({
            success: true,
            message: "Data plan deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ========================================
// Toggle Status
// ========================================
const toggleDataPlanStatus = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE data_plans
             SET is_active = NOT is_active
             WHERE id=$1
             RETURNING *`,
            [req.params.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        res.json({
            success: true,
            message: "Plan status updated.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
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