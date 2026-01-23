import GradientButton from '@/components/ui/gradient-button';

export default function Footer() {
    return (
        <footer className="w-full bg-black py-8 sm:py-12 md:py-[75px] px-4 sm:px-6 md:px-8">
            <div className="max-w-[1250px] w-full mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-4">
                {/* Left Section */}
                <div className="w-full lg:max-w-[493px] flex flex-col gap-4 sm:gap-6 md:gap-[25px]">
                    <span className="text-white font-bold text-[16px] leading-[19.2px]">Trading View</span>

                    <p className="text-[#888888] text-[14px] sm:text-[16px] leading-tight sm:leading-[19.2px] max-w-[90%] sm:max-w-full">
                        You are the ideal choice for commission free encrypted trading and maximum analytical capabilities.
                    </p>

                    <GradientButton text="Download for Windows" />
                </div>

                {/* Right Section */}
                <div className="w-full lg:max-w-[321px] flex flex-col lg:items-end gap-6 md:gap-[25px]">
                    <a
                        href="mailto:support@tradingview.com"
                        className="border border-[#3D3D3D] rounded-[8px] py-[10px] px-[15px] flex items-center gap-2.5 group transition-colors duration-300 hover:border-[#4a4a4a] hover:bg-[#1a1a1a] w-fit"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="group-hover:stroke-white transition-colors duration-300"
                        >
                            <path
                                d="M16 8.00036V13.0004C16 13.796 16.3161 14.5591 16.8787 15.1217C17.4413 15.6843 18.2044 16.0004 19 16.0004C19.7957 16.0004 20.5587 15.6843 21.1213 15.1217C21.6839 14.5591 22 13.796 22 13.0004V12.0004C21.9999 9.74339 21.2362 7.55283 19.8333 5.78489C18.4303 4.01694 16.4706 2.77558 14.2726 2.26265C12.0747 1.74973 9.76794 1.9954 7.72736 2.95972C5.68677 3.92405 4.03241 5.55031 3.03327 7.57408C2.03413 9.59785 1.74898 11.9001 2.22418 14.1065C2.69938 16.3128 3.90699 18.2936 5.65064 19.7266C7.39429 21.1597 9.57144 21.9607 11.8281 21.9995C14.0847 22.0383 16.2881 21.3126 18.08 19.9404M16 12.0004C16 14.2095 14.2092 16.0004 12 16.0004C9.79087 16.0004 8.00001 14.2095 8.00001 12.0004C8.00001 9.79122 9.79087 8.00036 12 8.00036C14.2092 8.00036 16 9.79122 16 12.0004Z"
                                stroke="#6D6D6D"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-white font-medium text-[14px] sm:text-[16px] leading-tight sm:leading-[19.2px]">
                            support@tradingview.com
                        </span>
                    </a>

                    <div className="flex gap-4 sm:gap-[25px] flex-wrap items-center justify-center">
                        <a
                            href="https://www.tradingview.com/about/"
                            className="text-white text-[16px] sm:text-[18px] leading-tight sm:leading-[21.6px] hover:text-gray-300 transition-colors duration-300"
                        >
                            About Us
                        </a>
                        <a
                            href="https://www.tradingview.com/privacy-policy/"
                            className="text-white text-[16px] sm:text-[18px] leading-tight sm:leading-[21.6px] hover:text-gray-300 transition-colors duration-300"
                        >
                            Privacy Policy
                        </a>
                    </div>

                    <p className="text-[#6D6D6D] text-center text-[14px] sm:text-[16px] leading-tight sm:leading-[19.2px] lg:text-right">
                        Copyright © 2025
                        <br />
                        © 2025 TradingView, Inc.
                    </p>
                </div>
            </div>
        </footer>
    );
}
