import Header from "../components/layouts/header";
import Section1 from "../components/sections/section-1";
import Section2 from "../components/sections/section-2";
import Section3 from "../components/sections/section-3";
import Section4 from "../components/sections/section-4";
import Section5 from "../components/sections/section-5";
import Section6 from "../components/sections/section-6";
import Section7 from "../components/sections/section-7";
import Section8 from "../components/sections/section-8";
import Footer from "../components/layouts/footer";

// Component cho View 1 - hiển thị khi điều kiện được thỏa mãn
export default function ViewOne() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <Header />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
        <Section7 />
        <Section8 />
        <Footer />
    </div>
  );
}
