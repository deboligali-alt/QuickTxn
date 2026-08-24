interface NetworkLogoProps {
    network: string;
    size?: "sm" | "md" | "lg";
}

const networkConfig: Record<
    string,
    {
        name: string;
        bg: string;
        text: string;
        logo: string;
    }
> = {
    MTN: {
        name: "MTN",
        bg: "bg-yellow-400",
        text: "text-black",
        logo: "MTN",
    },

    GLO: {
        name: "Glo",
        bg: "bg-green-500",
        text: "text-white",
        logo: "Glo",
    },

    AIRTEL: {
        name: "Airtel",
        bg: "bg-red-600",
        text: "text-white",
        logo: "airtel",
    },

    "9MOBILE": {
        name: "9mobile",
        bg: "bg-green-700",
        text: "text-white",
        logo: "9",
    },
};

export default function NetworkLogo({
    network,
    size = "md",
}: NetworkLogoProps) {
    const config =
        networkConfig[network.toUpperCase()] ||
        networkConfig.MTN;

    const sizes = {
        sm: {
            container: "h-9 w-9",
            text: "text-xs",
        },
        md: {
            container: "h-12 w-12",
            text: "text-sm",
        },
        lg: {
            container: "h-16 w-16",
            text: "text-lg",
        },
    };

    const currentSize = sizes[size];

    return (
        <div
            className={`flex ${currentSize.container} shrink-0 items-center justify-center rounded-full ${config.bg} ${config.text} font-extrabold shadow-sm`}
        >
            <span className={currentSize.text}>
                {config.logo}
            </span>
        </div>
    );
}