const fs = require("fs");

const files = [
    ["mtn-plans.json", "MTN"],
    ["airtel-plans.json", "AIRTEL"],
    ["glo-plans.json", "GLO"],
    ["9mobile-plans.json", "9MOBILE"]
];

const values = [];

for (const [file, network] of files) {
    const plans = JSON.parse(
        fs.readFileSync(file, "utf8")
    );

    for (const plan of plans) {
        const name = plan.name.replace(/'/g, "''");
        const code = plan.variation_code.replace(/'/g, "''");
        const amount = Number(plan.amount);

        values.push(
            `('${network}', '${name}', '${code}', ${amount}, TRUE)`
        );
    }
}

const sql = `INSERT INTO data_plans
(network, plan_name, plan_code, amount, is_active)
VALUES
${values.join(",\n")};
`;

fs.writeFileSync(
    "import-data-plans-single.sql",
    sql
);

console.log("Generated import-data-plans-single.sql");
console.log("Total plans:", values.length);