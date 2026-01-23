const chartTypes = [
    {
        name: 'Volume footprint',
        description:
            'Displays the distribution of trading volume at various price levels for each candlestick within a specified timeframe.',
        isActive: true,
    },
    { name: 'Time Price Opportunity' },
    { name: 'Session Volume Profile' },
    { name: 'Candles' },
    { name: 'Bars' },
    { name: 'Volume Candles' },
    { name: 'Range' },
    { name: 'Heikin Ashi' },
    { name: 'Renko' },
    { name: 'Line Break' },
    { name: 'Point & Figure' },
    { name: 'Kagi' },
    { name: 'Area' },
    { name: 'HLC Area' },
    { name: 'Baseline' },
    { name: 'Line' },
    { name: 'Step Line' },
    { name: 'Line With Markers' },
    { name: 'High-Low' },
    { name: 'Columns' },
    { name: 'Hollow Candles' },
];

export default function Section4() {
    return (
        <section id="charts" className="w-full mx-auto flex flex-col gap-4 max-w-[1376px] px-4 lg:px-0">
            {/* Header Content */}
            <div className="flex flex-col gap-4 items-center justify-center text-center">
                <h2 className="text-[#F4F4F4] font-semibold text-[36px] md:text-[64px] leading-[1.2] md:leading-[64px] uppercase">
                    Charts that move markets
                </h2>
                <p className="text-[#D0D3D7] text-[18px] md:text-[28px] leading-[1.4] md:leading-[40px] capitalize">
                    Whether you'd like to simply look up the latest stock price, or analyze price patterns with lengthy
                    scripts — we got you covered.
                </p>
            </div>

            {/* Main Content Container */}
            <div className="w-full border border-[#4A4A4A] rounded-[20px] md:rounded-[32px] bg-[#010101] p-4 md:p-8 flex flex-col gap-4">
                {/* Chart Types List and Preview */}
                <div className="w-full flex flex-col md:flex-row h-auto md:h-[510px] relative">
                    {/* Chart Types List */}
                    <div
                        className="max-w-[692px] w-full flex flex-col pb-10 gap-4 relative overflow-y-auto scrollbar-none"
                        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
                    >
                        {chartTypes.map((type) => (
                            <div key={type.name} className="flex flex-col gap-1">
                                <h3
                                    className={`font-bold text-[48px] leading-[56px] capitalize ${
                                        type.isActive ? 'text-white' : 'text-[#8C8C8C]'
                                    }`}
                                >
                                    {type.name}
                                </h3>
                                {type.description && (
                                    <p className="text-[#B8B8B8] text-[18px] leading-[24px]">{type.description}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Background Decoration */}
                    <img src="/assets/bg-CcdiIsyU.png" className="absolute bottom-0 w-1/2 pointer-events-none" alt="" />

                    {/* Chart Preview */}
                    <div className="max-w-[620px] h-full relative">
                        <img
                            src="/assets/volume-footprint-D8HjHDQ1.webp"
                            className="w-full h-full object-contain mix-blend-exclusion"
                            alt="Volume footprint"
                        />
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="w-full flex justify-center md:justify-end">
                    <div className="flex gap-2">
                        {/* Page Navigation */}
                        <div className="flex items-center gap-2">
                            <button className="bg-[#08090E] rounded-[8px] size-6 flex items-center justify-center hover:bg-[#1a1b21] transition-colors">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                        d="M7.04097 0.75L2.25 6L7.04097 11.25L8.25 10.3008L4.3258 6L8.25 1.6992L7.04097 0.75Z"
                                        fill="white"
                                    />
                                </svg>
                            </button>
                            <span className="text-white text-[16px] sm:text-[18px] leading-[24px]">1/21</span>
                            <button className="bg-[#08090E] rounded-[8px] size-6 flex items-center justify-center hover:bg-[#1a1b21] transition-colors">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                        d="M4.95903 0.75L9.75 6L4.95903 11.25L3.75 10.3008L7.6742 6L3.75 1.6992L4.95903 0.75Z"
                                        fill="white"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Auto-play Button */}
                        <button className="bg-[#08090E] rounded-[8px] size-6 flex items-center justify-center hover:bg-[#1a1b21] transition-colors relative group">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M6 10.4758V5.52451C6 5.36095 6.05422 5.23028 6.16267 5.13251C6.27067 5.03473 6.39689 4.98584 6.54133 4.98584C6.58667 4.98584 6.634 4.99206 6.68333 5.00451C6.73222 5.01651 6.77911 5.03495 6.824 5.05984L10.7193 7.54851C10.802 7.60628 10.8642 7.67251 10.906 7.74717C10.9473 7.8214 10.968 7.90562 10.968 7.99984C10.968 8.09406 10.9473 8.17828 10.906 8.25251C10.8647 8.32673 10.8024 8.39295 10.7193 8.45117L6.824 10.9398C6.77911 10.9643 6.73178 10.9827 6.682 10.9952C6.63222 11.0076 6.58489 11.0138 6.54 11.0138C6.39511 11.0138 6.26889 10.965 6.16133 10.8672C6.05378 10.7694 6 10.639 6 10.4758Z"
                                    fill="white"
                                />
                            </svg>
                            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-8 left-1/2 -translate-x-1/2 bg-[#1a1b21] text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                Start auto-play
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
