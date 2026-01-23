export default function Section6() {
    return (
        <section
            id="alert"
            className="max-w-[1376px] w-full mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-4"
        >
            {/* Header Content */}
            <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center text-center">
                <h2 className="text-[#F4F4F4] font-semibold text-[36px] sm:text-[48px] md:text-[64px] leading-tight md:leading-[64px] uppercase">
                    Unmissable alerts
                </h2>
                <p className="text-[#D0D3D7] text-[18px] sm:text-[22px] md:text-[28px] leading-snug sm:leading-normal md:leading-[40px] capitalize max-w-[90%] md:max-w-[80%]">
                    Trading alerts were never this powerful, flexible and easy to use. Cloud-based, they are available on
                    any device and can be powered by Pine Script®.
                </p>
            </div>

            {/* Alert Image */}
            <img
                src="/assets/unmis-By8PKKIj.webp"
                alt="Unmissable alerts"
                className="w-full h-auto mix-blend-exclusion hover:scale-[1.02] transition-transform duration-500"
            />
        </section>
    );
}
