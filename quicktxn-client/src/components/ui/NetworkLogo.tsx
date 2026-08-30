interface NetworkLogoProps {
    network: string;
    size?: "sm" | "md" | "lg";
}

export default function NetworkLogo({
    network,
    size = "md",
}: NetworkLogoProps) {
    const sizes = {
        sm: "36",
        md: "48",
        lg: "64",
    };

    const iconSize = Number(sizes[size]);

    const renderLogo = () => {
        switch (network.toUpperCase()) {
            case "MTN":
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
                        <rect width="64" height="64" rx="18" fill="#FFD400" />
                        <ellipse
                            cx="32"
                            cy="32"
                            rx="22"
                            ry="14"
                            fill="#0057B8"
                        />
                        <text
                            x="32"
                            y="37"
                            fontSize="13"
                            fontWeight="700"
                            fill="white"
                            textAnchor="middle"
                            fontFamily="Arial"
                        >
                            MTN
                        </text>
                    </svg>
                );

            case "AIRTEL":
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
                        <rect width="64" height="64" rx="18" fill="#E60012" />
                        <path
                            d="M18 34c8-18 28-18 28 0-6-3-12 2-18 10"
                            stroke="white"
                            strokeWidth="5"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                );

            case "GLO":
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
                        <rect width="64" height="64" rx="18" fill="#0AA84F" />
                        <circle
                            cx="32"
                            cy="32"
                            r="20"
                            fill="#079444"
                            stroke="white"
                            strokeWidth="2"
                        />
                        <text
                            x="32"
                            y="38"
                            fontSize="18"
                            fontWeight="700"
                            fill="white"
                            textAnchor="middle"
                            fontFamily="Arial"
                        >
                            glo
                        </text>
                    </svg>
                );

            case "9MOBILE":
                return (
                    <svg width={iconSize} height="64" viewBox="0 0 64 64">
                        <rect width="64" height="64" rx="18" fill="#111827" />
                        <circle cx="32" cy="32" r="20" fill="#B7F000" />
                        <text
                            x="32"
                            y="38"
                            fontSize="22"
                            fontWeight="700"
                            fill="#111827"
                            textAnchor="middle"
                            fontFamily="Arial"
                        >
                            9
                        </text>
                    </svg>
                );

            default:
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 64 64">
                        <rect width="64" height="64" rx="18" fill="#D1D5DB" />
                    </svg>
                );
        }
    };

    return renderLogo();
}