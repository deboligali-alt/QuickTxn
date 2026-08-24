"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getPublicTestimonials } from "@/services/public.service";

interface Testimonial {
    id: string;
    name: string;
    location: string;
    message: string;
    rating: number;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                const response = await getPublicTestimonials();
                setTestimonials(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        loadTestimonials();
    }, []);

    return (
        <section
            id="testimonials"
            className="bg-slate-50 py-24"
        >
            <div className="mx-auto max-w-7xl px-6">

                <div className="mb-16 text-center">

                    <span className="font-semibold text-green-600">
                        TESTIMONIALS
                    </span>

                    <h2 className="mt-4 text-4xl font-bold">
                        What Our Customers Say
                    </h2>

                    <p className="mt-4 text-slate-600">
                        Thousands of Nigerians trust QuickTxn every day.
                    </p>

                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                        >

                            <div className="mb-5 flex gap-1 text-yellow-500">
                                {Array.from({ length: item.rating }).map((_, index) => (
                                    <Star
                                        key={index}
                                        size={20}
                                        fill="currentColor"
                                    />
                                ))}
                            </div>

                            <p className="leading-8 text-slate-600">
                                "{item.message}"
                            </p>

                            <div className="mt-8">

                                <h3 className="font-bold">
                                    {item.name}
                                </h3>

                                <p className="text-slate-500">
                                    {item.location}
                                </p>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}