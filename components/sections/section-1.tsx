const features = [
    '16 charts per tab',
    '50 indicators per chart',
    '40K historical bars',
    '200 parallel chart connections',
    '1,000 price alerts',
    '1,000 technical alerts',
    '15 watchlist alerts',
    'No ads',
    'Volume profile',
    'Custom timeframes',
    'Custom Range Bars',
    'Multiple watchlists',
];

export default function Section1() {
    return (
        <section className="min-h-[400px] sm:min-h-[500px] md:min-h-[654px] gap-4 pt-20 relative w-full">
            <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-8">
                <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 w-full md:max-w-[640px]">
                    <div className="flex flex-col gap-4 md:gap-6 items-center md:items-start text-center md:text-left">
                        <h1 className="text-[#F4F4F4] font-bold text-3xl sm:text-4xl md:text-[44px] relative z-20 leading-tight md:leading-[52px]">
                            Get Full Access to
                            <br className="hidden sm:block" />
                            TradingView for FREE
                        </h1>
                        <p className="text-[#F4F4F4] text-sm sm:text-base md:text-[16px] relative z-20 leading-normal md:leading-[22px]">
                            Only in TradingView Desktop
                        </p>
                        <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] max-w-[256px] relative z-20 group cursor-pointer hover:scale-105">
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
                    </div>
                </div>
                <div className="w-full md:max-w-[720px] max-h-[580px] overflow-hidden flex items-center justify-center relative z-[10]">
                    <div className="w-full max-w-[300px] lg:max-w-[400px] mt-6 sm:mt-10 md:mt-40 bg-black/60 border border-white/30 border-b-0 rounded-t-[16px] sm:rounded-t-[20px] md:rounded-t-[32px] backdrop-blur-md py-4 sm:py-6 md:py-8 px-2 sm:px-3 flex flex-col gap-3 sm:gap-4">
                        <span className="text-center text-[#F4F4F4] font-semibold text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] leading-tight sm:leading-[36px]">
                            Only in TradingView Desktop
                        </span>

                        <div className="flex flex-col gap-1 sm:gap-2 items-center justify-center">
                            <span className="text-[#9CA3AB] font-medium text-[16px] xs:text-[18px] sm:text-[24px] md:text-[28px] leading-tight sm:leading-[32px] line-through">
                                $2,399.40 / Year
                            </span>
                            <span className="text-[#F4F4F4] font-semibold text-[28px] xs:text-[32px] sm:text-[42px] md:text-[48px] leading-tight sm:leading-[56px]">
                                Free
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center gap-1.5 sm:gap-2">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6 10L4 12L10 18L20 8L18 6L10 14L6 10Z"
                                            fill="#F4F4F4"
                                        />
                                    </svg>
                                    <span className="text-[#D0D3D7] text-[14px] xs:text-[15px] sm:text-[16px] md:text-[18px] leading-tight md:leading-[24px]">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <img
                src="/assets/bg-banner-CfSo3KW-.webp"
                className="absolute pointer-events-none bottom-0 w-full z-[12]"
                alt=""
            />
            <img
                src="/assets/banner-Bv7lTQIw.webp"
                className="absolute top-0 w-full h-full object-cover z-[9] pointer-events-none"
                alt=""
            />
        </section>
    );
}