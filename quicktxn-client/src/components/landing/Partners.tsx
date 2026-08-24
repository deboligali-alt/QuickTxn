export default function Partners() {
    const partners = [
        "MTN",
        "Airtel",
        "Glo",
        "9mobile",
        "SportyBet",
        "BetKing",
        "1xBet",
        "Bet9ja",
    ];

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-6">

                <h2 className="mb-10 text-center text-3xl font-bold">
                    Supported Networks & Betting Partners
                </h2>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8">

                    {partners.map((partner) => (
                        <div
                            key={partner}
                            className="rounded-2xl border bg-slate-50 p-5 text-center font-semibold shadow-sm transition hover:shadow-lg"
                        >
                            {partner}
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}