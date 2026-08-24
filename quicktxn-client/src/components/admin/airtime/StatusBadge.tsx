interface Props {
    status: string;
}

export default function StatusBadge({
    status,
}: Props) {

    const colors: Record<string, string> = {
        Pending: "bg-yellow-100 text-yellow-700",
        Approved: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
        "Wallet Credited":
            "bg-blue-100 text-blue-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${colors[status] ||
                "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
}