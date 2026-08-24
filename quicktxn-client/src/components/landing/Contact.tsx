"use client";

import { useState } from "react";
import axios from "axios";
import { sendContactMessage } from "@/services/contact.service";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
} from "lucide-react";

export default function Contact() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {

            const response =
                await sendContactMessage(form);

            alert(response.message);

            setForm({
                fullName: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                alert(
                    error.response?.data?.message ??
                    "Unable to send message."
                );

            } else {

                alert("Unable to send message.");

            }

        }
    };
    return (
        <section
            id="contact"
            className="bg-slate-50 py-24"
        >
            <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

                {/* Left */}

                <div>

                    <span className="font-semibold text-green-600">
                        CONTACT US
                    </span>

                    <h2 className="mt-4 text-4xl font-bold">
                        Let's Get In Touch
                    </h2>

                    <p className="mt-5 text-slate-600">
                        Have questions or need assistance?
                        Our support team is always ready to help.
                    </p>

                    <div className="mt-10 space-y-8">

                        <Info
                            icon={<MapPin size={22} />}
                            title="Office Address"
                            value="Lagos, Nigeria"
                        />

                        <Info
                            icon={<Phone size={22} />}
                            title="Phone"
                            value="+234 915 324 9144"
                        />

                        <Info
                            icon={<Mail size={22} />}
                            title="Email"
                            value="ibrahimadebowale259@gmail.com"
                        />

                        <Info
                            icon={<Clock size={22} />}
                            title="Working Hours"
                            value="24 Hours Support"
                        />

                    </div>

                </div>

                {/* Right */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl bg-white p-8 shadow-xl space-y-5"
                >

                    <input
                        name="fullName"
                        placeholder="Full Name"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4"
                        required
                    />

                    <input
                        name="subject"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4"
                        required
                    />

                    <textarea
                        rows={6}
                        name="message"
                        placeholder="Write your message..."
                        value={form.message}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4"
                        required
                    />

                    <button
                        className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700"
                    >
                        Send Message
                    </button>

                </form>

            </div>
        </section>
    );
}

function Info({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="flex gap-4">

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
                {icon}
            </div>

            <div>

                <h3 className="font-bold">
                    {title}
                </h3>

                <p className="text-slate-600">
                    {value}
                </p>

            </div>

        </div>
    );
}