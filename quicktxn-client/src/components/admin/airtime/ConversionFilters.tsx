"use client";

const filters = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
];

interface ConversionFiltersProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ConversionFilters({
    value,
    onChange,
}: ConversionFiltersProps) {
    return (
        <div className="flex flex-wrap gap-3">

            {filters.map((filter) => {

                const active = value === filter;

                return (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => onChange(filter)}
                        className={`rounded-full border px-5 py-2 transition ${active
                                ? "border-green-600 bg-green-600 text-white"
                                : "bg-white hover:bg-green-600 hover:text-white"
                            }`}
                    >
                        {filter}
                    </button>
                );

            })}

        </div>
    );
}