require("dotenv").config();

const fs = require("fs");
const { pool } = require("./config/db");

const files = [
    ["mtn-plans.json", "MTN"],
    ["airtel-plans.json", "AIRTEL"],
    ["glo-plans.json", "GLO"],
    ["9mobile-plans.json", "9MOBILE"]
];

async function importPlans() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let total = 0;
        const seen = new Set();

        for (const [file, network] of files) {
            const plans = JSON.parse(
                fs.readFileSync(file, "utf8")
            );

            console.log(`${network}: ${plans.length} plans`);

            for (const plan of plans) {

                const key =
                    `${network}:${plan.variation_code}`;

                // Skip duplicate variation codes
                if (seen.has(key)) {
                    console.log(
                        `Skipping duplicate: ${network} ${plan.variation_code}`
                    );
                    continue;
                }

                seen.add(key);

                await client.query(
                    `INSERT INTO data_plans
                    (network, plan_name, plan_code, amount, is_active)
                    VALUES ($1, $2, $3, $4, TRUE)`,
                    [
                        network,
                        plan.name,
                        plan.variation_code,
                        Number(plan.amount)
                    ]
                );

                total++;
            }
        }

        await client.query("COMMIT");

        console.log("");
        console.log("IMPORT SUCCESSFUL");
        console.log("Total plans imported:", total);

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("");
        console.error("IMPORT FAILED");
        console.error(error.message);

    } finally {

        client.release();
        await pool.end();
    }
}

importPlans();