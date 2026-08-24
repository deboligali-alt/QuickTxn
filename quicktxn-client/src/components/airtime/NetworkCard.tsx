import Image from "next/image";

interface Props {
    image: string;
    name: string;
    selected: boolean;
    onClick: () => void;
}

export default function NetworkCard({
    image,
    name,
    selected,
    onClick,
}: Props) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`flex flex-col items-center justify-center rounded-2xl border p-5 transition ${selected
                    ? "border-green-600 bg-green-50"
                    : "hover:border-green-400"
                }`}
        >
            <Image
                src={image}
                alt={name}
                width={60}
                height={60}
            />

            <span className="mt-3 font-semibold">
                {name}
            </span>
        </button>
    );
}