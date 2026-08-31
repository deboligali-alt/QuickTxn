"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    ShieldCheck,
    Upload,
    User,
    Calendar,
    CreditCard,
} from "lucide-react";
import { toast } from "sonner";

export default function KYCPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [bvn, setBvn] = useState("");
    const [idType, setIdType] = useState("NATIONAL_ID");
    const [idImage, setIdImage] = useState("");
    const [selfie, setSelfie] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await api.get("/user/profile");
            setFullName(res.data.data.full_name);
        };
        load();
    }, []);

    const toBase64 = (file: File, setter: (v: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result as string);
        reader.readAsDataURL(file);
    };

    const submitKYC = async () => {
        if (!dob || bvn.length !== 11 || !idImage || !selfie) {
            return toast.error("Complete all required fields");
        }

        try {
            setLoading(true);

            await api.post("/kyc/submit", {
                fullName,
                dob,
                bvn,
                idType,
                idImage,
                selfie,
            });

            toast.success("KYC submitted successfully");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={30} />
                        <div>
                            <p className="text-sm text-blue-100">
                                Identity Verification
                            </p>
                            <h1 className="text-2xl font-bold">KYC Verification</h1>
                        </div>
                    </div>
                </div>

                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Full Name
                            </label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />
                                <input
                                    readOnly
                                    value={fullName}
                                    className="w-full rounded-xl border bg-gray-100 p-3 pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <Calendar
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full rounded-xl border p-3 pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                BVN
                            </label>
                            <div className="relative">
                                <CreditCard
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />
                                <input
                                    maxLength={11}
                                    value={bvn}
                                    onChange={(e) =>
                                        setBvn(e.target.value.replace(/\D/g, ""))
                                    }
                                    placeholder="22123456789"
                                    className="w-full rounded-xl border p-3 pl-11"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                ID Type
                            </label>

                            <select
                                value={idType}
                                onChange={(e) => setIdType(e.target.value)}
                                className="w-full rounded-xl border p-3"
                            >
                                <option value="NATIONAL_ID">National ID</option>
                                <option value="DRIVERS_LICENSE">
                                    Driver's License
                                </option>
                                <option value="PASSPORT">International Passport</option>
                                <option value="VOTERS_CARD">Voter's Card</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Upload ID Card
                            </label>

                            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-5">
                                <Upload className="mb-2 text-gray-400" />
                                <span className="text-sm">
                                    {idImage ? "ID Selected" : "Choose Image"}
                                </span>

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files?.[0] &&
                                        toBase64(e.target.files[0], setIdImage)
                                    }
                                />
                            </label>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Selfie
                            </label>

                            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-5">
                                <Upload className="mb-2 text-gray-400" />
                                <span className="text-sm">
                                    {selfie ? "Selfie Selected" : "Choose Selfie"}
                                </span>

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files?.[0] &&
                                        toBase64(e.target.files[0], setSelfie)
                                    }
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={submitKYC}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white"
                    >
                        {loading ? "Submitting..." : "Submit Verification"}
                    </button>
                </div>
            </div>
        </main>
    );
}