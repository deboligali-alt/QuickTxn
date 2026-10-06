const classifyPlan = (plan) => {
    const name = String(plan?.name || "").toLowerCase();

    // Never allow Gifting, even if the name also contains
    // "Social" or "Awoof".
    if (name.includes("[gifting]")) {
        return "GIFTING";
    }

    if (name.includes("[corporate]")) {
        return "CORPORATE";
    }

    if (
        name.includes("[social]") ||
        name.includes("[soclai]")
    ) {
        return "SOCIAL";
    }

    if (
        name.includes("[awoof]") ||
        name.includes("awoof")
    ) {
        return "AWOOF";
    }

    if (
        name.includes("broadband") ||
        name.includes("fibre") ||
        name.includes("fibrex") ||
        name.includes("unlimited")
    ) {
        return "BROADBAND";
    }

    if (name.includes("thryve")) {
        return "THRYVE";
    }

    if (name.includes("[special]")) {
        return "SPECIAL";
    }

    // Products that should not appear as normal mobile data.
    if (
        name.includes("router") ||
        name.includes("flexi")
    ) {
        return "OTHER";
    }

    return "NORMAL";
};


const isAllowedQuickTxnPlan = (plan) => {
    const category = classifyPlan(plan);

    return (
        category === "NORMAL" ||
        category === "SOCIAL" ||
        category === "AWOOF"
    );
};


module.exports = {
    classifyPlan,
    isAllowedQuickTxnPlan,
};