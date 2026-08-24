"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "How does Airtime to Cash work?",
        answer:
            "Simply choose your network, enter the airtime amount, submit your request and follow the transfer instructions. Once confirmed, your wallet is credited.",
    },
    {
        question: "How long does payment take?",
        answer:
            "Most transactions are completed within a few minutes after successful verification.",
    },
    {
        question: "Which networks are supported?",
        answer:
            "QuickTxn currently supports MTN, Airtel, Glo and 9mobile.",
    },
    {
        question: "Can I fund my betting account?",
        answer:
            "Yes. You can fund supported betting wallets directly from your QuickTxn wallet.",
    },
    {
        question: "Is QuickTxn secure?",
        answer:
            "Yes. All transactions are protected and user information is handled securely.",
    },
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section
            id="faq"
            className="bg-slate-50 py-24"
        >
            <div className="mx-auto max-w-4xl px-6">

                <div className="mb-14 text-center">

                    <span className="font-semibold text-green-600">
                        FAQ
                    </span>

                    <h2 className="mt-4 text-4xl font-bold">
                        Frequently Asked Questions
                    </h2>

                    <p className="mt-4 text-slate-600">
                        Find answers to the most common questions about
                        QuickTxn.
                    </p>

                </div>

                <div className="space-y-5">

                    {faqs.map((faq, index) => (

                        <div
                            key={faq.question}
                            className="rounded-2xl bg-white shadow"
                        >

                            <button
                                onClick={() =>
                                    setOpen(open === index ? null : index)
                                }
                                className="flex w-full items-center justify-between p-6 text-left"
                            >

                                <span className="text-lg font-semibold">
                                    {faq.question}
                                </span>

                                {open === index ? (
                                    <ChevronUp />
                                ) : (
                                    <ChevronDown />
                                )}

                            </button>

                            {open === index && (

                                <div className="border-t px-6 pb-6 pt-4 text-slate-600">

                                    {faq.answer}

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>
        </section>
    );
}