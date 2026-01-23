import ViewOne from "@/app/view-one";
import ViewTwo from "@/app/view-two";
import type { Metadata } from "next";

// Function chung để kiểm tra điều kiện (dùng cho cả metadata và component)
async function checkCondition(): Promise<boolean> {
  // TODO: Thay thế logic này bằng logic thực tế của bạn
  // Ví dụ: 
  // - return await checkUserStatus();
  // - return cookies().get('user') !== undefined;
  // - return someBusinessLogic();
  return false; // Placeholder - thay đổi giá trị này để test
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
