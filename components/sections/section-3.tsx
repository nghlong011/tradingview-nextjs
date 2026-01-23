const expertFeatures = [
    { name: '10 charts per tab', progress: '60%' },
    { name: '30 indicators per chart', progress: '55%' },
    { name: '25K historical bars', progress: '64%' },
    { name: '80 parallel chart connections', progress: '45%' },
    { name: '600 price alerts', progress: '62%' },
    { name: '600 technical alerts', progress: '60%' },
    { name: '10 watchlist alerts', progress: '68%' },
    { name: 'No ads' },
    { name: 'Volume profile' },
    { name: 'Custom timeframes' },
    { name: 'Custom Range Bars' },
    { name: 'Multiple watchlists' },
    { name: 'Bar Replay' },
    { name: 'Indicators on indicators' },
    { name: 'Chart data export' },
    { name: 'Intraday Renko, Kagi, Line Break, Point & Figure charts' },
    { name: 'Charts based on custom formulas' },
    { name: 'Time Price Opportunity' },
    { name: 'Volume footprint' },
    { name: 'Volume candles' },
    { name: 'Auto Chart Patterns' },
    { name: 'Second-based alerts' },
    { name: "Alerts that don't expire" },
    { name: 'Publishing invite-only scripts' },
    { name: 'Second-based intervals' },
    { name: 'Tick-based intervals (BETA)' },
    { name: 'Ability to buy professional market data' },
    { name: 'First priority support' },
];

const ultimateFeatures = [
    { name: '16 charts per tab', progress: '100%' },
    { name: '50 indicators per chart', progress: '100%' },
    { name: '40K historical bars', progress: '100%' },
    { name: '200 parallel chart connections', progress: '100%' },
    { name: '1,000 price alerts', progress: '100%' },
    { name: '1,000 technical alerts', progress: '100%' },
    { name: '15 watchlist alerts', progress: '100%' },
    { name: 'No ads' },
    { name: 'Volume profile' },
    { name: 'Custom timeframes' },
    { name: 'Custom Range Bars' },
    { name: 'Multiple watchlists' },
    { name: 'Bar Replay' },
    { name: 'Indicators on indicators' },
    { name: 'Chart data export' },
    { name: 'Intraday Renko, Kagi, Line Break, Point & Figure charts' },
    { name: 'Charts based on custom formulas' },
    { name: 'Time Price Opportunity' },
    { name: 'Volume footprint' },
    { name: 'Volume candles' },
    { name: 'Auto Chart Patterns' },
    { name: 'Second-based alerts' },
    { name: "Alerts that don't expire" },
    { name: 'Publishing invite-only scripts' },
    { name: 'Second-based intervals' },
    { name: 'Tick-based intervals (BETA)' },
    { name: 'Ability to buy professional market data' },
    { name: 'First priority support' },
];

export default function Section3() {
    return (
        <section id="pricing" className="w-full py-6 sm:py-8 md:py-12 lg:py-16 relative overflow-hidden">
            {/* Background Image */}
            <img src="/assets/bg-zhid4LPn.webp" className="w-full h-[490px] absolute top-0 left-0" alt="" />

            <div className="relative z-10 max-w-[1440px] w-full flex flex-col mx-auto gap-4 px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header Content */}
                <div className="p-2 sm:p-4 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
                    <h2 className="uppercase text-[#F4F4F4] font-semibold text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-tight md:leading-[64px]">
                        GET ULTIMATE FREE PLAN
                    </h2>
                    <p className="text-[#D0D3D7] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] leading-tight sm:leading-normal md:leading-[40px] max-w-3xl">
                        Get Full Access to TradingView with Annual Ultimate Plan for FREE
                    </p>
                </div>

                {/* Pricing Cards Container */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 items-stretch justify-center w-full px-2 sm:px-4">
                    {/* Expert Plan Card */}
                    <div className="w-full sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[480px] bg-black/60 border border-white/30 rounded-[20px] sm:rounded-[32px] backdrop-blur-xl py-6 sm:py-8 px-3 sm:px-4 flex flex-col gap-6 sm:gap-8">
                        <span className="text-center text-[#F4F4F4] font-semibold text-[24px] sm:text-[28px] leading-tight sm:leading-[36px]">
                            Expert
                        </span>

                        {/* Price Section */}
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <span className="text-[#9CA3AB] font-medium text-[20px] sm:text-[24px] md:text-[28px] leading-tight sm:leading-[32px]">
                                $1,199.40 / year
                            </span>
                            <div className="flex items-end gap-1">
                                <span className="text-[#F4F4F4] font-semibold text-[36px] sm:text-[42px] md:text-[48px] leading-tight sm:leading-[56px]">
                                    $99.95
                                </span>
                                <span className="text-[#9CA3AB] font-medium text-[20px] sm:text-[24px] md:text-[28px] leading-tight sm:leading-[32px]">
                                    / month
                                </span>
                            </div>
                        </div>

                        {/* Download Button */}
                        <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] group cursor-pointer hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600" />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                                style={{ filter: 'brightness(1.2)', mixBlendMode: 'soft-light' }}
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-500 ease-in-out opacity-20 -translate-x-full"
                                style={{ width: '50%', transform: 'translateX(-200%)' }}
                            />
                            <span className="relative z-10">Download for Windows</span>
                        </button>

                        {/* Features List */}
                        <div className="flex flex-col gap-3 sm:gap-4 w-full max-h-[60vh] md:max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {expertFeatures.map((feature) => (
                                <div key={feature.name} className="w-full flex items-start gap-2 sm:gap-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z"
                                            fill="#F4F4F4"
                                        />
                                    </svg>
                                    <div className="flex flex-col gap-2 w-full">
                                        <span className="text-[#D0D3D7] text-[14px] sm:text-[16px] md:text-[18px] leading-tight sm:leading-[24px] underline">
                                            {feature.name}
                                        </span>
                                        {feature.progress && (
                                            <div className="w-full rounded-[8px] bg-[#343639] h-1">
                                                <div
                                                    className="h-1 bg-white rounded-[8px]"
                                                    style={{ width: feature.progress }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ultimate Plan Card */}
                    <div className="w-full sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[480px] bg-black/60 border border-white/30 rounded-[20px] sm:rounded-[32px] backdrop-blur-xl py-6 sm:py-8 px-3 sm:px-4 flex flex-col gap-6 sm:gap-8">
                        <span className="text-center text-[#F4F4F4] font-semibold text-[24px] sm:text-[28px] leading-tight sm:leading-[36px]">
                            Ultimate
                        </span>

                        {/* Price Section */}
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <span className="text-[#9CA3AB] font-medium text-[20px] sm:text-[24px] md:text-[28px] leading-tight sm:leading-[32px] line-through">
                                $2,399.40 / year
                            </span>
                            <span className="text-[#F4F4F4] font-semibold text-[36px] sm:text-[42px] md:text-[48px] leading-tight sm:leading-[56px]">
                                Free
                            </span>
                        </div>

                        {/* Download Button */}
                        <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] group cursor-pointer hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600" />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                                style={{ filter: 'brightness(1.2)', mixBlendMode: 'soft-light' }}
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-500 ease-in-out opacity-20 -translate-x-full group-hover:translate-x-full"
                                style={{ width: '50%' }}
                            />
                            <span className="relative z-10">Download for Windows</span>
                        </button>

                        {/* Features List */}
                        <div className="flex flex-col gap-3 sm:gap-4 w-full max-h-[60vh] md:max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {ultimateFeatures.map((feature) => (
                                <div key={feature.name} className="w-full flex items-start gap-2 sm:gap-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z"
                                            fill="#F4F4F4"
                                        />
                                    </svg>
                                    <div className="flex flex-col gap-2 w-full">
                                        <span className="text-[#D0D3D7] text-[14px] sm:text-[16px] md:text-[18px] leading-tight sm:leading-[24px] underline">
                                            {feature.name}
                                        </span>
                                        {feature.progress && (
                                            <div className="w-full rounded-[8px] bg-[#343639] h-1">
                                                <div
                                                    className="h-1 bg-white rounded-[8px]"
                                                    style={{ width: feature.progress }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}