export default function Section2() {
    return (
        <section className="max-w-[1376px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center text-center">
                <h2 className="text-[#F4F4F4] font-semibold text-[28px] sm:text-4xl md:text-5xl lg:text-[64px] leading-tight lg:leading-[64px] uppercase">
                    TradingView Desktop
                </h2>
                <p className="text-[#D0D3D7] text-base sm:text-lg md:text-2xl lg:text-[28px] leading-normal lg:leading-[40px] capitalize max-w-[90%] md:max-w-[80%] lg:max-w-none">
                    Experience extra power, extra speed and extra flexibility,
                    <br className="hidden sm:block" />
                    all with the same UX you know and love.
                </p>
            </div>
            <div className="w-full mt-4 sm:mt-6">
                <div
                    className="overflow-hidden w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[795px]"
                    style={{ position: 'relative', cursor: 'grab' }}
                >
                    <div
                        className="h-full w-0.5 absolute top-0 m-auto z-30 bg-[#1F1F1F]"
                        style={{ left: '98.44%', top: 0, zIndex: 40 }}
                    >
                        <div className="h-8 w-16 rounded-[8px] top-1/2 gap-4 -translate-y-1/2 bg-[#1F1F1F] z-30 -right-[30px] absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.38796 1L3 8L9.38796 15L11 13.7344L5.76773 8L11 2.2656L9.38796 1Z"
                                    fill="#B2B5BE"
                                />
                            </svg>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.61204 1L13 8L6.61204 15L5 13.7344L10.2323 8L5 2.2656L6.61204 1Z"
                                    fill="#B2B5BE"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
                        <div className="absolute inset-0 z-20 rounded-2xl flex-shrink-0 w-full h-full select-none overflow-hidden object-cover object-left-top">
                            <img
                                alt="first image"
                                src="/assets/image1-9pSQF0zu.webp"
                                className="absolute inset-0 z-20 rounded-2xl flex-shrink-0 w-full h-full select-none object-cover object-left-top"
                                draggable={false}
                            />
                        </div>
                    </div>
                    <img
                        className="absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none object-cover object-left-top"
                        alt="second image"
                        src="/assets/image2-CoMllWq3.webp"
                        draggable={false}
                    />
                </div>
            </div>
        </section>
    );
}
