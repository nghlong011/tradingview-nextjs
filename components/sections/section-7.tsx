const heatmapFeatures = [
    'Grouping by sector with the ability to explore each one in detail',
    'A set of filters to refine your selection',
    'Sharing of your custom heatmaps',
    'View key stats of each instrument',
];

const screenerFeatures = [
    '70+ stock exchanges',
    'Four screeners: stock, forex, crypto pairs and coins',
    '100+ filter fields',
    'Multiple timeframes: from one minute to one month',
    'Go global: filter companies from all countries and industries in one list',
];

export default function Section7() {
    return (
        <section id="screeners" className="max-w-[1376px] w-full py-8 mx-auto flex flex-col gap-4 md:gap-6 px-4 lg:px-0">
            <div className="flex flex-col gap-4 items-center justify-center text-center">
                <h2 className="text-[#F4F4F4] font-semibold text-[36px] sm:text-[48px] md:text-[64px] leading-tight md:leading-[64px] uppercase">
                    Heatmap + Screen everything
                </h2>
                <p className="text-[#D0D3D7] text-[18px] sm:text-[22px] md:text-[28px] leading-snug md:leading-[40px] capitalize max-w-[90%] md:max-w-[80%]">
                    Compare symbols via different parameters and tools, all in real-time, to find your best trading opportunities.
                </p>
            </div>
            <div className="w-full bg-[#010101] border border-[#4A4A4A] rounded-[20px] md:rounded-[32px] p-4 sm:p-6 md:p-8">
                <div className="flex flex-col-reverse lg:flex-row gap-6 md:gap-8 lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-6 md:gap-8 items-start lg:max-w-[624px]">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white uppercase font-bold text-[32px] sm:text-[42px] md:text-[52px] leading-tight md:leading-[64px]">
                                Heatmap hots and nots
                            </h3>
                            <p className="text-[#B8B8B8] text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                                Get a bird's eye view of key asset classes: stocks, ETFs or crypto.
                            </p>
                            <div className="flex flex-col gap-4">
                                {heatmapFeatures.map((feature) => (
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
                        </div>
                        <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] max-w-[320px] w-full group cursor-pointer hover:scale-105">
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
                    </div>
                    <img src="/assets/card-D8G4kn5k.png" alt="" className="w-full lg:max-w-[624px] rounded-lg" />
                </div>
            </div>
            <div className="w-full bg-[#010101] border border-[#4A4A4A] rounded-[20px] md:rounded-[32px] p-4 sm:p-6 md:p-8">
                <div className="flex flex-col-reverse lg:flex-row-reverse gap-6 md:gap-8 lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-6 md:gap-8 items-start lg:max-w-[624px]">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white uppercase font-bold text-[32px] sm:text-[42px] md:text-[52px] leading-tight md:leading-[64px]">
                                Find anything with a simple scan
                            </h3>
                            <p className="text-[#B8B8B8] text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                                Filter assets based on criteria you specify. Look for the cheapest companies making the most
                                money, or which cryptocurrencies are performing strongest this month.
                            </p>
                            <div className="flex flex-col gap-4">
                                {screenerFeatures.map((feature) => (
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
                        </div>
                        <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] max-w-[320px] w-full group cursor-pointer hover:scale-105">
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
                    </div>
                    <img src="/assets/card2-DmPX_kMe.png" alt="" className="w-full lg:max-w-[624px] rounded-lg" />
                </div>
            </div>
        </section>
    );
}
