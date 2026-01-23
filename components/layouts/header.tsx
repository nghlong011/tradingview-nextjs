import GradientButton from "../ui/gradient-button";
import Image from "next/image";


export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
            <div className="max-w-[1376px] mx-auto flex items-center justify-between py-4 px-4 sm:py-5 sm:px-8">
                <div className="flex items-center gap-8">
                    <Image src="/assets/logo-e4fVpnHH.svg" alt="Logo" className="w-auto h-8" width={100} height={100} />
                    <nav className="hidden lg:flex items-center gap-2">
                        <a href="#"
                            className="relative text-[#D9DFE6] font-medium text-base py-2 px-4 transition-colors duration-300 hover:text-white group inline-block"
                            tabIndex={0}>
                            Home
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all duration-300"></span>
                        </a>
                        <a href="#charts"
                            className="relative text-[#D9DFE6] font-medium text-base py-2 px-4 transition-colors duration-300 hover:text-white group inline-block"
                            tabIndex={0}>
                            Charts
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all duration-300"></span>
                        </a>
                        <a href="#alert"
                            className="relative text-[#D9DFE6] font-medium text-base py-2 px-4 transition-colors duration-300 hover:text-white group inline-block"
                            tabIndex={0}>
                            Alerts
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all duration-300"></span>
                        </a>
                        <a href="#screeners"
                            className="relative text-[#D9DFE6] font-medium text-base py-2 px-4 transition-colors duration-300 hover:text-white group inline-block"
                            tabIndex={0}>
                            Screeners
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all duration-300"></span>
                        </a>
                        <a href="#pricing"
                            className="relative text-[#D9DFE6] font-medium text-base py-2 px-4 transition-colors duration-300 hover:text-white group inline-block"
                            tabIndex={0}>
                            Pricing
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 opacity-0 group-hover:w-1/2 group-hover:opacity-100 transition-all duration-300"></span>
                        </a>
                    </nav>
                </div>
                <div className="flex items-center gap-4 md:max-w-[316px] md:w-full relative z-20">
                    <div className="relative">
                        <button className="flex items-center gap-2 px-3 py-2 text-[#D9DFE6] hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                <path d="M2 12h20"></path>
                            </svg>
                            <span className="hidden sm:inline">English</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down transition-transform duration-300">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </button>
                    </div>
                    <GradientButton text="Download" />
                    <div className="w-6 h-5 relative sm:hidden">
                        <span className="absolute w-full h-0.5 bg-white rounded-full transform transition-all duration-300 ease-in-out rotate-0 top-0"></span>
                        <span className="absolute w-full h-0.5 bg-white rounded-full top-2 transition-all duration-300 ease-in-out opacity-100"></span>
                        <span className="absolute w-full h-0.5 bg-white rounded-full transform transition-all duration-300 ease-in-out rotate-0 top-4"></span>
                    </div>
                </div>
            </div>
        </header>
    );
}