"use client";

import { useState } from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

const exams = [
    { id: "waec", name: "WAEC" },
    { id: "neco", name: "NECO" },
];

export default function WaecPage() {
    const router = useRouter();

    const [exam, setExam] = useState("waec");
    const [examNumber, setExamNumber] = useState("");
    const [examYear, setExamYear] = useState("2026");

    const continueCheck = () => {
        if (!examNumber || !examYear) {
            alert("Complete all fields");
            return;
        }

        sessionStorage.setItem(
            "waec",
            JSON.stringify({
                exam,
                examNumber,
                examYear,
            })
        );

        router.push("/waec/confirm");
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4">
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 className="mb-6 text-2xl font-bold">
                Result Checker
            </h1>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <GraduationCap size={30} />
                    <div>
                        <p className="text-sm text-blue-100">
                            Check Results
                        </p>
                        <h2 className="text-xl font-bold">
                            WAEC & NECO
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Examination
                    </label>

                    <select
                        value={exam}
                        onChange={(e) => setExam(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4"
                    >
                        {exams.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Exam Number
                    </label>

                    <input
                        value={examNumber}
                        onChange={(e) => setExamNumber(e.target.value)}
                        placeholder="412345678901"
                        className="w-full rounded-2xl border bg-white p-4"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Exam Year
                    </label>

                    <input
                        value={examYear}
                        onChange={(e) => setExamYear(e.target.value)}
                        placeholder="2026"
                        className="w-full rounded-2xl border bg-white p-4"
                    />
                </div>
            </div>

            <button
                onClick={continueCheck}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white"
            >
                Continue
            </button>
        </main>
    );
}