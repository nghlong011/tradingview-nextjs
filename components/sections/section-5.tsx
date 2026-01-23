const technicalFeatures = [
    '400+ built-in indicators and strategies',
    '100,000+ public indicators',
    '110+ smart drawing tools',
    'Volume Profile indicators',
    'Candlestick patterns recognition',
    'Multi-timeframe analysis',
    'Auto Chart Patterns',
];

const barReplayFeatures = [
    'Simulated trading on historical data',
    '4 replay speeds',
    'Autoplay and step-by-step mode',
    'You can also apply drawing objects and indicators',
    'Synchronized multi-chart replay',
    'Trading on historical data',
    'In-depth historical data by the minute and by the second',
];

export default function Section5() {
    return (
        <section className="w-full mx-auto flex flex-col lg:flex-row gap-4 py-8 max-w-[1376px] mt-4 px-4 lg:px-0">
            {/* Technical Analysis Card */}
            <div className="bg-[#010101] border border-[#4A4A4A] rounded-[20px] md:rounded-[32px] p-4 sm:p-6 md:p-8 flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-4 w-full h-full">
                    <h2 className="text-white font-bold uppercase text-[32px] sm:text-[42px] md:text-[52px] leading-tight md:leading-[64px]">
                        Technical analysis, done right
                    </h2>
                    <p className="text-[#B8B8B8] text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                        Our platform comes with hundreds of built-in indicators and strategies, intelligent drawing tools and tools
                        for in-depth market analysis covering the most popular trading concepts
                    </p>

                    {/* Features List */}
                    <div className="w-full flex flex-col gap-3 md:gap-4">
                        {technicalFeatures.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 md:w-7 md:h-7"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M23.707 9.70692C23.8892 9.51832 23.99 9.26571 23.9877 9.00352C23.9854 8.74132 23.8803 8.49051 23.6949 8.3051C23.5095 8.11969 23.2586 8.01452 22.9964 8.01224C22.7342 8.00997 22.4816 8.11076 22.293 8.29292L12 18.5859L7.70704 14.2929C7.51844 14.1108 7.26584 14.01 7.00364 14.0122C6.74144 14.0145 6.49063 14.1197 6.30522 14.3051C6.11981 14.4905 6.01465 14.7413 6.01237 15.0035C6.01009 15.2657 6.11088 15.5183 6.29304 15.7069L11.293 20.7069L12 21.4139L12.707 20.7069L23.707 9.70692Z"
                                        fill="#787B86"
                                    />
                                </svg>
                                <span className="text-white text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Card Image */}
                    <img src="/assets/card1-BBXG8rGa.webp" alt="Technical Analysis" className="w-full rounded-lg !mt-auto" />
                </div>
            </div>

            {/* Bar Replay Card */}
            <div className="bg-[#010101] border border-[#4A4A4A] rounded-[20px] md:rounded-[32px] p-4 sm:p-6 md:p-8 flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-4 w-full h-full">
                    <h2 className="text-white font-bold uppercase text-[32px] sm:text-[42px] md:text-[52px] leading-tight md:leading-[64px]">
                        <span className="block">Bar</span>
                        <span className="block">Replay</span>
                    </h2>
                    <p className="text-[#B8B8B8] text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                        Watch how pricing data unfolded historically. Rewind markets and review at a speed and resolution you
                        desire.
                    </p>

                    {/* Features List */}
                    <div className="w-full flex flex-col gap-3 md:gap-4">
                        {barReplayFeatures.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 md:w-7 md:h-7"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M23.707 9.70692C23.8892 9.51832 23.99 9.26571 23.9877 9.00352C23.9854 8.74132 23.8803 8.49051 23.6949 8.3051C23.5095 8.11969 23.2586 8.01452 22.9964 8.01224C22.7342 8.00997 22.4816 8.11076 22.293 8.29292L12 18.5859L7.70704 14.2929C7.51844 14.1108 7.26584 14.01 7.00364 14.0122C6.74144 14.0145 6.49063 14.1197 6.30522 14.3051C6.11981 14.4905 6.01465 14.7413 6.01237 15.0035C6.01009 15.2657 6.11088 15.5183 6.29304 15.7069L11.293 20.7069L12 21.4139L12.707 20.7069L23.707 9.70692Z"
                                        fill="#787B86"
                                    />
                                </svg>
                                <span className="text-white text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Card Image */}
                    <img src="/assets/card2-BoRW3VmU.webp" alt="Bar Replay" className="w-full rounded-lg !mt-auto" />
                </div>
            </div>
        </section>
    );
}
