export default function GradientButton({ text }: { text: string }) {
    return (
        <button className="relative w-full flex px-4 items-center justify-center rounded-lg overflow-hidden transition-all duration-300 py-2 sm:py-3 md:py-4 text-[#F4F4F4] font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] w-full max-w-[280px] sm:max-w-[320px] group cursor-pointer hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 mix-blend-soft-light brightness-120"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-500 ease-in-out opacity-20 -translate-x-full group-hover:translate-x-full w-1/2"></div>
            <span className="relative z-10">{text}</span>
        </button>
    );
}