import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const stats = [
    {
        value: '90M+',
        label: 'Traders and investors use our platform.',
        icon: '/assets/circle-G3Q9hXrm.svg',
        iconPosition: 'left-1/3',
    },
    {
        value: '#1',
        label: 'Top website in the world when it comes to all things investing.',
        icon: '/assets/square.svg',
        iconPosition: 'left-[18%]',
    },
    {
        value: '1.5M+',
        label: 'Mobile reviews with 4.9 average rating. No other fintech apps are more loved.',
        icon: '/assets/star-B4kjBhxh.svg',
        iconPosition: 'left-[41%]',
    },
    {
        value: '10M+',
        label: 'Custom scripts and ideas shared by our users.',
        icon: '/assets/pine-LcY6WRkB.svg',
        iconPosition: 'left-[39%]',
    },
];

const testimonials = [
    {
        image: '/assets/card1-Dy4Agw-G.png',
        author: '@mytradingsetup',
        text: 'The desktop app is lightning fast! No more browser lag—just smooth charting and trading.',
    },
    {
        image: '/assets/card2-KbxLObpx.png',
        author: '@chrislowingproducer',
        text: 'Transitioning to more online trading is awesome. Thanks for all the tools analyzing charts.',
    },
    {
        image: '/assets/card3-BeIKNzDl.png',
        author: '@spacedork',
        text: 'The split-screen feature is a game-changer! Multiple timeframes at once without switching tabs.',
    },
    {
        image: '/assets/card4-CW9P8Sxo.png',
        author: '@joey_official',
        text: 'Finally! A one-stop trading app that works. I can stay immersed in my research without a break.',
    },
    {
        image: '/assets/card5-CDKoVC78.png',
        author: '@orly_summerz',
        text: "TradingView's Desktop has completely changed my workflow! Trade faster and analyze better!",
    },
    {
        image: '/assets/card6-NCULFrcu.png',
        author: '@tradingView',
        text: 'My trading lifestyle is smoother than ever. No distractions, just clean professional charts.',
    },
    {
        image: '/assets/card7-BwsRTy0f.png',
        author: '@globaltrillary',
        text: 'Real-time updates and no browser crashes! TradingView Desktop is a must-have!',
    },
    {
        image: '/assets/card8-CsE_qImb.png',
        author: '@tunccoms',
        text: 'I can customize my setup exactly how I want. TradingView Desktop keeps my life easy!',
    },
    {
        image: '/assets/card9-DQ1V_ux0.png',
        author: '@most_luxurious_lifestyle',
        text: "Not just a powerful charting terminal, but with TradingView's ease of use. Perfect combo!",
    },
    {
        image: '/assets/card10-BED51rVw.png',
        author: '@TRzustan',
        text: 'With TradingView Desktop, I execute trades faster and stay ahead of the market!',
    },
    {
        image: '/assets/card11-vIMz393q.png',
        author: '@Market Warrior Network',
        text: 'No more slow loading charts or missed opportunities.',
    },
    {
        image: '/assets/card12-H9cfDOMv.png',
        author: '@traderfx',
        text: 'From laptop to anywhere, and the desktop app keeps my workflow seamless across devices!',
    },
];

export default function Section8() {
    return (
        <>
            <section className="max-w-[1376px] w-full mx-auto flex flex-col py-4 sm:py-6 md:py-8 gap-4 sm:gap-6 md:gap-8 px-4 lg:px-0">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-[#F4F4F4] font-semibold text-[36px] sm:text-[48px] md:text-[64px] leading-tight md:leading-[64px] uppercase">
                        Love in every
                        <br />
                        #TradingView
                    </h2>
                </div>

                {/* Stats Section */}
                <section className="p-4 sm:p-6 md:p-8 max-w-[1376px] w-full mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.value}
                                className="p-4 sm:p-6 md:p-8 flex relative flex-col gap-2 hover:bg-[#1A1F25] rounded-xl transition-colors duration-300 group"
                            >
                                <img
                                    src={stat.icon}
                                    alt=""
                                    className={`absolute top-0 ${stat.iconPosition}`}
                                />
                                <h3 className="text-[#D9DFE6] font-semibold text-3xl sm:text-4xl md:text-[48px] leading-tight md:leading-[56px] relative z-10 transition-colors duration-300">
                                    {stat.value}
                                </h3>
                                <p className="text-[#ADB6C3] font-medium text-base sm:text-lg md:text-[20px] leading-snug md:leading-[24px]">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials Section */}
                <div className="w-full relative px-4 md:px-0">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.author} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="w-full min-w-[280px] sm:min-w-[320px] flex flex-col gap-2 px-2 sm:px-0">
                                        <img
                                            src={testimonial.image}
                                            className="rounded-[8px] w-full aspect-video object-cover"
                                            alt=""
                                        />
                                        <span className="text-white font-bold text-[16px] sm:text-[18px] leading-tight sm:leading-[24px]">
                                            {testimonial.author}
                                        </span>
                                        <p className="text-[#B8B8B8] text-[16px] sm:text-[18px] leading-tight sm:leading-[24px]">
                                            {testimonial.text}
                                        </p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex size-8 bg-[#1F1F1F] border-none rounded-full items-center justify-center transition-all duration-300 hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed left-0 md:-left-12 text-[#B2B5BE] hover:text-white" />
                        <CarouselNext className="hidden md:flex size-8 bg-[#1F1F1F] border-none rounded-full items-center justify-center transition-all duration-300 hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed right-0 md:-right-12 text-[#B2B5BE] hover:text-white" />
                    </Carousel>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full min-h-[400px] sm:min-h-[480px] md:min-h-[560px] relative flex flex-col gap-4 sm:gap-6 md:gap-8 items-center justify-center px-4 sm:px-6 md:px-8">
                <div className="p-4 relative z-10 flex flex-col items-center text-center justify-center gap-3 sm:gap-4 md:gap-6 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                    <h2 className="text-[#F4F4F4] uppercase font-bold text-[32px] sm:text-[48px] md:text-[64px] leading-tight sm:leading-tight md:leading-[64px] tracking-tight">
                        <span className="block">Join 90 million</span>
                        <span className="block">traders and investors</span>
                    </h2>
                    <p className="text-[#D0D3D7] font-bold text-[18px] sm:text-[22px] md:text-[28px] leading-snug sm:leading-normal md:leading-[40px]">
                        Harness the power of the world's most popular financial analysis platform.
                    </p>
                </div>

                {/* CTA Button */}
                <div className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px] relative z-10">
                    <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] w-full group cursor-pointer hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600" />
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                            style={{ filter: 'brightness(1.2)', mixBlendMode: 'soft-light' }}
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-500 ease-in-out opacity-20 -translate-x-full group-hover:translate-x-full"
                            style={{ width: '50%' }}
                        />
                        <span className="relative z-10">Install now</span>
                    </button>
                </div>

                {/* Background Gradient */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/assets/gradient-B_HeJV--.webp"
                        className="absolute top-0 left-0 w-full h-full mix-blend-exclusion"
                        alt=""
                    />
                </div>
            </section>
        </>
    );
}
